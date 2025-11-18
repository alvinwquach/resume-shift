import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedAnalysis } from '../../types/analysis';

interface DashboardStatsProps {
  analyses: SavedAnalysis[];
}

export function DashboardStats({ analyses }: DashboardStatsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#34d399";
    if (score >= 60) return "#fbbf24";
    return "#fb7185";
  };

  const averageScore = analyses.length > 0
    ? analyses.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / analyses.length
    : 0;

  const highScoreCount = analyses.filter(a => a.result.compatibilityScore >= 80).length;

  if (analyses.length === 0) return null;

  return (
    <View className="mb-6">
      <View className="flex-row -mx-2">
        <View className="flex-1 px-2">
          <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-zinc-400 text-xs font-medium">Applications</Text>
              <Ionicons name="briefcase-outline" size={16} color="#3b82f6" />
            </View>
            <Text className="text-white text-2xl font-bold">{analyses.length}</Text>
          </View>
        </View>
        <View className="flex-1 px-2">
          <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-zinc-400 text-xs font-medium">Avg Score</Text>
              <Ionicons name="analytics-outline" size={16} color={getScoreColor(averageScore)} />
            </View>
            <Text className="text-white text-2xl font-bold" style={{ color: getScoreColor(averageScore) }}>
              {Math.round(averageScore)}%
            </Text>
          </View>
        </View>
        <View className="flex-1 px-2">
          <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-zinc-400 text-xs font-medium">Strong</Text>
              <Ionicons name="checkmark-circle-outline" size={16} color="#34d399" />
            </View>
            <Text className="text-emerald-400 text-2xl font-bold">{highScoreCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
