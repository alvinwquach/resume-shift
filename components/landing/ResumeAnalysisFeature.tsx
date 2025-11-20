import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ResumeAnalysisFeatureProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

export function ResumeAnalysisFeature({
  isDarkMode,
  textColor,
  mutedColor,
  cardBg,
  borderColor
}: ResumeAnalysisFeatureProps) {
  return (
    <View className="px-6 py-24">
      <View className="max-w-7xl mx-auto">
        <View className="flex-row flex-wrap items-center gap-12">
          <View className="flex-1 min-w-[320px]">
            <View className={`mb-6 px-4 py-2 ${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'bg-gradient-to-r from-blue-50 to-cyan-50'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'} rounded-full self-start`}>
              <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xs font-bold tracking-wide`}>
                RESUME ANALYSIS AGENT
              </Text>
            </View>
            <Text className={`text-4xl md:text-5xl font-black mb-6 ${textColor} leading-tight`}>
              Paste. Analyze.{'\n'}Know your fit.
            </Text>
            <Text className={`text-lg ${mutedColor} leading-relaxed mb-8`}>
              Upload your resume and paste any job posting. Our AI instantly analyzes your compatibility score, identifies skill gaps, and recommends exactly which projects to build to land the role.
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="analytics" size={16} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Deep skill matching</Text>
                  <Text className={`${mutedColor} text-sm`}>Critical, high, medium, and low priority skills analyzed</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="warning" size={16} color={isDarkMode ? '#fbbf24' : '#d97706'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Experience gap analysis</Text>
                  <Text className={`${mutedColor} text-sm`}>Specific requirements you're missing + how to address them</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="construct" size={16} color={isDarkMode ? '#a855f7' : '#9333ea'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Project recommendations</Text>
                  <Text className={`${mutedColor} text-sm`}>Build ideas with tech stack, impact score, and time estimates</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="ribbon" size={16} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>ATS optimization</Text>
                  <Text className={`${mutedColor} text-sm`}>Keyword recommendations, formatting tips, competitive positioning</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="flex-1 min-w-[320px] max-w-[500px]">
            <View className="space-y-4">
              <View className={`${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl`}>
                <View className="flex-row items-center justify-between mb-4">
                  <Text className={`${textColor} font-bold text-lg`}>Backend Engineer</Text>
                  <View className={`${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'} px-3 py-1.5 rounded-full`}>
                    <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'} text-xs font-bold`}>
                      STRONG FIT
                    </Text>
                  </View>
                </View>
                <View className="space-y-3">
                  <View>
                    <Text className={`${mutedColor} text-xs font-semibold mb-2`}>Strengths:</Text>
                    <View className="flex-row flex-wrap gap-2">
                      <View className={`${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} px-2.5 py-1 rounded-md`}>
                        <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-700'} text-xs font-semibold`}>Node.js</Text>
                      </View>
                      <View className={`${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} px-2.5 py-1 rounded-md`}>
                        <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-700'} text-xs font-semibold`}>SQL</Text>
                      </View>
                      <View className={`${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} px-2.5 py-1 rounded-md`}>
                        <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-700'} text-xs font-semibold`}>REST APIs</Text>
                      </View>
                    </View>
                  </View>
                  <View className={`${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'} rounded-lg p-3`}>
                    <Text className={`${mutedColor} text-xs font-semibold mb-1`}>Missing:</Text>
                    <Text className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} text-xs`}>
                      System design, caching strategies, message queues
                    </Text>
                  </View>
                  <View className={`${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'} rounded-lg p-3 border-l-2 ${isDarkMode ? 'border-purple-500' : 'border-purple-600'}`}>
                    <Text className={`${textColor} text-xs font-semibold mb-1`}>💡 Build a distributed cache</Text>
                    <Text className={`${mutedColor} text-xs mb-1.5`}>Redis + Node.js + load balancing</Text>
                    <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-xs font-bold`}>
                      Impact: +2.5 pts • 2-3 weeks
                    </Text>
                  </View>
                </View>
              </View>
              <View className={`${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10' : 'bg-gradient-to-r from-blue-50 to-cyan-50'} rounded-xl p-4 flex-row items-center gap-3`}>
                <Ionicons name="flash" size={24} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                <View>
                  <Text className={`${textColor} font-bold text-sm`}>Analysis in ~10 seconds</Text>
                  <Text className={`${mutedColor} text-xs`}>Real-time feedback, no waiting</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
