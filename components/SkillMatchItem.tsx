import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SkillMatch } from "../types/analysis";

interface SkillMatchItemProps {
  skill: SkillMatch;
  isLast: boolean;
}

function getImportanceBadgeColor(importance: string): string {
  switch (importance) {
    case "critical":
      return "bg-red-500/20 text-red-400";
    case "high":
      return "bg-orange-500/20 text-orange-400";
    case "medium":
      return "bg-yellow-500/20 text-yellow-400";
    case "low":
      return "bg-green-500/20 text-green-400";
    default:
      return "bg-zinc-500/20 text-zinc-400";
  }
}

export function SkillMatchItem({ skill, isLast }: SkillMatchItemProps) {
  return (
    <View className={`flex-row items-center justify-between py-2.5 ${!isLast ? 'border-b border-zinc-800' : ''}`}>
      <View className="flex-row items-center flex-1 mr-2">
        <Ionicons
          name={skill.present ? "checkmark-circle" : "close-circle"}
          size={18}
          color={skill.present ? "#22c55e" : "#ef4444"}
        />
        <Text className="text-zinc-300 text-sm ml-2 flex-1" numberOfLines={2}>{skill.skill}</Text>
      </View>
      <View className={`px-2 py-1 rounded ${getImportanceBadgeColor(skill.importance)}`}>
        <Text className="text-xs font-semibold uppercase">
          {skill.importance}
        </Text>
      </View>
    </View>
  );
}
