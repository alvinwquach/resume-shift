import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FeatureCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <View className="w-1/2 px-2 mb-6">
      <View className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg items-center justify-center mb-4">
        <Ionicons name={icon} size={20} color="#fff" />
      </View>
      <Text className="text-white text-xl font-semibold mb-2">{title}</Text>
      <Text className="text-zinc-400 text-base leading-relaxed">
        {description}
      </Text>
    </View>
  );
}
