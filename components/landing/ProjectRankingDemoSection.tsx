import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProjectRankingDemoSectionProps {
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
  showRankings?: boolean;
  showRecommendations?: boolean;
  projectType?: string;
}

interface RoleRanking {
  role: string;
  score: number;
  recommendation: 'keep' | 'enhance' | 'drop';
  fitSummary: string;
}

interface ProjectData {
  name: string;
  description: string;
  bestFitRoles: string[];
  rankings: RoleRanking[];
  recommendation: string;
}

export function ProjectRankingDemoSection({
  isDarkMode,
  textColor,
  mutedColor,
  cardBg,
  borderColor,
  accentBg
}: ProjectRankingDemoSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});
  const [currentProject, setCurrentProject] = useState<string>('');

  const projectData: Record<string, ProjectData> = {
    'Budget Tracker': {
      name: 'Budget Tracker',
      description: 'Basic CRUD app for tracking expenses with React and Node.js',
      bestFitRoles: ['Frontend Engineer'],
      rankings: [
        {
          role: 'Frontend Engineer',
          score: 5.5,
          recommendation: 'enhance',
          fitSummary: 'Basic React implementation but lacks advanced UI features'
        },
        {
          role: 'Full-Stack Engineer',
          score: 4.5,
          recommendation: 'enhance',
          fitSummary: 'Simple CRUD operations without complex architecture'
        },
        {
          role: 'Backend Engineer',
          score: 3.5,
          recommendation: 'drop',
          fitSummary: 'Basic API endpoints without scale or performance considerations'
        }
      ],
      recommendation: 'ENHANCE this project before adding to your resume. It demonstrates basic skills but needs more complexity. Consider adding: data visualization, budget analytics, or expense categorization with ML. For junior roles, this could work if you add polish and explain your learnings.'
    },
    'E-commerce Dashboard': {
      name: 'E-commerce Dashboard',
      description: 'Full-stack dashboard with analytics, inventory management, and real-time updates',
      bestFitRoles: ['Full-Stack Engineer', 'Frontend Engineer'],
      rankings: [
        {
          role: 'Full-Stack Engineer',
          score: 7.5,
          recommendation: 'keep',
          fitSummary: 'Good end-to-end implementation with real-time features'
        },
        {
          role: 'Frontend Engineer',
          score: 7,
          recommendation: 'keep',
          fitSummary: 'Strong dashboard UI with data visualization'
        },
        {
          role: 'Backend Engineer',
          score: 6.5,
          recommendation: 'enhance',
          fitSummary: 'Solid API design but could show more backend complexity'
        },
        {
          role: 'Data Engineer',
          score: 5,
          recommendation: 'enhance',
          fitSummary: 'Some data processing but limited pipeline architecture'
        }
      ],
      recommendation: 'KEEP this project on your resume! It\'s a solid fit for Full-Stack and Frontend roles. Emphasize the real-time updates and analytics features. For backend roles, highlight API design and data management.'
    },
    'AI Agent App': {
      name: 'AI Agent App',
      description: 'Autonomous AI agents using OpenAI, with RAG, multi-step reasoning, and tool use',
      bestFitRoles: ['AI/LLM Engineer', 'Full-Stack Engineer'],
      rankings: [
        {
          role: 'AI/LLM Engineer',
          score: 9,
          recommendation: 'keep',
          fitSummary: 'Excellent use of RAG, agents, and advanced LLM techniques'
        },
        {
          role: 'Full-Stack Engineer',
          score: 8,
          recommendation: 'keep',
          fitSummary: 'Strong full-stack implementation integrating AI features'
        },
        {
          role: 'Backend Engineer',
          score: 7,
          recommendation: 'keep',
          fitSummary: 'Complex API architecture handling AI workflows'
        },
        {
          role: 'Frontend Engineer',
          score: 6.5,
          recommendation: 'enhance',
          fitSummary: 'Good UI but AI features overshadow frontend complexity'
        }
      ],
      recommendation: 'KEEP this project - it\'s excellent for AI/LLM roles! Emphasize the RAG implementation, prompt engineering, and agent architecture. For full-stack roles, highlight end-to-end integration. This is a strong portfolio piece.'
    }
  };

  const streamAIMessage = useCallback((
    fullText: string,
    messageId: number,
    showAnalysis: boolean = false,
    projectType?: string
  ) => {
    setIsTyping(true);

    const newMessage: Message = {
      id: messageId,
      type: 'ai',
      content: '',
      isStreaming: true,
      showRankings: showAnalysis,
      showRecommendations: false,
      projectType
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

        if (showAnalysis && projectType) {
          const project = projectData[projectType];
          if (project) {
            animateScores(project.rankings);
            setTimeout(() => {
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === messageId ? { ...msg, showRecommendations: true } : msg
                )
              );
            }, 2000);
          }
        }
      }
    }, 25);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      streamAIMessage(
        "👋 Ready to rank your projects? I'll analyze them across multiple tech roles (Frontend, Backend, AI/LLM, Data, etc.) and tell you which ones are strong enough for your resume. Pick a project to get started!",
        1,
        false
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [streamAIMessage]);

  const animateScores = (rankings: RoleRanking[]) => {
    rankings.forEach((ranking) => {
      let current = 0;
      const target = ranking.score * 10; // Convert to percentage for animation
      const interval = setInterval(() => {
        if (current >= target) {
          clearInterval(interval);
          setAnimatedScores(prev => ({ ...prev, [ranking.role]: target }));
        } else {
          current += 2;
          setAnimatedScores(prev => ({ ...prev, [ranking.role]: Math.min(current, target) }));
        }
      }, 15);
    });
  };

  const handleQuickAction = (projectName: string) => {
    if (isTyping) return;

    setCurrentProject(projectName);
    setAnimatedScores({});

    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: `Rank: ${projectName}`
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponseId = Date.now() + 1;
      streamAIMessage(
        `📊 Analyzing "${projectName}" across tech roles...`,
        aiResponseId,
        true,
        projectName
      );
    }, 1000);
  };

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case 'keep':
        return {
          bg: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100',
          text: isDarkMode ? 'text-emerald-400' : 'text-emerald-700',
          border: isDarkMode ? 'border-emerald-500/20' : 'border-emerald-200'
        };
      case 'enhance':
        return {
          bg: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-100',
          text: isDarkMode ? 'text-amber-400' : 'text-amber-700',
          border: isDarkMode ? 'border-amber-500/20' : 'border-amber-200'
        };
      case 'drop':
        return {
          bg: isDarkMode ? 'bg-red-500/10' : 'bg-red-100',
          text: isDarkMode ? 'text-red-400' : 'text-red-700',
          border: isDarkMode ? 'border-red-500/20' : 'border-red-200'
        };
      default:
        return {
          bg: isDarkMode ? 'bg-zinc-800' : 'bg-gray-100',
          text: isDarkMode ? 'text-zinc-400' : 'text-gray-600',
          border: isDarkMode ? 'border-zinc-700' : 'border-gray-200'
        };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return isDarkMode ? 'text-emerald-400' : 'text-emerald-600';
    if (score >= 6) return isDarkMode ? 'text-blue-400' : 'text-blue-600';
    if (score >= 4) return isDarkMode ? 'text-amber-400' : 'text-amber-600';
    return isDarkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <View className={`px-6 py-24 ${accentBg} border-y ${borderColor}`}>
      <View className="max-w-3xl mx-auto mb-16 items-center">
        <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} border ${isDarkMode ? 'border-purple-500/20' : 'border-purple-200'} rounded-full self-center`}>
          <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-xs font-bold tracking-wide`}>
            PROJECT RANKING
          </Text>
        </View>
        <Text className={`text-4xl md:text-5xl font-black text-center mb-4 ${textColor}`}>
          Discover your strongest projects
        </Text>
        <Text className={`text-lg text-center ${mutedColor}`}>
          AI analyzes your projects across roles and tells you which ones to showcase
        </Text>
      </View>
      <View className="max-w-3xl mx-auto w-full">
        <View className={`${cardBg} border ${borderColor} rounded-3xl shadow-2xl overflow-hidden w-full`}>
          <View className={`flex-row items-center p-4 border-b ${borderColor} ${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
            <View className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} items-center justify-center mr-3`}>
              <Ionicons name="analytics" size={18} color="white" />
            </View>
            <View className="flex-1">
              <Text className={`text-base font-bold ${textColor}`}>Project Ranking Assistant</Text>
              <Text className={`text-xs ${mutedColor}`}>AI Career Advisor</Text>
            </View>
            <View className={`px-2.5 py-1 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
              <Text className={`text-xs font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>● Online</Text>
            </View>
          </View>
          <View className="p-4">
            {messages.map((message) => (
              <View key={message.id}>
                {message.type === 'user' ? (
                  <View className="flex-row justify-end items-start mb-4">
                    <View className="flex-1 mr-2 max-w-[85%]">
                      <View className={`${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} rounded-2xl rounded-tr-md p-3`}>
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
                          {message.isStreaming && <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>▊</Text>}
                        </Text>
                        {message.showRankings && !message.isStreaming && message.projectType && projectData[message.projectType] && (
                          <View className="mt-4">
                            <Text className={`text-sm font-bold ${textColor} mb-3`}>📊 Project: {projectData[message.projectType].name}</Text>
                            <Text className={`text-xs ${mutedColor} mb-4`}>
                              {projectData[message.projectType].description}
                            </Text>
                            {projectData[message.projectType].bestFitRoles.length > 0 && (
                              <View className={`${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'} rounded-lg p-3 mb-4`}>
                                <View className="flex-row items-center mb-2">
                                  <Ionicons name="trophy" size={14} color={isDarkMode ? '#3b82f6' : '#2563eb'} />
                                  <Text className={`text-xs font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'} ml-1.5`}>
                                    Best Fit For
                                  </Text>
                                </View>
                                <View className="flex-row flex-wrap gap-1.5">
                                  {projectData[message.projectType].bestFitRoles.map((role, idx) => (
                                    <View key={idx} className={`${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} px-2 py-1 rounded`}>
                                      <Text className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                                        {role}
                                      </Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            )}
                            <Text className={`text-xs font-bold ${textColor} mb-2`}>Role Rankings</Text>
                            <View className="space-y-2">
                              {projectData[message.projectType].rankings.map((ranking, idx) => {
                                const style = getRecommendationStyle(ranking.recommendation);
                                const scorePercent = animatedScores[ranking.role] || 0;

                                return (
                                  <View
                                    key={idx}
                                    className={`${isDarkMode ? 'bg-zinc-900' : 'bg-white'} border ${isDarkMode ? 'border-zinc-700' : 'border-gray-200'} rounded-lg p-3`}
                                  >
                                    <View className="flex-row items-center justify-between mb-2">
                                      <View className="flex-1">
                                        <Text className={`text-xs font-semibold ${textColor}`}>
                                          {ranking.role}
                                        </Text>
                                        <Text className={`text-xs ${mutedColor} mt-0.5`}>
                                          {ranking.fitSummary}
                                        </Text>
                                      </View>
                                      <View className="ml-2 items-end">
                                        <Text className={`text-lg font-bold ${getScoreColor(ranking.score)}`}>
                                          {ranking.score.toFixed(1)}
                                        </Text>
                                        <Text className={`text-xs ${mutedColor}`}>/10</Text>
                                      </View>
                                    </View>
                                    <View className="flex-row items-center gap-2">
                                      <View className={`px-2 py-1 rounded border ${style.bg} ${style.border}`}>
                                        <Text className={`text-xs font-semibold uppercase ${style.text}`}>
                                          {ranking.recommendation}
                                        </Text>
                                      </View>
                                      <View className="flex-1 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                        <View
                                          className={`h-full rounded-full ${
                                            ranking.score >= 8
                                              ? (isDarkMode ? 'bg-emerald-500' : 'bg-emerald-600')
                                              : ranking.score >= 6
                                              ? (isDarkMode ? 'bg-blue-500' : 'bg-blue-600')
                                              : (isDarkMode ? 'bg-amber-500' : 'bg-amber-600')
                                          }`}
                                          style={{ width: `${scorePercent}%` }}
                                        />
                                      </View>
                                    </View>
                                  </View>
                                );
                              })}
                            </View>

                            {message.showRecommendations && message.projectType && projectData[message.projectType] && (
                              <View className={`mt-4 p-3 ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'} border ${isDarkMode ? 'border-purple-800' : 'border-purple-200'} rounded-lg`}>
                                <Text className={`text-xs font-bold ${textColor} mb-1`}>💡 Portfolio Recommendation</Text>
                                <Text className={`text-xs ${mutedColor} leading-relaxed`}>
                                  {projectData[message.projectType].recommendation}
                                </Text>
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
                  <Text className={`${mutedColor} text-xs`}>Analyzing...</Text>
                </View>
              </View>
            )}
          </View>
          {(messages.length === 1 || (!isTyping && messages.length > 0)) && (
            <View className={`px-4 pb-4 pt-3 border-t ${borderColor} ${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
              <Text className={`text-xs font-semibold ${mutedColor} mb-2`}>
                {messages.length === 1 ? 'Choose a demo project:' : 'Try another project:'}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                <TouchableOpacity
                  onPress={() => handleQuickAction('Budget Tracker')}
                  className={`${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 active:opacity-70`}
                  disabled={isTyping}
                >
                  <Text className={`${textColor} font-medium text-xs`}>💰 Budget Tracker</Text>
                  <Text className={`${mutedColor} text-xs mt-0.5`}>Basic CRUD app</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleQuickAction('E-commerce Dashboard')}
                  className={`${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-300'} border rounded-lg px-3 py-2 active:opacity-70`}
                  disabled={isTyping}
                >
                  <Text className={`${textColor} font-medium text-xs`}>🛒 E-commerce Dashboard</Text>
                  <Text className={`${mutedColor} text-xs mt-0.5`}>Full-stack with analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleQuickAction('AI Agent App')}
                  className={`${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} rounded-lg px-3 py-2 active:opacity-90`}
                  disabled={isTyping}
                >
                  <Text className="text-white font-medium text-xs">🤖 AI Agent App</Text>
                  <Text className="text-purple-100 text-xs mt-0.5">RAG + Agents</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
