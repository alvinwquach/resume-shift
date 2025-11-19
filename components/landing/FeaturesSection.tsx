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
  return (
    <View className="px-6 py-16">
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        Everything you need
      </Text>
      <Text className={`text-xl text-center mb-12 ${mutedColor}`}>
        Powerful features to land your next role
      </Text>
      <View className="flex-row flex-wrap justify-center gap-4 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <View
            key={index}
            className={`${cardBg} border ${borderColor} rounded-2xl p-8 w-full md:w-[48%] lg:w-[23%]`}
          >
            <View className={`w-16 h-16 ${feature.bgColor} rounded-2xl items-center justify-center mb-6`}>
              <Ionicons name={feature.icon} size={32} color={isDarkMode ? '#fff' : '#000'} />
            </View>
            <Text className={`text-xl font-bold mb-3 ${textColor}`}>{feature.title}</Text>
            <Text className={`text-base leading-6 ${mutedColor}`}>{feature.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
