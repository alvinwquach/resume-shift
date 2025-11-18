import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AnalysisResults } from "../../components/AnalysisResults";
import { useAuth } from "../../hooks/useAuth";
import { saveAnalysis } from "../../services/analysisService";
import { uploadResumeToStorage } from "../../services/storageService";
import { ResumeAnalysisResult } from "../../types/analysis";
import { FUNCTIONS_ENDPOINTS } from "../../services/functionsConfig";

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

export default function OptimizePage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your resume optimization assistant. I'll help you analyze how well your resume matches any job posting.\n\nTo get started, please upload your resume using the button below.",
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [resumeText, setResumeText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleUploadResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setResumeFile(file);

        // Add user message
        const userMsg: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: `📄 Uploaded: ${file.name}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);

        // Upload file and extract text
        try {
          let text = "";

          if (!user) {
            throw new Error("You must be logged in to upload files");
          }

          // Show uploading message
          const uploadingMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "Uploading your resume to secure storage...",
            timestamp: new Date(),
            isStreaming: true,
          };
          setMessages(prev => [...prev, uploadingMsg]);

          // Get file as blob for upload
          let fileBlob: Blob;

          if (Platform.OS === 'web') {
            // Web: use fetch to get blob
            const response = await fetch(file.uri);
            fileBlob = await response.blob();
          } else {
            // Native: read file and create blob
            const base64 = await FileSystem.readAsStringAsync(file.uri, {
              encoding: 'base64',
            });
            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            fileBlob = new Blob([byteArray], { type: file.mimeType || 'application/octet-stream' });
          }

          console.log('Uploading file to Firebase Storage:', file.name, fileBlob.size, 'bytes');

          // Upload to Firebase Storage
          const fileUrl = await uploadResumeToStorage(user.uid, fileBlob, file.name);

          console.log('File uploaded, URL:', fileUrl);

          // Update message to show extraction
          setMessages(prev => prev.map(msg =>
            msg.id === uploadingMsg.id
              ? { ...msg, content: "Extracting text from your resume..." }
              : msg
          ));

          // Extract text via serverless function (downloads from Firebase Storage)
          const extractResponse = await fetch(FUNCTIONS_ENDPOINTS.EXTRACT_RESUME, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileUrl,  // Use Firebase Storage URL instead of base64
              fileName: file.name,
              mimeType: file.mimeType,
            }),
          });

          if (!extractResponse.ok) {
            const errorData = await extractResponse.json().catch(() => ({}));
            throw new Error(errorData.error || "Failed to extract text from file");
          }

          const extractData = await extractResponse.json();
          text = extractData.text;

          // Remove uploading message
          setMessages(prev => prev.filter(msg => msg.id !== uploadingMsg.id));

          if (!text || text.trim().length === 0) {
            throw new Error("File appears to be empty");
          }

          setResumeText(text);

          // Add assistant response
          const assistantMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `Perfect! I've extracted the text from your resume.\n\nNow, please paste the job posting URL you'd like to analyze against.`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, assistantMsg]);
        } catch (error) {
          console.error("Error reading file:", error);
          const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I had trouble reading that file. ${error instanceof Error ? error.message : 'Please try uploading a different file.'}\n\nSupported formats: TXT, DOCX\n\n💡 If you have a PDF, please convert it to DOCX or TXT first.`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMsg]);
          setResumeFile(null);
        }
      }
    } catch (error) {
      console.error("Error picking document:", error);
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
        throw new Error("Failed to fetch job posting");
      }

      const jobData = await jobResponse.json();

      setMessages(prev => prev.map(msg =>
        msg.id === streamingMsg.id
          ? { ...msg, content: `Found the job posting: ${jobData.title || 'Job'} at ${jobData.company || 'Company'}\n\nAnalyzing your resume match...` }
          : msg
      ));

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
            await saveAnalysis(
              user.uid,
              userMessage,
              jobData.title,
              jobData.company,
              resumeFile.name,
              partialResult as ResumeAnalysisResult
            );
          } catch (saveError) {
            console.error("Failed to save analysis:", saveError);
          }
        }
      } else {
        console.error('No reader available!');
      }

    } catch (error) {
      console.error("Analysis error:", error);
      setMessages(prev => prev.map(msg =>
        msg.id === streamingMsg.id
          ? {
              ...msg,
              content: "Sorry, I encountered an error analyzing that job posting. Please check the URL and try again.",
              isStreaming: false
            }
          : msg
      ));
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
          <TouchableOpacity
            onPress={handleUploadResume}
            className="w-10 h-10 rounded-full items-center justify-center bg-zinc-800/60 mr-2 active:opacity-70"
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Ionicons
              name={resumeFile ? "document-attach" : "attach-outline"}
              size={20}
              color={resumeFile ? "#3b82f6" : "#71717a"}
            />
          </TouchableOpacity>
          <View className={`flex-1 rounded-3xl mr-2 ${
            resumeFile
              ? 'bg-zinc-900/80 border border-zinc-800/60'
              : 'bg-zinc-900/40 border border-zinc-800/40'
          }`}>
            {!resumeFile ? (
              <TouchableOpacity
                onPress={handleUploadResume}
                className="px-4 py-3 flex-row items-center"
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-upload-outline" size={16} color="#3b82f6" />
                <Text className="text-zinc-500 text-sm ml-2">
                  Upload resume to get started
                </Text>
              </TouchableOpacity>
            ) : (
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Paste job posting URL..."
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
            <TouchableOpacity
              onPress={() => {
                setResumeFile(null);
                setResumeText("");
                setMessages([{
                  id: Date.now().toString(),
                  role: 'assistant',
                  content: "Resume removed. Please upload a new resume to continue.",
                  timestamp: new Date(),
                }]);
              }}
              className="ml-2 p-1"
            >
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
