import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ListItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  text: string;
}

export function ListItem({ icon, iconColor, text }: ListItemProps) {
  return (
    <View className="flex-row items-start mb-2 bg-zinc-950 border border-zinc-800 rounded-lg p-3">
      <View className="mt-0.5">
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <Text className="text-zinc-300 text-sm ml-2 flex-1 leading-relaxed">{text}</Text>
    </View>
  );
}
