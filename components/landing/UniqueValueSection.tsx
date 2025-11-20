import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface UniqueValueSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

export function UniqueValueSection({
  isDarkMode,
  textColor,
  mutedColor,
  cardBg,
  borderColor
}: UniqueValueSectionProps) {
  return (
    <View className={`px-6 py-24 ${isDarkMode ? 'bg-gradient-to-b from-zinc-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
      <View className="max-w-5xl mx-auto">
        <View className="mb-16 items-center">
          <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10' : 'bg-gradient-to-r from-emerald-50 to-teal-50'} border ${isDarkMode ? 'border-emerald-500/20' : 'border-emerald-200'} rounded-full`}>
            <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} text-xs font-bold tracking-wide`}>
              WHY RESUME PIVOT
            </Text>
          </View>
          <Text className={`text-4xl md:text-5xl font-black text-center mb-4 ${textColor}`}>
            The only platform built for{'\n'}tech career changers
          </Text>
          <Text className={`text-lg text-center ${mutedColor} max-w-3xl`}>
            Other tools just score your resume. We help you build the right experience.
          </Text>
        </View>
        <View className="space-y-4">
          <View className={`${cardBg} border ${borderColor} rounded-2xl p-6 shadow-xl`}>
            <View className="flex-row items-start gap-4">
              <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-blue-400 to-blue-500'} items-center justify-center flex-shrink-0`}>
                <Ionicons name="analytics" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className={`${textColor} text-lg font-bold mb-2`}>
                  Multi-role project ranking
                </Text>
                <Text className={`${mutedColor} text-sm leading-relaxed mb-3`}>
                  See how your Budget Tracker ranks for Frontend (5.5/10), Backend (3.5/10), and Full-Stack (4.5/10). Know which projects to keep, enhance, or drop.
                </Text>
                <View className={`self-start px-3 py-1 rounded-full ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'} text-xs font-bold`}>
                    ✓ UNIQUE TO US
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className={`${cardBg} border ${borderColor} rounded-2xl p-6 shadow-xl`}>
            <View className="flex-row items-start gap-4">
              <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-purple-500 to-purple-600' : 'bg-gradient-to-br from-purple-400 to-purple-500'} items-center justify-center flex-shrink-0`}>
                <Ionicons name="construct" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className={`${textColor} text-lg font-bold mb-2`}>
                  AI suggests projects to build
                </Text>
                <Text className={`${mutedColor} text-sm leading-relaxed mb-3`}>
                  Missing system design experience? We'll suggest building a distributed cache or real-time dashboard. Each suggestion shows expected impact (+2-3 points) and effort level.
                </Text>
                <View className={`self-start px-3 py-1 rounded-full ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'} text-xs font-bold`}>
                    ✓ UNIQUE TO US
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className={`${cardBg} border ${borderColor} rounded-2xl p-6 shadow-xl`}>
            <View className="flex-row items-start gap-4">
              <View className={`w-12 h-12 rounded-xl ${isDarkMode ? 'bg-gradient-to-br from-pink-500 to-pink-600' : 'bg-gradient-to-br from-pink-400 to-pink-500'} items-center justify-center flex-shrink-0`}>
                <Ionicons name="layers" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text className={`${textColor} text-lg font-bold mb-2`}>
                  Cross-role skill analysis
                </Text>
                <Text className={`${mutedColor} text-sm leading-relaxed mb-3`}>
                  One analysis shows how your SQL skills fit Data Analyst, Data Engineer, Backend Engineer, and Marketing Analyst roles. Same with Python for DS, ML, Backend, DevOps positions.
                </Text>
                <View className={`self-start px-3 py-1 rounded-full ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                  <Text className={`${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'} text-xs font-bold`}>
                    ✓ UNIQUE TO US
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className={`mt-12 p-8 rounded-2xl ${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10' : 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'}`}>
          <Text className={`${textColor} text-2xl font-black text-center mb-3`}>
            Stop guessing. Start building.
          </Text>
          <Text className={`${mutedColor} text-center`}>
            Know exactly which projects to showcase and which skills to develop for your dream tech role.
          </Text>
        </View>
      </View>
    </View>
  );
}
