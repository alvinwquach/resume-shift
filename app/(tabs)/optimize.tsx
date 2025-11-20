import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AnalysisResults } from "../../components/AnalysisResults";
import { useAuth } from "../../hooks/useAuth";
import { useResumeLoader } from "../../hooks/useResumeLoader";
import { useResumeAnalysis } from "../../hooks/useResumeAnalysis";
import { ResumeAnalysisResult } from "../../types/analysis";
import { Message } from "../../types/message";

export default function Optimize() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [resumeSwitcherExpanded, setResumeSwitcherExpanded] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    resumeFile,
    resumeText,
    allResumes,
    isLoadingResume,
    messages,
    setMessages,
    loadSavedResume,
  } = useResumeLoader(user?.uid, selectedResumeId, 0);

  // Analysis logic
  const {
    isLoading,
    manualJobMode,
    analyzeManualJob,
    analyzeJobUrl,
  } = useResumeAnalysis(user?.uid, resumeText, resumeFile, allResumes, selectedResumeId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Reload resume whenever the tab gains focus
  useFocusEffect(
    useCallback(() => {
      console.log('Optimize page focused, reloading resume...');
      loadSavedResume();
    }, [loadSavedResume])
  );

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
      await analyzeManualJob(userMessage, messages, setMessages);
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

    await analyzeJobUrl(userMessage, messages, setMessages);
  };

  if (isLoadingResume) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-zinc-400 mt-4 text-sm">Loading your resume...</Text>
      </View>
    );
  }

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

      <View className="border-t border-zinc-800/50 bg-black/95">
        {resumeFile && allResumes.length > 1 && (
          <View className="px-4 pt-3">
            <TouchableOpacity
              onPress={() => setResumeSwitcherExpanded(!resumeSwitcherExpanded)}
              className="flex-row items-center justify-between px-3 py-2 bg-zinc-900/60 border border-zinc-800/50 rounded-lg mb-2"
              activeOpacity={0.7}
            >
              <View className="flex-row items-center flex-1">
                <Ionicons name="document-text" size={14} color="#22c55e" />
                <Text className="text-green-400 text-xs ml-2 flex-1" numberOfLines={1}>
                  {resumeFile.name}
                </Text>
              </View>
              <View className="flex-row items-center ml-2">
                <Text className="text-zinc-500 text-xs mr-1.5">{allResumes.length} versions</Text>
                <Ionicons
                  name={resumeSwitcherExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color="#71717a"
                />
              </View>
            </TouchableOpacity>
            {resumeSwitcherExpanded && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-2"
                contentContainerStyle={{ paddingRight: 16 }}
              >
                {allResumes.map((resume) => {
                  const isSelected = resume.id === selectedResumeId || (!selectedResumeId && resume.isDefault);
                  return (
                    <TouchableOpacity
                      key={resume.id}
                      onPress={() => {
                        setSelectedResumeId(resume.id);
                        setMessages([]); 
                        setResumeSwitcherExpanded(false);
                      }}
                      className={`mr-2 px-3 py-2 rounded-lg border ${
                        isSelected
                          ? 'bg-blue-600/20 border-blue-600/50'
                          : 'bg-zinc-900/50 border-zinc-800'
                      }`}
                      style={{ minWidth: 140 }}
                    >
                      <View className="flex-row items-center mb-1">
                        <Ionicons
                          name="document-text"
                          size={12}
                          color={isSelected ? "#3b82f6" : "#71717a"}
                        />
                        <Text
                          className={`text-xs font-medium ml-1.5 flex-1 ${
                            isSelected ? 'text-blue-400' : 'text-zinc-400'
                          }`}
                          numberOfLines={1}
                        >
                          {resume.label || resume.fileName}
                        </Text>
                        {isSelected && (
                          <Ionicons name="checkmark-circle" size={12} color="#3b82f6" />
                        )}
                      </View>
                      <Text className="text-zinc-600 text-xs" numberOfLines={1}>
                        {new Date(resume.uploadedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}
        <View className="px-4 pb-6" style={{ paddingBottom: Platform.OS === "web" ? 24 : 32 }}>
          <View className="flex-row items-center">
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
        </View>
      </View>

    </KeyboardAvoidingView>
  );
}
