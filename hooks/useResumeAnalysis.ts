import { useState } from 'react';
import { Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { saveAnalysis } from '../services/analysisService';
import { FUNCTIONS_ENDPOINTS } from '../services/functionsConfig';
import { ResumeAnalysisResult } from '../types/analysis';
import { Message } from '../types/message';
import { UserResume } from '../services/resumeService';
import { parseJobDescription } from '../utils/jobParser';

export function useResumeAnalysis(
  userId: string | undefined,
  resumeText: string,
  resumeFile: DocumentPicker.DocumentPickerAsset | null,
  allResumes: UserResume[],
  selectedResumeId: string | null
) {
  const [isLoading, setIsLoading] = useState(false);
  const [manualJobMode, setManualJobMode] = useState(false);
  const [manualJobUrl, setManualJobUrl] = useState("");

  /**
   * Analyze resume against a manually pasted job description
   */
  const analyzeManualJob = async (
    userInput: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
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
      const { jobTitle, company, jobDescription } = parseJobDescription(userInput, manualJobUrl);

      const analysisResponse = await fetch(FUNCTIONS_ENDPOINTS.ANALYZE_STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      const partialResult = await streamAnalysisResponse(
        analysisResponse,
        streamingMsg,
        messages,
        setMessages,
        jobTitle,
        company
      );

      // Save to Firebase
      if (userId && partialResult) {
        await saveAnalysisToFirebase(
          userId,
          manualJobUrl,
          jobTitle,
          company,
          partialResult,
          resumeFile,
          allResumes,
          selectedResumeId
        );

        // Reset manual mode
        setManualJobMode(false);
        setManualJobUrl("");
      }
    } catch (error) {
      handleAnalysisError(error, streamingMsg, setMessages);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Analyze resume against a job URL
   */
  const analyzeJobUrl = async (
    jobUrl: string,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
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
      // Fetch job posting
      const jobResponse = await fetch(FUNCTIONS_ENDPOINTS.FETCH_JOB, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobUrl }),
      });

      if (!jobResponse.ok) {
        const errorData = await jobResponse.json().catch(() => ({ error: 'Failed to fetch job posting' }));
        throw new Error(errorData.error || "Failed to fetch job posting");
      }

      const jobData = await jobResponse.json();

      if (!jobData.description || jobData.description.length < 200) {
        throw new Error("The job posting could not be accessed. This website may block automated access. Please try a different job posting.");
      }

      setMessages(prev => prev.map(msg =>
        msg.id === streamingMsg.id
          ? { ...msg, content: `Found the job posting: ${jobData.title || 'Job'} at ${jobData.company || 'Company'}\n\nAnalyzing your resume match...` }
          : msg
      ));

      // Analyze resume
      const analysisResponse = await fetch(FUNCTIONS_ENDPOINTS.ANALYZE_STREAM, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription: jobData.description }),
      });

      if (!analysisResponse.ok) {
        throw new Error("Failed to analyze resume");
      }

      const partialResult = await streamAnalysisResponse(
        analysisResponse,
        streamingMsg,
        messages,
        setMessages,
        jobData.title,
        jobData.company
      );

      // Save to Firebase
      if (userId && partialResult) {
        await saveAnalysisToFirebase(
          userId,
          jobUrl,
          jobData.title,
          jobData.company,
          partialResult,
          resumeFile,
          allResumes,
          selectedResumeId
        );
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sorry, I encountered an error analyzing that job posting. Please check the URL and try again.";

      const isScrapingError = errorMessage.includes("could not be accessed") ||
                              errorMessage.includes("block") ||
                              errorMessage.includes("denied");

      if (isScrapingError) {
        setManualJobMode(true);
        setManualJobUrl(jobUrl);
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
        handleAnalysisError(error, streamingMsg, setMessages);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Stream analysis response and update UI in real-time
   */
  const streamAnalysisResponse = async (
    response: Response,
    streamingMsg: Message,
    messages: Message[],
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    jobTitle: string,
    company?: string
  ): Promise<Partial<ResumeAnalysisResult> | null> => {
    const reader = response.body?.getReader();
    if (!reader) {
      console.error('No reader available!');
      return null;
    }

    const decoder = new TextDecoder();
    let buffer = "";
    let partialResult: Partial<ResumeAnalysisResult> = {};

    setMessages(prev => prev.map(msg =>
      msg.id === streamingMsg.id
        ? {
            ...msg,
            analysisResult: {},
            isStreaming: true,
            content: '',
            jobTitle,
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
                      jobTitle,
                      jobCompany: company || undefined
                    }
                  : msg
              ));
            }
          } catch (parseError) {
            // Ignore parse errors during streaming
          }
        }
      } catch (e) {
        // Ignore errors during buffer processing
      }
    }

    // Final update - mark as complete
    setMessages(prev => prev.map(msg =>
      msg.id === streamingMsg.id
        ? { ...msg, isStreaming: false }
        : msg
    ));

    return partialResult;
  };

  /**
   * Save analysis to Firebase
   */
  const saveAnalysisToFirebase = async (
    userId: string,
    jobUrl: string,
    jobTitle: string,
    company: string | undefined,
    partialResult: Partial<ResumeAnalysisResult>,
    resumeFile: DocumentPicker.DocumentPickerAsset | null,
    allResumes: UserResume[],
    selectedResumeId: string | null
  ) => {
    try {
      const selectedResume = allResumes.find(r => r.id === selectedResumeId);

      const analysisId = await saveAnalysis(
        userId,
        jobUrl,
        jobTitle || undefined,
        company || undefined,
        resumeFile?.name || '',
        partialResult as ResumeAnalysisResult,
        selectedResume?.id,
        selectedResume?.label
      );

      console.log('Analysis saved successfully with ID:', analysisId);
    } catch (saveError) {
      console.error("Failed to save analysis:", saveError);
      Alert.alert("Warning", "Analysis completed but failed to save to history");
    }
  };

  /**
   * Handle analysis errors
   */
  const handleAnalysisError = (
    error: unknown,
    streamingMsg: Message,
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  ) => {
    console.error("Analysis error:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Sorry, I encountered an error analyzing the job description.";

    setMessages(prev => prev.map(msg =>
      msg.id === streamingMsg.id
        ? { ...msg, content: errorMessage, isStreaming: false }
        : msg
    ));
  };

  return {
    isLoading,
    manualJobMode,
    manualJobUrl,
    setManualJobMode,
    setManualJobUrl,
    analyzeManualJob,
    analyzeJobUrl,
  };
}
