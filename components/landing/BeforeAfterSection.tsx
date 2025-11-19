import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface BeforeAfterSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

export function BeforeAfterSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor }: BeforeAfterSectionProps) {
  return (
    <View className="px-6 py-20">
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        See the difference
      </Text>
      <Text className={`text-xl text-center mb-16 ${mutedColor}`}>
        Real resume transformation in seconds
      </Text>
      <View className="flex-row flex-wrap justify-center gap-8 max-w-6xl mx-auto">
        <View className="flex-1 min-w-[300px]">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-red-500/10 rounded-full items-center justify-center mr-3">
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </View>
            <Text className={`text-2xl font-bold ${textColor}`}>Before</Text>
          </View>
          <View className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
            <Text className={`text-lg font-bold mb-4 ${textColor}`}>Software Engineer</Text>
            <View className="space-y-3">
              <View className="flex-row items-start mb-3">
                <Text className={`${mutedColor} text-base mr-2`}>•</Text>
                <Text className={`${mutedColor} text-base flex-1`}>
                  Worked on various projects
                </Text>
              </View>
              <View className="flex-row items-start mb-3">
                <Text className={`${mutedColor} text-base mr-2`}>•</Text>
                <Text className={`${mutedColor} text-base flex-1`}>
                  Used programming languages
                </Text>
              </View>
              <View className="flex-row items-start mb-3">
                <Text className={`${mutedColor} text-base mr-2`}>•</Text>
                <Text className={`${mutedColor} text-base flex-1`}>
                  Helped team with tasks
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className={`${mutedColor} text-base mr-2`}>•</Text>
                <Text className={`${mutedColor} text-base flex-1`}>
                  Good at problem solving
                </Text>
              </View>
            </View>
            <View className={`mt-6 pt-6 border-t ${borderColor}`}>
              <View className="flex-row items-center mb-2">
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
                <Text className="text-red-400 text-sm ml-2 font-semibold">Issues Found:</Text>
              </View>
              <Text className={`text-sm ${mutedColor}`}>
                ❌ No metrics or numbers{'\n'}
                ❌ Vague descriptions{'\n'}
                ❌ Missing keywords{'\n'}
                ❌ Weak action verbs
              </Text>
            </View>
          </View>
          <View className="mt-4 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <Text className="text-red-400 text-3xl font-black text-center">42%</Text>
            <Text className={`text-center text-sm ${mutedColor} mt-1`}>Match Score</Text>
          </View>
        </View>
        <View className="items-center justify-center hidden md:flex">
          <View className="w-16 h-16 bg-blue-500/10 rounded-full items-center justify-center">
            <Ionicons name="arrow-forward" size={32} color="#3b82f6" />
          </View>
        </View>
        <View className="flex-1 min-w-[300px]">
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 bg-green-500/10 rounded-full items-center justify-center mr-3">
              <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
            </View>
            <Text className={`text-2xl font-bold ${textColor}`}>After</Text>
          </View>
          <View className={`${cardBg} border ${borderColor} rounded-2xl p-6`}>
            <Text className={`text-lg font-bold mb-4 ${textColor}`}>Senior Software Engineer</Text>
            <View className="space-y-3">
              <View className="flex-row items-start mb-3">
                <Text className={`${textColor} text-base mr-2`}>•</Text>
                <Text className={`${textColor} text-base flex-1`}>
                  Architected microservices reducing latency by 60%
                </Text>
              </View>
              <View className="flex-row items-start mb-3">
                <Text className={`${textColor} text-base mr-2`}>•</Text>
                <Text className={`${textColor} text-base flex-1`}>
                  Led team of 5 engineers using React & Node.js
                </Text>
              </View>
              <View className="flex-row items-start mb-3">
                <Text className={`${textColor} text-base mr-2`}>•</Text>
                <Text className={`${textColor} text-base flex-1`}>
                  Deployed CI/CD pipeline serving 2M+ users daily
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className={`${textColor} text-base mr-2`}>•</Text>
                <Text className={`${textColor} text-base flex-1`}>
                  Optimized database queries improving performance 3x
                </Text>
              </View>
            </View>
            <View className={`mt-6 pt-6 border-t ${borderColor}`}>
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
                <Text className="text-green-400 text-sm ml-2 font-semibold">Improvements:</Text>
              </View>
              <Text className={`text-sm ${textColor}`}>
                ✓ Quantifiable metrics added{'\n'}
                ✓ Specific technologies listed{'\n'}
                ✓ Strong action verbs{'\n'}
                ✓ Leadership highlighted
              </Text>
            </View>
          </View>
          <View className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <Text className="text-green-400 text-3xl font-black text-center">94%</Text>
            <Text className={`text-center text-sm ${mutedColor} mt-1`}>Match Score</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
