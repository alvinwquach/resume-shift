import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { SavedAnalysis } from "../../types/analysis";

interface VersionStats {
  resumeId: string;
  resumeLabel: string;
  count: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  recentApplications: number; 
}

interface Props {
  analyses: SavedAnalysis[];
}

export function ResumeVersionPerformance({ analyses }: Props) {
  const versionStats = useMemo(() => {
    const stats = new Map<string, VersionStats>();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    analyses.forEach((analysis) => {
      if (!analysis.resumeId || !analysis.resumeLabel) {
        return;
      }

      const resumeId = analysis.resumeId;
      const score = analysis.result.compatibilityScore;

      if (!stats.has(resumeId)) {
        stats.set(resumeId, {
          resumeId,
          resumeLabel: analysis.resumeLabel,
          count: 0,
          averageScore: 0,
          bestScore: 0,
          worstScore: 100,
          recentApplications: 0,
        });
      }

      const stat = stats.get(resumeId)!;
      stat.count++;
      stat.averageScore = ((stat.averageScore * (stat.count - 1)) + score) / stat.count;
      stat.bestScore = Math.max(stat.bestScore, score);
      stat.worstScore = Math.min(stat.worstScore, score);

      // Check if application is recent
      if (analysis.createdAt >= thirtyDaysAgo) {
        stat.recentApplications++;
      }
    });

    return Array.from(stats.values()).sort((a, b) => b.averageScore - a.averageScore);
  }, [analyses]);

  if (versionStats.length === 0) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-500/10 border-green-500/20";
    if (score >= 60) return "bg-yellow-500/10 border-yellow-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  const isWeb = Platform.OS === 'web';

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-white text-lg font-semibold">Resume Version Performance</Text>
          <Text className="text-zinc-500 text-xs mt-0.5">
            Compare how each resume version performs across applications
          </Text>
        </View>
        <View className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 items-center justify-center">
          <Ionicons name="analytics" size={16} color="#a855f7" />
        </View>
      </View>
      <View className="space-y-3">
        {versionStats.map((stat, index) => (
          <View
            key={stat.resumeId}
            className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4"
          >
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1">
                <View className="flex-row items-center">
                  {index === 0 && (
                    <View className="mr-2 px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded">
                      <Text className="text-yellow-400 text-xs font-semibold">Top Performer</Text>
                    </View>
                  )}
                  <Text className="text-white text-base font-semibold">
                    {stat.resumeLabel}
                  </Text>
                </View>
                <Text className="text-zinc-500 text-xs mt-1">
                  {stat.count} application{stat.count !== 1 ? 's' : ''} • {stat.recentApplications} recent
                </Text>
              </View>
              <View className={`px-3 py-1.5 rounded-lg border ${getScoreBgColor(stat.averageScore)}`}>
                <Text className={`text-sm font-bold ${getScoreColor(stat.averageScore)}`}>
                  {Math.round(stat.averageScore)}% avg
                </Text>
              </View>
            </View>
            <View className={`flex-row ${isWeb ? 'gap-3' : ''}`} style={!isWeb ? { gap: 12 } : {}}>
              <View className="flex-1 bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="trending-up" size={12} color="#22c55e" />
                  <Text className="text-zinc-400 text-xs ml-1">Best</Text>
                </View>
                <Text className="text-green-400 text-lg font-bold">
                  {Math.round(stat.bestScore)}%
                </Text>
              </View>
              <View className="flex-1 bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="trending-down" size={12} color="#ef4444" />
                  <Text className="text-zinc-400 text-xs ml-1">Lowest</Text>
                </View>
                <Text className="text-red-400 text-lg font-bold">
                  {Math.round(stat.worstScore)}%
                </Text>
              </View>

              {/* Range */}
              <View className="flex-1 bg-zinc-800/30 border border-zinc-700/30 rounded-lg p-3">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="swap-horizontal" size={12} color="#3b82f6" />
                  <Text className="text-zinc-400 text-xs ml-1">Range</Text>
                </View>
                <Text className="text-blue-400 text-lg font-bold">
                  {Math.round(stat.bestScore - stat.worstScore)}%
                </Text>
              </View>
            </View>
            {stat.count >= 3 && (
              <View className="mt-3 pt-3 border-t border-zinc-800/50">
                <View className="flex-row items-center">
                  <Ionicons
                    name={stat.averageScore >= 70 ? "checkmark-circle" : "information-circle"}
                    size={14}
                    color={stat.averageScore >= 70 ? "#22c55e" : "#eab308"}
                  />
                  <Text className={`text-xs ml-2 ${stat.averageScore >= 70 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {stat.averageScore >= 70
                      ? "Strong performance across applications"
                      : "Consider optimizing this version for better results"}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
      {versionStats.length >= 2 && (
        <View className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <View className="flex-row items-start">
            <Ionicons name="bulb" size={18} color="#3b82f6" />
            <View className="flex-1 ml-3">
              <Text className="text-blue-400 text-sm font-semibold mb-1">Insight</Text>
              <Text className="text-blue-300/80 text-xs leading-5">
                {(() => {
                  const diff = versionStats[0].averageScore - versionStats[versionStats.length - 1].averageScore;
                  if (diff >= 15) {
                    return `Your "${versionStats[0].resumeLabel}" resume performs ${Math.round(diff)}% better on average. Consider using it for more applications.`;
                  } else if (diff >= 5) {
                    return `Your resume versions show moderate variation (${Math.round(diff)}% difference). Each may work better for different role types.`;
                  } else {
                    return `Your resume versions perform similarly (within ${Math.round(diff)}%). Focus on tailoring for specific roles.`;
                  }
                })()}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
