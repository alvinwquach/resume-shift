import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ResumeAnalysisDemoSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
  accentBg: string;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  isStreaming?: boolean;
  showScore?: boolean;
  showSkills?: boolean;
  showRecommendations?: boolean;
}

export function ResumeAnalysisDemoSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor, accentBg }: ResumeAnalysisDemoSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [score, setScore] = useState(0);

  const skills = [
    { name: 'Technical Skills', match: 92 },
    { name: 'Experience Level', match: 85 },
    { name: 'Education', match: 78 },
    { name: 'Keywords', match: 95 }
  ];

  const streamAIMessage = useCallback((
    fullText: string,
    messageId: number,
    showAnalysis: boolean = false
  ) => {
    setIsTyping(true);

    const newMessage: Message = {
      id: messageId,
      type: 'ai',
      content: '',
      isStreaming: true,
      showScore: showAnalysis,
      showSkills: showAnalysis,
      showRecommendations: false
    };

    setMessages(prev => [...prev, newMessage]);

    let currentIndex = 0;
    const streamInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        const char = fullText[currentIndex];
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, content: msg.content + char } : msg
          )
        );
        currentIndex++;
      } else {
        clearInterval(streamInterval);
        setIsTyping(false);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId ? { ...msg, isStreaming: false } : msg
          )
        );

        if (showAnalysis) {
          animateScore();
          setTimeout(() => {
            setMessages(prev =>
              prev.map(msg =>
                msg.id === messageId ? { ...msg, showRecommendations: true } : msg
              )
            );
          }, 2000);
        }
      }
    }, 30);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      streamAIMessage(
        "Hi! I see that you have chosen 'Default Resume' as your current resume. Would you like me to analyze it against a job posting?",
        1,
        false
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [streamAIMessage]);

  const animateScore = () => {
    let current = 0;
    const target = 87;
    const interval = setInterval(() => {
      if (current >= target) {
        clearInterval(interval);
        setScore(target);
      } else {
        current += 2;
        setScore(Math.min(current, target));
      }
    }, 20);
  };

  const handleQuickAction = (action: string) => {
    if (isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: action
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponseId = Date.now() + 1;
      streamAIMessage(
        "Great! I've analyzed your resume against the Senior Software Engineer position at AcmeTech. Here's what I found:",
        aiResponseId,
        true
      );
    }, 1000);
  };

  return (
    <View className={`px-6 py-24 ${accentBg} border-y ${borderColor}`}>
      <View className="max-w-3xl mx-auto mb-16 items-center">
        <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'} rounded-full self-center`}>
          <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xs font-bold tracking-wide`}>
            RESUME ANALYSIS
          </Text>
        </View>
        <Text className={`text-4xl md:text-5xl font-black text-center mb-4 ${textColor}`}>
          See resume analysis in action
        </Text>
        <Text className={`text-lg text-center ${mutedColor}`}>
          Chat with our AI assistant to get instant feedback on your resume fit
        </Text>
      </View>
      <View className="max-w-3xl mx-auto w-full">
        <View className={`${cardBg} border ${borderColor} rounded-3xl shadow-2xl overflow-hidden w-full`}>
          <View className={`flex-row items-center p-4 border-b ${borderColor} ${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
            <View className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} items-center justify-center mr-3`}>
              <Ionicons name="chatbubbles" size={18} color="white" />
            </View>
            <View className="flex-1">
              <Text className={`text-base font-bold ${textColor}`}>Resume Analysis Chat</Text>
              <Text className={`text-xs ${mutedColor}`}>AI Assistant</Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <Text className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>● Online</Text>
            </View>
          </View>
          <View className="p-4">
            {messages.map((message, idx) => (
              <View key={message.id}>
                {message.type === 'user' ? (
                  <View className="flex-row justify-end items-start mb-4">
                    <View className="flex-1 mr-2 max-w-[85%]">
                      <View className={`${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-2xl rounded-tr-md p-3`}>
                        <Text className="text-white text-sm leading-relaxed">
                          {message.content}
                        </Text>
                      </View>
                    </View>
                    <View className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'} items-center justify-center`}>
                      <Ionicons name="person" size={16} color={isDarkMode ? '#fff' : '#1f2937'} />
                    </View>
                  </View>
                ) : (
                  <View className="flex-row items-start mb-4">
                    <View className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'} items-center justify-center mr-2`}>
                      <Ionicons name="sparkles" size={16} color="white" />
                    </View>
                    <View className="flex-1 max-w-[85%]">
                      <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-2xl rounded-tl-md p-3`}>
                        <Text className={`${textColor} text-sm leading-relaxed`}>
                          {message.content}
                          {message.isStreaming && <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>▊</Text>}
                        </Text>
                        {message.showScore && !message.isStreaming && (
                          <View className="mt-4">
                            <Text className={`text-sm font-bold ${textColor} mb-3`}>📊 Resume Analysis Results</Text>
                            <Text className={`text-xs ${mutedColor} mb-1`}>Senior Software Engineer at AcmeTech</Text>
                            <Text className={`text-xs ${mutedColor} mb-4`}>Resume: default-resume.pdf</Text>
                            <View className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} rounded-xl p-4 mb-4 border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'}`}>
                              <Text className={`text-xs ${mutedColor} mb-1`}>Compatibility Score</Text>
                              <Text className={`text-4xl font-black ${textColor} mb-1`}>{score}%</Text>
                              <View className="flex-row items-center">
                                <Text className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Good Match</Text>
                                <Text className="ml-2">🏆</Text>
                              </View>
                            </View>
                            <View className="mb-4">
                              <Text className={`text-xs font-bold ${textColor} mb-2`}>🏆 Competitive Position</Text>
                              <Text className={`text-xs ${mutedColor} leading-relaxed`}>
                                You are a strong candidate for this Senior Software Engineer role. Your experience with React, TypeScript, and modern web technologies aligns well with the position requirements. With some targeted improvements, you can position yourself as a top-tier candidate.
                              </Text>
                            </View>
                            <View className="mb-4">
                              <Text className={`text-xs font-bold ${textColor} mb-2`}>✅ Strengths</Text>
                              <View className="space-y-1.5">
                                <View className="flex-row items-start mb-1.5">
                                  <Text className={`${mutedColor} text-xs mr-1`}>•</Text>
                                  <Text className={`flex-1 ${mutedColor} text-xs leading-relaxed`}>
                                    Extensive experience with React and TypeScript, core technologies for this role
                                  </Text>
                                </View>
                                <View className="flex-row items-start mb-1.5">
                                  <Text className={`${mutedColor} text-xs mr-1`}>•</Text>
                                  <Text className={`flex-1 ${mutedColor} text-xs leading-relaxed`}>
                                    Proven track record building scalable web applications
                                  </Text>
                                </View>
                                <View className="flex-row items-start">
                                  <Text className={`${mutedColor} text-xs mr-1`}>•</Text>
                                  <Text className={`flex-1 ${mutedColor} text-xs leading-relaxed`}>
                                    Strong understanding of modern development practices and cloud platforms
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View className="mb-4">
                              <Text className={`text-xs font-bold ${textColor} mb-2`}>⚠️ Areas to Improve</Text>
                              <View className="space-y-1.5">
                                <View className="flex-row items-start mb-1.5">
                                  <Text className={`${mutedColor} text-xs mr-1`}>•</Text>
                                  <Text className={`flex-1 ${mutedColor} text-xs leading-relaxed`}>
                                    Limited demonstration of system design experience at scale
                                  </Text>
                                </View>
                                <View className="flex-row items-start mb-1.5">
                                  <Text className={`${mutedColor} text-xs mr-1`}>•</Text>
                                  <Text className={`flex-1 ${mutedColor} text-xs leading-relaxed`}>
                                    No clear examples of mentoring junior developers
                                  </Text>
                                </View>
                                <View className="flex-row items-start">
                                  <Text className={`${mutedColor} text-xs mr-1`}>•</Text>
                                  <Text className={`flex-1 ${mutedColor} text-xs leading-relaxed`}>
                                    Lack of specific performance optimization metrics
                                  </Text>
                                </View>
                              </View>
                            </View>
                            {message.showSkills && (
                              <View className="mb-4">
                                <Text className={`text-xs font-bold ${textColor} mb-2`}>💻 Skill Analysis</Text>
                                {skills.map((skill, idx) => (
                                  <View key={idx} className="mb-2.5">
                                    <View className="flex-row justify-between items-center mb-1">
                                      <View className="flex-row items-center">
                                        <Ionicons
                                          name={skill.match >= 85 ? "checkmark-circle" : "close-circle"}
                                          size={12}
                                          color={skill.match >= 85 ? (isDarkMode ? '#4ade80' : '#16a34a') : (isDarkMode ? '#fb923c' : '#ea580c')}
                                        />
                                        <Text className={`text-xs ${textColor} ml-1.5`}>{skill.name}</Text>
                                      </View>
                                      <Text className={`text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{skill.match}%</Text>
                                    </View>
                                    <View className={`h-1.5 ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                                      <View
                                        className={`h-full rounded-full ${skill.match >= 85 ? (isDarkMode ? 'bg-green-500' : 'bg-green-600') : (isDarkMode ? 'bg-orange-500' : 'bg-orange-600')}`}
                                        style={{ width: `${skill.match}%` }}
                                      />
                                    </View>
                                  </View>
                                ))}
                              </View>
                            )}
                            {message.showRecommendations && (
                              <View>
                                <Text className={`text-xs font-bold ${textColor} mb-2`}>💡 Keyword Recommendations</Text>
                                <View className="space-y-2.5">
                                  <View className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'} rounded-lg p-2.5`}>
                                    <View className="flex-row items-center mb-1">
                                      <Text className={`text-xs font-semibold ${textColor}`}>System Design</Text>
                                      <View className={`ml-2 px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                        <Text className={`text-xs font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>MISSING</Text>
                                      </View>
                                    </View>
                                    <Text className={`text-xs ${mutedColor} leading-relaxed`}>
                                      Add examples of designing scalable systems and architectural decisions
                                    </Text>
                                  </View>
                                  <View className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'} rounded-lg p-2.5`}>
                                    <View className="flex-row items-center mb-1">
                                      <Text className={`text-xs font-semibold ${textColor}`}>Team Leadership</Text>
                                      <View className={`ml-2 px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                        <Text className={`text-xs font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>MISSING</Text>
                                      </View>
                                    </View>
                                    <Text className={`text-xs ${mutedColor} leading-relaxed`}>
                                      Highlight mentoring experience and technical leadership responsibilities
                                    </Text>
                                  </View>

                                  <View className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'} rounded-lg p-2.5`}>
                                    <View className="flex-row items-center mb-1">
                                      <Text className={`text-xs font-semibold ${textColor}`}>Performance Metrics</Text>
                                      <View className={`ml-2 px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                                        <Text className={`text-xs font-semibold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>MISSING</Text>
                                      </View>
                                    </View>
                                    <Text className={`text-xs ${mutedColor} leading-relaxed`}>
                                      Include quantifiable improvements (e.g., "Reduced load time by 40%")
                                    </Text>
                                  </View>
                                </View>

                                <View className={`mt-4 p-3 ${isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-800' : 'border-blue-200'} rounded-lg`}>
                                  <Text className={`text-xs font-bold ${textColor} mb-1`}>💬 Overall Feedback</Text>
                                  <Text className={`text-xs ${mutedColor} leading-relaxed`}>
                                    Your technical skills are strong and align well with this role. To strengthen your application, emphasize system design experience, leadership examples, and add quantifiable metrics to your achievements. Consider highlighting 2-3 projects where you made architectural decisions or mentored teammates.
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))}
            {isTyping && messages.length > 0 && !messages[messages.length - 1].isStreaming && (
              <View className="flex-row items-center mb-4">
                <View className={`w-8 h-8 rounded-full ${isDarkMode ? 'bg-gradient-to-br from-purple-600 to-blue-600' : 'bg-gradient-to-br from-purple-500 to-blue-500'} items-center justify-center mr-2`}>
                  <Ionicons name="sparkles" size={16} color="white" />
                </View>
                <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-full px-3 py-2`}>
                  <Text className={`${mutedColor} text-xs`}>Typing...</Text>
                </View>
              </View>
            )}
          </View>
          {messages.length === 1 && (
            <View className={`px-4 pb-4 pt-3 border-t ${borderColor} ${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
              <TouchableOpacity
                onPress={() => handleQuickAction('Analyze my resume for Senior Software Engineer at AcmeTech')}
                className={`${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-xl px-4 py-2.5 self-start`}
                disabled={isTyping}
              >
                <Text className="text-white font-semibold text-sm">Analyze for Senior Software Engineer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
