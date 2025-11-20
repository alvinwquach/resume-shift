import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface DetailedFeaturesSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

export function DetailedFeaturesSection({
  isDarkMode,
  textColor,
  mutedColor,
  cardBg,
  borderColor
}: DetailedFeaturesSectionProps) {
  return (
    <View className="px-6 py-24">
      <View className="max-w-3xl mx-auto mb-20 items-center">
        <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'} rounded-full self-center`}>
          <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xs font-bold tracking-wide`}>
            HOW IT WORKS
          </Text>
        </View>
        <Text className={`text-4xl md:text-5xl font-black text-center mb-4 ${textColor}`}>
          Intelligent career guidance powered by AI
        </Text>
        <Text className={`text-lg text-center ${mutedColor}`}>
          Our AI agents understand the tech job market and help you position yourself for success
        </Text>
      </View>
      <View className="max-w-6xl mx-auto mb-24">
        <View className="flex-row flex-wrap items-center gap-12">
          <View className="flex-1 min-w-[300px]">
            <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'} rounded-full self-start`}>
              <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xs font-bold`}>
                SMART ANALYSIS
              </Text>
            </View>
            <Text className={`text-3xl md:text-4xl font-black mb-4 ${textColor}`}>
              Skills analyzed across multiple tech roles
            </Text>
            <Text className={`text-base ${mutedColor} leading-relaxed mb-6`}>
              Our AI understands that skills like SQL and Python are valuable across different roles. Whether you're targeting Data Analyst, Data Engineer, or Backend Engineer positions, we'll show you how your skills translate to each role.
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="checkmark" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>SQL for multiple roles</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    Analyzed for Marketing Analyst, Data Analyst, Data Engineer, Backend Engineer, and more
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="checkmark" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Python across disciplines</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    Valuable for Data Scientist, ML Engineer, Backend Engineer, DevOps, and Analyst roles
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="checkmark" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Role-specific insights</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    See how your background fits Frontend, Backend, Full-Stack, Data, AI/LLM, and more
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className={`flex-1 min-w-[300px] ${cardBg} border ${borderColor} rounded-2xl p-8`}>
            <Text className={`${textColor} font-bold mb-4`}>Example: SQL Analysis</Text>
            <View className="space-y-3">
              <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} rounded-lg p-3`}>
                <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold text-sm mb-1`}>Data Engineer</Text>
                <Text className={`${mutedColor} text-xs`}>SQL + pipeline design = Strong fit</Text>
              </View>
              <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} rounded-lg p-3`}>
                <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} font-semibold text-sm mb-1`}>Backend Engineer</Text>
                <Text className={`${mutedColor} text-xs`}>SQL + API design = Good fit</Text>
              </View>
              <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} rounded-lg p-3`}>
                <Text className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} font-semibold text-sm mb-1`}>Data Analyst</Text>
                <Text className={`${mutedColor} text-xs`}>SQL + business insights = Excellent fit</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="max-w-6xl mx-auto mb-24">
        <View className="flex-row flex-wrap items-center gap-12 flex-row-reverse">
          <View className="flex-1 min-w-[300px]">
            <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} border ${isDarkMode ? 'border-purple-500/20' : 'border-purple-200'} rounded-full self-start`}>
              <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-xs font-bold`}>
                BUILD YOUR PORTFOLIO
              </Text>
            </View>
            <Text className={`text-3xl md:text-4xl font-black mb-4 ${textColor}`}>
              Get personalized project recommendations
            </Text>
            <Text className={`text-base ${mutedColor} leading-relaxed mb-6`}>
              Based on your resume analysis, we suggest specific projects to build that will strengthen your profile for your target role. Close skill gaps and demonstrate hands-on experience.
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="construct" size={14} color={isDarkMode ? '#a855f7' : '#9333ea'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Gap-filling projects</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    Missing system design experience? We'll suggest building a distributed system project
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="construct" size={14} color={isDarkMode ? '#a855f7' : '#9333ea'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Role-specific ideas</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    Targeting AI/LLM roles? Build a RAG system or AI agent with cost optimization
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="construct" size={14} color={isDarkMode ? '#a855f7' : '#9333ea'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Level-appropriate suggestions</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    Projects matched to junior, mid-level, or senior expectations
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className={`flex-1 min-w-[300px] ${cardBg} border ${borderColor} rounded-2xl p-8`}>
            <Text className={`${textColor} font-bold mb-4`}>Suggested Projects</Text>
            <View className="space-y-3">
              <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} rounded-lg p-3 border-l-4 ${isDarkMode ? 'border-purple-500' : 'border-purple-600'}`}>
                <Text className={`${textColor} font-semibold text-sm mb-1`}>💡 Build an E-commerce API</Text>
                <Text className={`${mutedColor} text-xs mb-2`}>Fill gap: Scalable backend architecture</Text>
                <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-xs font-semibold`}>Impact: +2 points for Backend roles</Text>
              </View>
              <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-50'} rounded-lg p-3 border-l-4 ${isDarkMode ? 'border-blue-500' : 'border-blue-600'}`}>
                <Text className={`${textColor} font-semibold text-sm mb-1`}>💡 Real-time Dashboard</Text>
                <Text className={`${mutedColor} text-xs mb-2`}>Fill gap: WebSocket & data visualization</Text>
                <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xs font-semibold`}>Impact: +3 points for Full-Stack roles</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="max-w-6xl mx-auto">
        <View className="flex-row flex-wrap items-center gap-12">
          <View className="flex-1 min-w-[300px]">
            <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} border ${isDarkMode ? 'border-green-500/20' : 'border-green-200'} rounded-full self-start`}>
              <Text className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} text-xs font-bold`}>
                OPTIMIZE YOUR PORTFOLIO
              </Text>
            </View>
            <Text className={`text-3xl md:text-4xl font-black mb-4 ${textColor}`}>
              Rank your projects for maximum impact
            </Text>
            <Text className={`text-base ${mutedColor} leading-relaxed mb-6`}>
              Not all projects are created equal. Our AI evaluates each project across multiple tech roles (Frontend, Backend, AI/LLM, Data, etc.) and tells you which 2-4 to showcase on your resume.
            </Text>
            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="analytics" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Multi-role scoring</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    See how your project ranks for AI/LLM Engineer, Full-Stack, Backend, Frontend, and more
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="analytics" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Clear recommendations</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    KEEP (7-10/10), ENHANCE (4-6/10), or DROP (1-3/10) for each role
                  </Text>
                </View>
              </View>
              <View className="flex-row items-start">
                <View className={`w-6 h-6 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-3 mt-0.5`}>
                  <Ionicons name="analytics" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
                </View>
                <View className="flex-1">
                  <Text className={`${textColor} font-semibold mb-1`}>Enhancement suggestions</Text>
                  <Text className={`${mutedColor} text-sm`}>
                    Specific improvements to elevate weak projects (effort: low/medium/high)
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className={`flex-1 min-w-[300px] ${cardBg} border ${borderColor} rounded-2xl p-8`}>
            <Text className={`${textColor} font-bold mb-4`}>Budget Tracker → Rankings</Text>
            <View className="space-y-3">
              <View className={`${isDarkMode ? 'bg-amber-900/20' : 'bg-amber-50'} rounded-lg p-3`}>
                <View className="flex-row items-center justify-between mb-1">
                  <Text className={`${textColor} font-semibold text-sm`}>Frontend Engineer</Text>
                  <Text className={`${isDarkMode ? 'text-amber-400' : 'text-amber-600'} font-bold text-sm`}>5.5/10</Text>
                </View>
                <Text className={`${mutedColor} text-xs mb-2`}>Basic React, needs advanced UI</Text>
                <View className={`${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'} px-2 py-1 rounded self-start`}>
                  <Text className={`${isDarkMode ? 'text-amber-400' : 'text-amber-700'} text-xs font-bold`}>ENHANCE</Text>
                </View>
              </View>
              <View className={`${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} rounded-lg p-3`}>
                <View className="flex-row items-center justify-between mb-1">
                  <Text className={`${textColor} font-semibold text-sm`}>Backend Engineer</Text>
                  <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-600'} font-bold text-sm`}>3.5/10</Text>
                </View>
                <Text className={`${mutedColor} text-xs mb-2`}>Basic CRUD, no scale</Text>
                <View className={`${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'} px-2 py-1 rounded self-start`}>
                  <Text className={`${isDarkMode ? 'text-red-400' : 'text-red-700'} text-xs font-bold`}>DROP</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
