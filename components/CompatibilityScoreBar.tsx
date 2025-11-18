import { View, Text } from "react-native";

interface CompatibilityScoreBarProps {
  score: number;
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "Excellent Match";
  if (score >= 80) return "Strong Match";
  if (score >= 70) return "Good Match";
  if (score >= 60) return "Fair Match";
  if (score >= 50) return "Moderate Match";
  return "Needs Improvement";
}

function getScoreColor(score: number): string {
  if (score >= 90) return "bg-green-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-cyan-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 50) return "bg-orange-500";
  return "bg-red-500";
}

export function CompatibilityScoreBar({ score }: CompatibilityScoreBarProps) {
  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-white text-sm font-semibold">
          Compatibility Score
        </Text>
        <Text className="text-white text-lg font-bold">
          {score}%
        </Text>
      </View>
      <View className="h-3 bg-zinc-800 rounded-full overflow-hidden mb-1">
        <View
          className={`h-full rounded-full ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </View>
      <Text className="text-zinc-400 text-xs">
        {getScoreLabel(score)}
      </Text>
    </View>
  );
}
