import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import type { SavedProjectRanking } from "../../types/project";

interface Props {
  rankings: SavedProjectRanking[];
  onRankingClick: (ranking: SavedProjectRanking) => void;
}

export function ProjectRankingsList({ rankings, onRankingClick }: Props) {
  if (rankings.length === 0) {
    return (
      <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mt-6">
        <View className="items-center">
          <Ionicons name="analytics-outline" size={48} color="#3b82f6" />
          <Text className="text-white text-lg font-semibold mt-4 mb-2">
            No Project Rankings Yet
          </Text>
          <Text className="text-zinc-400 text-center text-sm">
            Head to the My Projects tab to analyze your projects and see which roles they fit best!
          </Text>
        </View>
      </View>
    );
  }

  const getAverageScore = (ranking: SavedProjectRanking): number => {
    const scores = ranking.projects
      .filter((p) => p.rankingResult)
      .flatMap((p) =>
        p.rankingResult!.roleRankings.map((r) => r.marketabilityScore)
      );

    if (scores.length === 0) return 0;
    // Return one decimal place instead of rounding to integer
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  };

  const getTopRoles = (ranking: SavedProjectRanking): string[] => {
    const allRoles = ranking.projects
      .filter((p) => p.rankingResult?.bestFitRoles)
      .flatMap((p) => p.rankingResult!.bestFitRoles);

    // Count occurrences
    const roleCounts = allRoles.reduce((acc, role) => {
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get top 2
    return Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([role]) => role);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-blue-400";
    if (score >= 4) return "text-amber-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return "bg-emerald-500/10 border-emerald-500/20";
    if (score >= 6) return "bg-blue-500/10 border-blue-500/20";
    if (score >= 4) return "bg-amber-500/10 border-amber-500/20";
    return "bg-red-500/10 border-red-500/20";
  };

  return (
    <View className="mt-6">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-white text-xl font-semibold">
            Project Rankings
          </Text>
          <Text className="text-zinc-400 text-sm mt-1">
            {rankings.length} {rankings.length === 1 ? "session" : "sessions"}
          </Text>
        </View>
        <Ionicons name="analytics" size={24} color="#3b82f6" />
      </View>

      <View className="flex-row flex-wrap -mx-2">
        {rankings.map((ranking) => {
          const avgScore = getAverageScore(ranking);
          const topRoles = getTopRoles(ranking);
          const projectCount = ranking.projects.length;

          return (
            <View key={ranking.id} className="w-full md:w-1/2 px-2 mb-4">
              <TouchableOpacity
                onPress={() => onRankingClick(ranking)}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full"
                activeOpacity={0.7}
              >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-white font-medium text-base">
                    {projectCount} {projectCount === 1 ? "Project" : "Projects"} Analyzed
                  </Text>
                  <Text className="text-zinc-400 text-xs mt-1">
                    {ranking.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
                <View
                  className={`px-3 py-2 rounded-lg border ${getScoreBgColor(avgScore)}`}
                >
                  <Text
                    className={`font-bold text-sm ${getScoreColor(avgScore)}`}
                  >
                    {avgScore.toFixed(1)}/10
                  </Text>
                </View>
              </View>
              {ranking.targetRole && (
                <View className="mb-2 flex-row items-center">
                  <Ionicons name="briefcase-outline" size={14} color="#71717a" />
                  <Text className="text-zinc-400 text-xs ml-1.5">
                    Target: {ranking.targetRole}
                  </Text>
                </View>
              )}
              {topRoles.length > 0 && (
                <View className="flex-row flex-wrap gap-2 mb-2">
                  {topRoles.map((role, index) => (
                    <View
                      key={index}
                      className="bg-blue-500/10 px-2 py-1 rounded"
                    >
                      <Text className="text-blue-400 text-xs">
                        {role}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
              <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-zinc-800">
                <Text className="text-zinc-500 text-xs">
                  Tap to view details
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#71717a" />
              </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}
