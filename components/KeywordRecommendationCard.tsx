import { View, Text } from "react-native";
import { KeywordRecommendation } from "../types/analysis";

interface KeywordRecommendationCardProps {
  keyword: KeywordRecommendation;
}

export function KeywordRecommendationCard({ keyword }: KeywordRecommendationCardProps) {
  return (
    <View className="mb-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
      <View className="flex-row items-center justify-between mb-1.5">
        <Text className="text-white text-sm font-semibold flex-1 mr-2" numberOfLines={1}>
          {keyword.keyword}
        </Text>
        {keyword.currentlyPresent ? (
          <View className="bg-green-500/20 px-2 py-0.5 rounded">
            <Text className="text-green-400 text-xs font-semibold">PRESENT</Text>
          </View>
        ) : (
          <View className="bg-red-500/20 px-2 py-0.5 rounded">
            <Text className="text-red-400 text-xs font-semibold">MISSING</Text>
          </View>
        )}
      </View>
      <Text className="text-zinc-400 text-xs leading-relaxed">{keyword.reason}</Text>
    </View>
  );
}
