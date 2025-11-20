import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { features } from "./features.data";

interface FeaturesSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

export function FeaturesSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor }: FeaturesSectionProps) {
  const iconColors = ['#3b82f6', '#a855f7', '#10b981', '#f97316', '#ec4899'];

  return (
    <View className="px-6 py-24">
      <View className="max-w-3xl mx-auto mb-16 items-center">
        <View className={`mb-4 px-4 py-2 ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50'} border ${isDarkMode ? 'border-purple-500/20' : 'border-purple-200'} rounded-full self-center`}>
          <Text className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'} text-xs font-bold tracking-wide`}>
            WHAT YOU GET
          </Text>
        </View>
        <Text className={`text-4xl md:text-5xl font-black text-center mb-4 ${textColor}`}>
          Two AI agents to accelerate your tech career
        </Text>
        <Text className={`text-lg text-center ${mutedColor}`}>
          Specialized AI assistants that analyze your resume fit and rank your projects across tech roles
        </Text>
      </View>
      <View className="flex-row flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <View
            key={index}
            className={`${cardBg} border ${borderColor} rounded-2xl p-6 w-full md:w-[48%] lg:w-[30%] shadow-lg hover:shadow-xl transition-shadow`}
          >
            <View className={`w-12 h-12 ${feature.bgColor} rounded-xl items-center justify-center mb-4`}>
              <Ionicons name={feature.icon} size={24} color={iconColors[index]} />
            </View>
            <Text className={`text-lg font-bold mb-2 ${textColor}`}>{feature.title}</Text>
            <Text className={`text-sm leading-relaxed ${mutedColor}`}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
