import { View, Text } from "react-native";
import { ExperienceGap } from "../types/analysis";

interface ExperienceGapCardProps {
  gap: ExperienceGap;
}

export function ExperienceGapCard({ gap }: ExperienceGapCardProps) {
  return (
    <View className="mb-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
      <Text className="text-white text-sm font-semibold mb-1.5">
        {gap.requirement}
      </Text>
      <Text className="text-red-400 text-xs mb-1.5 leading-relaxed">
        Gap: {gap.gap}
      </Text>
      <Text className="text-blue-400 text-xs leading-relaxed">
        💡 {gap.suggestion}
      </Text>
    </View>
  );
}
