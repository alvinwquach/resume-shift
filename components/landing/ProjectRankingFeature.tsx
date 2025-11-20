import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ProjectRankingFeatureProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

export function ProjectRankingFeature({
  isDarkMode,
  textColor,
  mutedColor,
  cardBg,
  borderColor
}: ProjectRankingFeatureProps) {
  return (
    <View className="px-6 py-24">
      <View className="max-w-7xl mx-auto">
        <View className="flex-row flex-wrap items-center gap-12 flex-row-reverse">
          <View className="flex-1 min-w-[320px]">
            <View className={`mb-6 px-4 py-2 ${isDarkMode ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-purple-50 to-pink-50'} border ${isDarkMode ? 'border-purple-500/20' : 'border-purple-200'} rounded-full self-start`}>
              <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-xs font-bold tracking-wide`}>
                PROJECT RANKING AGENT
              </Text>
            </View>
            <Text className={`text-4xl md:text-5xl font-black mb-6 ${textColor} leading-tight`}>
              Rank. Optimize.{'\n'}Stand out.
            </Text>
            <Text className={`text-lg ${mutedColor} leading-relaxed mb-8`}>
              Not all projects are created equal. Our AI scores each project across Frontend, Backend, AI/LLM, and Data roles—analyzing technical complexity, business impact, and market relevance. Know exactly which 2-4 projects to showcase.
            </Text>
            <View className="space-y-4">
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="analytics" size={16} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Multi-dimensional scoring</Text>
                  <Text className={`${mutedColor} text-sm`}>Technical complexity, business impact, market relevance per role</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="layers" size={16} color={isDarkMode ? '#60a5fa' : '#2563eb'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Level-appropriate assessment</Text>
                  <Text className={`${mutedColor} text-sm`}>Junior, mid, senior, or staff+ positioning for each project</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="checkmark-circle" size={16} color={isDarkMode ? '#a855f7' : '#9333ea'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Action recommendations</Text>
                  <Text className={`${mutedColor} text-sm`}>KEEP (7-10), ENHANCE (4-6), or DROP (1-3) with reasoning</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="trending-up" size={16} color={isDarkMode ? '#fb923c' : '#ea580c'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Enhancement roadmap</Text>
                  <Text className={`${mutedColor} text-sm`}>Specific suggestions with low/medium/high effort estimates</Text>
                </View>
              </View>
              <View className="flex-row items-start gap-3">
                <View className={`w-8 h-8 rounded-lg ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} items-center justify-center flex-shrink-0`}>
                  <Ionicons name="alert-circle" size={16} color={isDarkMode ? '#f87171' : '#dc2626'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-bold mb-1`}>Red flag detection</Text>
                  <Text className={`${mutedColor} text-sm`}>Common pitfalls and positioning advice to stand out</Text>
                </View>
              </View>
            </View>
          </View>
          <View className="flex-1 min-w-[320px] max-w-[500px]">
            <View className="space-y-4">
              <View className={`${cardBg} border ${borderColor} rounded-2xl p-6 shadow-2xl`}>
                <Text className={`${textColor} font-bold text-lg mb-4`}>Budget Tracker App</Text>
                <View className="space-y-3">
                  <View className={`${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'} rounded-lg p-3`}>
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className={`${textColor} text-sm font-semibold`}>Frontend Engineer</Text>
                      <Text className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} text-lg font-black`}>5.5/10</Text>
                    </View>
                    <View className={`${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'} px-2.5 py-1 rounded-md self-start`}>
                      <Text className={`${isDarkMode ? 'text-amber-400' : 'text-amber-700'} text-xs font-bold`}>ENHANCE</Text>
                    </View>
                    <Text className={`${mutedColor} text-xs mt-2`}>Basic React, needs advanced UI patterns</Text>
                  </View>
                  <View className={`${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg p-3`}>
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className={`${textColor} text-sm font-semibold`}>Backend Engineer</Text>
                      <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} text-lg font-black`}>3.5/10</Text>
                    </View>
                    <View className={`${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} px-2.5 py-1 rounded-md self-start`}>
                      <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-700'} text-xs font-bold`}>DROP</Text>
                    </View>
                    <Text className={`${mutedColor} text-xs mt-2`}>Basic CRUD, no scalability features</Text>
                  </View>
                  <View className={`${isDarkMode ? 'bg-orange-900/20' : 'bg-orange-50'} rounded-lg p-3 border-l-2 ${isDarkMode ? 'border-orange-500' : 'border-orange-600'}`}>
                    <Text className={`${textColor} text-xs font-semibold mb-1`}>💡 To reach 7.5/10 Frontend:</Text>
                    <Text className={`${mutedColor} text-xs mb-1.5`}>Add: Data visualization, responsive charts, dark mode toggle</Text>
                    <Text className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'} text-xs font-bold`}>
                      Effort: Low (1 week)
                    </Text>
                  </View>
                </View>
              </View>
              <View className={`${isDarkMode ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-purple-50 to-pink-50'} rounded-xl p-4`}>
                <View className="flex-row items-center gap-3 mb-3">
                  <Ionicons name="trophy" size={24} color={isDarkMode ? '#a855f7' : '#9333ea'} />
                  <View>
                    <Text className={`${textColor} font-bold text-sm`}>Portfolio optimization</Text>
                    <Text className={`${mutedColor} text-xs`}>Show your best 2-4 projects</Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  <View className={`${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} px-2.5 py-1 rounded-md`}>
                    <Text className={`${isDarkMode ? 'text-green-400' : 'text-green-700'} text-xs font-bold`}>3 KEEP</Text>
                  </View>
                  <View className={`${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'} px-2.5 py-1 rounded-md`}>
                    <Text className={`${isDarkMode ? 'text-amber-400' : 'text-amber-700'} text-xs font-bold`}>2 ENHANCE</Text>
                  </View>
                  <View className={`${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} px-2.5 py-1 rounded-md`}>
                    <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-700'} text-xs font-bold`}>1 DROP</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
