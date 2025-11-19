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
  const iconColors = ['#3b82f6', '#a855f7', '#10b981', '#f97316'];

  return (
    <View className="px-6 py-20">
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        Everything you need
      </Text>
      <Text className={`text-xl text-center mb-16 ${mutedColor}`}>
        Powerful features to land your next role
      </Text>
      <View className="flex-row flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <View
            key={index}
            className={`${cardBg} border ${borderColor} rounded-2xl p-8 w-full md:w-[48%] lg:w-[23%] shadow-lg`}
          >
            <View className={`w-14 h-14 ${feature.bgColor} rounded-xl items-center justify-center mb-5`}>
              <Ionicons name={feature.icon} size={28} color={iconColors[index]} />
            </View>
            <Text className={`text-xl font-bold mb-3 ${textColor}`}>{feature.title}</Text>
            <Text className={`text-base leading-relaxed ${mutedColor}`}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
