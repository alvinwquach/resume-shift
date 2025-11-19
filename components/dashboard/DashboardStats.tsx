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
  const mediumScoreCount = analyses.filter(a => a.result.compatibilityScore >= 60 && a.result.compatibilityScore < 80).length;
  const lowScoreCount = analyses.filter(a => a.result.compatibilityScore < 60).length;

  // Get recent analyses (last 7 days)
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const recentAnalyses = analyses.filter(a => new Date(a.createdAt) >= sevenDaysAgo);

  // Calculate trend
  const recentAvg = recentAnalyses.length > 0
    ? recentAnalyses.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / recentAnalyses.length
    : 0;
  const trend = averageScore > 0 ? ((recentAvg - averageScore) / averageScore) * 100 : 0;

  // Get highest score
  const highestScore = analyses.length > 0
    ? Math.max(...analyses.map(a => a.result.compatibilityScore))
    : 0;

  // Success rate (80%+ scores)
  const successRate = analyses.length > 0 ? (highScoreCount / analyses.length) * 100 : 0;

  if (analyses.length === 0) return null;

  return (
    <View className="mb-6">
      <Text className="text-white text-xl font-bold mb-4">Overview</Text>
      <View className="flex-row flex-wrap -mx-2">
        <View className="w-1/4 px-2 mb-4">
          <View className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-blue-400 text-xs font-medium">Total Applications</Text>
              <Ionicons name="briefcase" size={18} color="#60a5fa" />
            </View>
            <Text className="text-white text-3xl font-bold mb-1">{analyses.length}</Text>
            <Text className="text-zinc-500 text-xs">All time submissions</Text>
          </View>
        </View>

        <View className="w-1/4 px-2 mb-4">
          <View className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-purple-400 text-xs font-medium">Average Score</Text>
              <Ionicons name="analytics" size={18} color="#a78bfa" />
            </View>
            <Text className="text-white text-3xl font-bold mb-1" style={{ color: getScoreColor(averageScore) }}>
              {Math.round(averageScore)}%
            </Text>
            <View className="flex-row items-center">
              {Math.abs(trend) > 0 && (
                <>
                  <Ionicons
                    name={trend > 0 ? "trending-up" : "trending-down"}
                    size={12}
                    color={trend > 0 ? "#34d399" : "#fb7185"}
                  />
                  <Text className={`text-xs ml-1 ${trend > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.abs(Math.round(trend))}% vs avg
                  </Text>
                </>
              )}
              {Math.abs(trend) === 0 && <Text className="text-zinc-500 text-xs">Stable</Text>}
            </View>
          </View>
        </View>

        <View className="w-1/4 px-2 mb-4">
          <View className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-emerald-400 text-xs font-medium">Success Rate</Text>
              <Ionicons name="trophy" size={18} color="#34d399" />
            </View>
            <Text className="text-emerald-400 text-3xl font-bold mb-1">{Math.round(successRate)}%</Text>
            <Text className="text-zinc-500 text-xs">{highScoreCount} strong matches</Text>
          </View>
        </View>

        <View className="w-1/4 px-2 mb-4">
          <View className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-amber-400 text-xs font-medium">Peak Score</Text>
              <Ionicons name="star" size={18} color="#fbbf24" />
            </View>
            <Text className="text-white text-3xl font-bold mb-1" style={{ color: getScoreColor(highestScore) }}>
              {highestScore}%
            </Text>
            <Text className="text-zinc-500 text-xs">Best performance</Text>
          </View>
        </View>
      </View>

      {/* Score Distribution Bar */}
      <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4">
        <Text className="text-white text-sm font-semibold mb-3">Score Distribution</Text>
        <View className="flex-row h-8 rounded-lg overflow-hidden mb-3">
          {highScoreCount > 0 && (
            <View
              className="bg-emerald-400 items-center justify-center"
              style={{ width: `${(highScoreCount / analyses.length) * 100}%` }}
            >
              {(highScoreCount / analyses.length) * 100 > 15 && (
                <Text className="text-white text-xs font-bold">{highScoreCount}</Text>
              )}
            </View>
          )}
          {mediumScoreCount > 0 && (
            <View
              className="bg-amber-400 items-center justify-center"
              style={{ width: `${(mediumScoreCount / analyses.length) * 100}%` }}
            >
              {(mediumScoreCount / analyses.length) * 100 > 15 && (
                <Text className="text-white text-xs font-bold">{mediumScoreCount}</Text>
              )}
            </View>
          )}
          {lowScoreCount > 0 && (
            <View
              className="bg-rose-400 items-center justify-center"
              style={{ width: `${(lowScoreCount / analyses.length) * 100}%` }}
            >
              {(lowScoreCount / analyses.length) * 100 > 15 && (
                <Text className="text-white text-xs font-bold">{lowScoreCount}</Text>
              )}
            </View>
          )}
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded bg-emerald-400 mr-2" />
            <Text className="text-zinc-400 text-xs">Strong (80%+)</Text>
            <Text className="text-white text-xs font-bold ml-2">{highScoreCount}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded bg-amber-400 mr-2" />
            <Text className="text-zinc-400 text-xs">Fair (60-79%)</Text>
            <Text className="text-white text-xs font-bold ml-2">{mediumScoreCount}</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded bg-rose-400 mr-2" />
            <Text className="text-zinc-400 text-xs">Weak ({'<'}60%)</Text>
            <Text className="text-white text-xs font-bold ml-2">{lowScoreCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
