import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SectionHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
}

export function SectionHeader({ icon, iconColor, title }: SectionHeaderProps) {
  return (
    <View className="flex-row items-center mb-3 px-1">
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text className="text-white text-lg font-bold ml-2">{title}</Text>
    </View>
  );
}
