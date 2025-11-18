import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AnalysisResults } from "../../components/AnalysisResults";
import { useAuth } from "../../hooks/useAuth";
import { saveAnalysis } from "../../services/analysisService";
import { FUNCTIONS_ENDPOINTS } from "../../services/functionsConfig";
import { getUserResume } from "../../services/resumeService";
import { ResumeAnalysisResult } from "../../types/analysis";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  analysisResult?: Partial<ResumeAnalysisResult>;
  jobTitle?: string;
  jobCompany?: string;
};

export default function Optimize() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [manualJobMode, setManualJobMode] = useState(false);
  const [manualJobUrl, setManualJobUrl] = useState("");
  const [manualJobTitle, setManualJobTitle] = useState("");
  const [manualJobCompany, setManualJobCompany] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Load saved resume - use useFocusEffect to reload when user returns to this tab
  const loadSavedResume = useCallback(async () => {
    if (!user) {
      setIsLoadingResume(false);
      return;
    }

    try {
      console.log('Loading saved resume for user:', user.uid);
      const savedResume = await getUserResume(user.uid);

      if (savedResume && savedResume.extractedText) {
        // Use saved resume
        console.log('Found saved resume:', savedResume.fileName);
        setResumeText(savedResume.extractedText);
        setResumeFileName(savedResume.fileName);
        setResumeFile({
          name: savedResume.fileName,
          uri: savedResume.fileUrl,
          mimeType: savedResume.mimeType,
          size: savedResume.fileSize,
        } as DocumentPicker.DocumentPickerAsset);

        // Only set welcome message if messages are empty or only have the initial message
        if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')) {
          setMessages([{
            id: '1',
            role: 'assistant',
            content: `Hi! I'm your resume optimization assistant.\n\nI've loaded your saved resume: **${savedResume.fileName}**\n\nPaste a job posting URL below to analyze how well your resume matches!`,
            timestamp: new Date(),
          }]);
        }
      } else {
        // No saved resume
        console.log('No saved resume found');
        if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')) {
          setMessages([{
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your resume optimization assistant.\n\nIt looks like you haven't uploaded a resume yet. Please go to the Dashboard tab to upload your resume first, then come back here to analyze job postings!",
            timestamp: new Date(),
          }]);
        }
      }
    } catch (error) {
      console.error("Error loading saved resume:", error);
      if (messages.length === 0 || (messages.length === 1 && messages[0].role === 'assistant')) {
        setMessages([{
          id: '1',
          role: 'assistant',
          content: "Hi! I'm your resume optimization assistant.\n\nPlease upload your resume on the Dashboard tab to get started.",
          timestamp: new Date(),
        }]);
      }
    } finally {
      setIsLoadingResume(false);
    }
  }, [user, messages.length]);

  // Reload resume whenever the tab gains focus
  useFocusEffect(
    useCallback(() => {
      console.log('Optimize page focused, reloading resume...');
      loadSavedResume();
    }, [loadSavedResume])
  );


  const handleManualJobDescription = async (userInput: string) => {
    setIsLoading(true);

    const streamingMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Analyzing your resume against the job description...",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, streamingMsg]);

    try {
      // Parse the input to extract job title, company, and description
      // Try multiple formats
      let jobTitle = '';
      let company = '';
      let jobDescription = userInput;

      const lines = userInput.split('\n').filter(line => line.trim().length > 0);

      console.log('[Manual Job] Input received:', {
        totalLength: userInput.length,
        lineCount: lines.length,
        firstLine: lines[0]?.substring(0, 200),
        secondLine: lines[1]?.substring(0, 200),
        thirdLine: lines[2]?.substring(0, 200)
      });

      if (lines.length > 0) {
        const firstLine = lines[0].trim();
        const secondLine = lines.length > 1 ? lines[1].trim() : '';

        // Format 1: "Job Title at Company"
        const atMatch = firstLine.match(/^(.+?)\s+at\s+(.+)$/i);
        if (atMatch) {
          jobTitle = atMatch[1].trim();
          company = atMatch[2].trim();
          jobDescription = lines.slice(1).join('\n').trim();
          console.log('[Manual Job] Matched format 1: "Title at Company"');
        }
        // Format 2: "Company - Job Title"
        else if (firstLine.includes('-') || firstLine.includes('–') || firstLine.includes('—')) {
          const dashMatch = firstLine.match(/^(.+?)\s*[-–—]\s*(.+)$/);
          if (dashMatch) {
            company = dashMatch[1].trim();
            jobTitle = dashMatch[2].trim();
            jobDescription = lines.slice(1).join('\n').trim();
            console.log('[Manual Job] Matched format 2: "Company - Title"');
          }
        }
        // Format 3: First line is title, second line is company
        else if (secondLine.length > 0 && secondLine.length < 100 && !secondLine.toLowerCase().includes('responsibilities') && !secondLine.toLowerCase().includes('requirements')) {
          jobTitle = firstLine;
          // Clean up common prefixes from company name
          let cleanedCompany = secondLine
            .replace(/^(job category|category|company|location|posted by)\s*[:|\t]\s*/i, '')
            .trim();

          // If the company name contains multiple parts (e.g., "Tesla AI"), extract just the first part (company name)
          // Common patterns: "Tesla AI", "Google Cloud", "Meta Reality Labs", etc.
          const companyMatch = cleanedCompany.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+[A-Z]/);
          if (companyMatch) {
            company = companyMatch[1].trim();
          } else {
            company = cleanedCompany.split(/\s+(AI|Cloud|Labs|Team|Group|Division|Department)/i)[0].trim();
          }

          jobDescription = lines.slice(2).join('\n').trim();
          console.log('[Manual Job] Matched format 3: Separate lines, cleaned company:', company);
        }
        // Format 4: Just use first line as title (if it looks like a title)
        else if (firstLine.length < 150) {
          jobTitle = firstLine;
          jobDescription = lines.slice(1).join('\n').trim();
          console.log('[Manual Job] Matched format 4: First line as title');
        }
      }

      // Try to extract from URL if we still don't have a job title and we have a manual job URL
      if (!jobTitle && manualJobUrl) {
        const urlParts = manualJobUrl.split('/').filter(part => part.length > 0);
        const lastPart = urlParts[urlParts.length - 1];
        if (lastPart && lastPart.length > 5) {
          // Convert URL slug to title case (e.g., "fullstack-software-engineer" -> "Fullstack Software Engineer")
          jobTitle = lastPart
            .split(/[-_]/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .replace(/\d+/g, '')
            .trim();
          console.log('[Manual Job] Extracted title from URL:', jobTitle);
        }
      }

      // Default fallback
      if (!jobTitle || jobTitle.length === 0) {
        jobTitle = 'Job Application';
        jobDescription = userInput;
        console.log('[Manual Job] Using fallback title');
      }

      console.log('[Manual Job] Final parsed result:', {
        jobTitle,
        company,
        descriptionLength: jobDescription.length
      });

      const analysisResponse = await fetch(FUNCTIONS_ENDPOINTS.ANALYZE_STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      console.log('Analysis response received, starting to read stream...');

      const reader = analysisResponse.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let partialResult: Partial<ResumeAnalysisResult> = {};

      if (reader) {
        setMessages(prev => prev.map(msg =>
          msg.id === streamingMsg.id
            ? {
                ...msg,
                analysisResult: {},
                isStreaming: true,
                content: '',
                jobTitle: jobTitle,
                jobCompany: company || undefined
              }
            : msg
        ));

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log('Stream complete!');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          try {
            const jsonMatch = buffer.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const potentialJson = jsonMatch[0];

              try {
                const parsed = JSON.parse(potentialJson) as Partial<ResumeAnalysisResult>;

                const hasNewData = Object.keys(parsed).some(key => {
                  const typedKey = key as keyof ResumeAnalysisResult;
                  return JSON.stringify(parsed[typedKey]) !== JSON.stringify(partialResult[typedKey]);
                });

                if (hasNewData) {
                  partialResult = { ...partialResult, ...parsed };
                  console.log('Updated partial result:', Object.keys(partialResult));

                  setMessages(prev => prev.map(msg =>
                    msg.id === streamingMsg.id
                      ? {
                          ...msg,
                          analysisResult: partialResult,
                          isStreaming: true,
                          content: '',
                          jobTitle: jobTitle,
                          jobCompany: company || undefined
                        }
                      : msg
                  ));
                }
              } catch (parseError) {
              }
            }
          } catch (e) {
          }
        }

        // Final update - mark as complete
        setMessages(prev => prev.map(msg =>
          msg.id === streamingMsg.id
            ? { ...msg, isStreaming: false }
            : msg
        ));

        // Save to Firebase with final result
        if (user && partialResult) {
          try {
            console.log('[Save Analysis] Preparing to save manual job to Firestore:', {
              jobUrl: manualJobUrl,
              jobTitle: jobTitle,
              company: company || undefined,
              score: partialResult.compatibilityScore,
              resumeFile: resumeFile?.name
            });

            const analysisId = await saveAnalysis(
              user.uid,
              manualJobUrl,
              jobTitle || undefined,
              company || undefined,
              resumeFile?.name || '',
              partialResult as ResumeAnalysisResult
            );

            console.log('Analysis saved successfully with ID:', analysisId);

            // Reset manual mode
            setManualJobMode(false);
            setManualJobUrl("");
            setManualJobTitle("");
            setManualJobCompany("");
          } catch (saveError) {
            console.error("Failed to save analysis:", saveError);
            Alert.alert("Warning", "Analysis completed but failed to save to history");
          }
        }
      } else {
        console.error('No reader available!');
      }
    } catch (error) {
      console.error("Manual analysis error:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : "Sorry, I encountered an error analyzing the job description.";

      setMessages(prev => prev.map(msg =>
        msg.id === streamingMsg.id
          ? {
              ...msg,
              content: errorMessage,
              isStreaming: false
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText("");

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    // Check if resume is uploaded
    if (!resumeFile || !resumeText) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Please upload your resume first using the button above.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    // If in manual job mode, treat the message as job description
    if (manualJobMode) {
      await handleManualJobDescription(userMessage);
      return;
    }

    // Check if message looks like a URL
    const urlPattern = /https?:\/\//;
    if (!urlPattern.test(userMessage)) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "That doesn't look like a job posting URL. Please paste a valid URL (starting with http:// or https://)",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    setIsLoading(true);

    const streamingMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Let me analyze that job posting...",
      timestamp: new Date(),
      isStreaming: true,
    };
    setMessages(prev => [...prev, streamingMsg]);

    try {
      const jobResponse = await fetch(FUNCTIONS_ENDPOINTS.FETCH_JOB, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobUrl: userMessage }),
      });

      if (!jobResponse.ok) {
        const errorData = await jobResponse.json().catch(() => ({ error: 'Failed to fetch job posting' }));
        throw new Error(errorData.error || "Failed to fetch job posting");
      }

      const jobData = await jobResponse.json();

      // Check if job description is too short (likely an error)
      if (!jobData.description || jobData.description.length < 200) {
        throw new Error("The job posting could not be accessed. This website may block automated access. Please try a different job posting.");
      }

      console.log('[Job Fetch] Job data retrieved:', {
        title: jobData.title,
        company: jobData.company,
        descriptionLength: jobData.description?.length || 0,
        descriptionPreview: jobData.description?.substring(0, 200) || 'N/A'
      });

      setMessages(prev => prev.map(msg =>
        msg.id === streamingMsg.id
          ? { ...msg, content: `Found the job posting: ${jobData.title || 'Job'} at ${jobData.company || 'Company'}\n\nAnalyzing your resume match...` }
          : msg
      ));

      console.log('[Analysis Request] Sending analysis request:', {
        endpoint: FUNCTIONS_ENDPOINTS.ANALYZE_STREAM,
        resumeTextLength: resumeText.length,
        jobDescriptionLength: jobData.description?.length || 0,
        jobDescriptionPreview: jobData.description?.substring(0, 200) || 'N/A'
      });

      const analysisResponse = await fetch(FUNCTIONS_ENDPOINTS.ANALYZE_STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobData.description,
        }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      console.log('Analysis response received, starting to read stream...');

      const reader = analysisResponse.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let partialResult: Partial<ResumeAnalysisResult> = {};

      if (reader) {

        setMessages(prev => prev.map(msg =>
          msg.id === streamingMsg.id
            ? {
                ...msg,
                analysisResult: {},
                isStreaming: true,
                content: '',
                jobTitle: jobData.title,
                jobCompany: jobData.company
              }
            : msg
        ));

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            console.log('Stream complete!');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          try {
            const jsonMatch = buffer.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const potentialJson = jsonMatch[0];

              try {
                const parsed = JSON.parse(potentialJson) as Partial<ResumeAnalysisResult>;

                // Update partial result with any new fields
                const hasNewData = Object.keys(parsed).some(key => {
                  const typedKey = key as keyof ResumeAnalysisResult;
                  return JSON.stringify(parsed[typedKey]) !== JSON.stringify(partialResult[typedKey]);
                });

                if (hasNewData) {
                  partialResult = { ...partialResult, ...parsed };
                  console.log('Updated partial result:', Object.keys(partialResult));

                  // Update UI with partial result
                  setMessages(prev => prev.map(msg =>
                    msg.id === streamingMsg.id
                      ? {
                          ...msg,
                          analysisResult: partialResult,
                          isStreaming: true,
                          content: '',
                          jobTitle: jobData.title,
                          jobCompany: jobData.company
                        }
                      : msg
                  ));
                }
              } catch (parseError) {
              }
            }
          } catch (e) {
          }
        }

        // Final update - mark as complete
        setMessages(prev => prev.map(msg =>
          msg.id === streamingMsg.id
            ? { ...msg, isStreaming: false }
            : msg
        ));

        // Save to Firebase with final result
        if (user && partialResult) {
          try {
            console.log('[Save Analysis] Preparing to save to Firestore:', {
              jobUrl: userMessage,
              jobTitle: jobData.title,
              company: jobData.company,
              score: partialResult.compatibilityScore,
              resumeFile: resumeFile.name,
              hasProjectRecommendations: !!partialResult.projectRecommendations,
              projectCount: partialResult.projectRecommendations?.length || 0,
              firstProjectTitle: partialResult.projectRecommendations?.[0]?.title || 'N/A'
            });

            const analysisId = await saveAnalysis(
              user.uid,
              userMessage,
              jobData.title,
              jobData.company,
              resumeFile.name,
              partialResult as ResumeAnalysisResult
            );

            console.log('Analysis saved successfully with ID:', analysisId);
          } catch (saveError) {
            console.error("Failed to save analysis:", saveError);
            Alert.alert("Warning", "Analysis completed but failed to save to history");
          }
        } else {
          console.warn('Not saving analysis - missing user or result:', {
            hasUser: !!user,
            hasResult: !!partialResult,
            resultKeys: partialResult ? Object.keys(partialResult) : []
          });
        }
      } else {
        console.error('No reader available!');
      }

    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error
        ? error.message
        : "Sorry, I encountered an error analyzing that job posting. Please check the URL and try again.";

      // Check if it's a scraping/access error
      const isScrapingError = errorMessage.includes("could not be accessed") ||
                              errorMessage.includes("block") ||
                              errorMessage.includes("denied");

      if (isScrapingError) {
        // Offer manual paste option
        setManualJobMode(true);
        setManualJobUrl(userMessage);

        setMessages(prev => prev.map(msg =>
          msg.id === streamingMsg.id
            ? {
                ...msg,
                content: `${errorMessage}\n\n💡 **Alternative**: You can manually paste the job description instead.\n\nPlease provide the following information:\n1. Job title\n2. Company name\n3. Full job description\n\nFormat: [Job Title] at [Company]\n[Job Description]`,
                isStreaming: false
              }
            : msg
        ));
      } else {
        setMessages(prev => prev.map(msg =>
          msg.id === streamingMsg.id
            ? {
                ...msg,
                content: errorMessage,
                isStreaming: false
              }
            : msg
        ));
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View className="px-6 pt-16 pb-4 border-b border-zinc-800">
        <Text className="text-white text-2xl font-bold">Resume Optimizer</Text>
        <Text className="text-zinc-400 text-sm mt-1">AI-powered job fit analysis</Text>
      </View>
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            className={`mb-6 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <View className={`${message.role === 'user' ? 'ml-3' : 'mr-3'} mt-1`}>
              <View className={`w-8 h-8 rounded-full items-center justify-center ${
                message.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                <Ionicons
                  name={message.role === 'user' ? 'person' : 'hardware-chip'}
                  size={18}
                  color="white"
                />
              </View>
            </View>

            <View className="flex-1">
              {message.analysisResult ? (
                <View className="w-full max-w-4xl">
                  <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                    <AnalysisResults
                      result={message.analysisResult as ResumeAnalysisResult}
                      userEmail={user?.email || undefined}
                      jobTitle={message.jobTitle}
                      jobCompany={message.jobCompany}
                      resumeFileName={resumeFile?.name}
                    />
                  </View>
                  {message.isStreaming && (
                    <View className="flex-row items-center justify-center mt-4 py-3 bg-zinc-900/50 rounded-xl border border-zinc-800/50">
                      <ActivityIndicator size="small" color="#3b82f6" />
                      <Text className="text-blue-400 text-sm ml-2">Generating analysis...</Text>
                    </View>
                  )}
                  <Text className="text-zinc-600 text-xs mt-2 px-2 font-medium">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
              ) : (
                <>
                  <View
                    className={`max-w-[88%] rounded-xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600'
                        : 'bg-zinc-900 border border-zinc-800'
                    }`}
                  >
                    <Text
                      className={`leading-6 ${
                        message.role === 'user' ? 'text-white text-base' : 'text-zinc-300 text-base'
                      }`}
                    >
                      {message.content}
                    </Text>
                    {message.isStreaming && (
                      <View className="flex-row items-center mt-3 pt-3 border-t border-zinc-700/50">
                        <ActivityIndicator size="small" color="#3b82f6" />
                        <Text className="text-blue-400 text-sm ml-2">Thinking...</Text>
                      </View>
                    )}
                  </View>
                  <Text className="text-zinc-600 text-xs mt-2 px-2 font-medium">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="px-4 pb-6 border-t border-zinc-800/50 bg-black/95" style={{ paddingBottom: Platform.OS === "web" ? 24 : 32 }}>
        <View className="flex-row items-center mt-4">
          <View className={`flex-1 rounded-3xl mr-2 ${
            resumeFile
              ? 'bg-zinc-900/80 border border-zinc-800/60'
              : 'bg-zinc-900/40 border border-zinc-800/40'
          }`}>
            {!resumeFile ? (
              <View className="px-4 py-3 flex-row items-center">
                <Ionicons name="alert-circle-outline" size={16} color="#71717a" />
                <Text className="text-zinc-500 text-sm ml-2">
                  Upload resume on Dashboard to get started
                </Text>
              </View>
            ) : (
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder={manualJobMode ? "Paste job description text..." : "Paste job posting URL..."}
                placeholderTextColor="#71717a"
                className="text-white text-sm px-4"
                style={{
                  minHeight: 40,
                  maxHeight: 120,
                  paddingTop: 11,
                  paddingBottom: 11,
                  fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                }}
                multiline={true}
                editable={!isLoading}
                onSubmitEditing={handleSendMessage}
                returnKeyType="send"
                onKeyPress={(e) => {
                  // On web, handle Enter key to submit (Shift+Enter for new line)
                  if (Platform.OS === 'web' && e.nativeEvent.key === 'Enter') {
                    const nativeEvent = e.nativeEvent as any;
                    if (!nativeEvent.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }
                }}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!inputText.trim() || isLoading || !resumeFile}
            className={`w-10 h-10 rounded-full items-center justify-center active:opacity-80 ${
              inputText.trim() && !isLoading && resumeFile
                ? 'bg-blue-600'
                : 'bg-zinc-800/60'
            }`}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={18}
              color={inputText.trim() && !isLoading && resumeFile ? "#ffffff" : "#52525b"}
            />
          </TouchableOpacity>
        </View>
        {resumeFile && (
          <View className="flex-row items-center mt-3 px-2 py-2 bg-green-500/10 border border-green-500/20 rounded-xl">
            <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            <Text className="text-green-400 text-sm ml-2 flex-1 font-medium">{resumeFile.name}</Text>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
