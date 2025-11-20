import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import type { ProjectRankingResult, RoleRanking } from "../../types/project";

interface Props {
  result: ProjectRankingResult;
}

export function ProjectRankingResults({ result }: Props) {
  const [expandedRole, setExpandedRole] = useState<string | null>(
    result.roleRankings[0]?.role || null
  );

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

  const getRecommendationStyle = (recommendation: string) => {
    switch (recommendation) {
      case "keep":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/20",
          text: "text-emerald-400",
          icon: "checkmark-circle" as const,
        };
      case "enhance":
        return {
          bg: "bg-amber-500/10 border-amber-500/20",
          text: "text-amber-400",
          icon: "construct" as const,
        };
      case "drop":
        return {
          bg: "bg-red-500/10 border-red-500/20",
          text: "text-red-400",
          icon: "close-circle" as const,
        };
      default:
        return {
          bg: "bg-zinc-800",
          text: "text-zinc-400",
          icon: "help-circle" as const,
        };
    }
  };

  return (
    <View className="space-y-4">
      <View className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-white font-semibold">Project Type</Text>
          <Text className="text-zinc-400">{result.projectType}</Text>
        </View>
        <Text className="text-zinc-300 leading-6">{result.overallSummary}</Text>
      </View>
      {result.bestFitRoles && result.bestFitRoles.length > 0 && (
        <View className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="trophy" size={18} color="#3b82f6" />
            <Text className="text-blue-400 font-semibold ml-2">
              Best Fit For
            </Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {result.bestFitRoles.map((role, index) => (
              <View
                key={index}
                className="bg-blue-500/20 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-blue-300 font-medium">{role}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      <View>
        <Text className="text-white font-semibold text-lg mb-3">
          Role Rankings ({result.roleRankings.length})
        </Text>
        {result.roleRankings.map((roleRanking, index) => (
          <RoleRankingCard
            key={roleRanking.role}
            roleRanking={roleRanking}
            isExpanded={expandedRole === roleRanking.role}
            onToggle={() =>
              setExpandedRole(
                expandedRole === roleRanking.role ? null : roleRanking.role
              )
            }
            getScoreColor={getScoreColor}
            getScoreBgColor={getScoreBgColor}
            getRecommendationStyle={getRecommendationStyle}
          />
        ))}
      </View>
      {result.universalRedFlags && result.universalRedFlags.length > 0 && (
        <View className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="warning" size={18} color="#ef4444" />
            <Text className="text-red-400 font-semibold ml-2">
              Universal Concerns
            </Text>
          </View>
          {result.universalRedFlags.map((flag, index) => (
            <View key={index} className="flex-row items-start mt-2">
              <Text className="text-red-400 mr-2">⚠️</Text>
              <Text className="text-red-300 flex-1">{flag}</Text>
            </View>
          ))}
        </View>
      )}
      {result.comparableProjects && result.comparableProjects.length > 0 && (
        <View className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="code-slash" size={18} color="#3b82f6" />
            <Text className="text-white font-semibold ml-2">
              Similar Strong Projects
            </Text>
          </View>
          {result.comparableProjects.map((project, index) => (
            <View key={index} className="flex-row items-start mt-2">
              <Text className="text-blue-400 mr-2">•</Text>
              <Text className="text-zinc-300 flex-1">{project}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

interface RoleRankingCardProps {
  roleRanking: RoleRanking;
  isExpanded: boolean;
  onToggle: () => void;
  getScoreColor: (score: number) => string;
  getScoreBgColor: (score: number) => string;
  getRecommendationStyle: (recommendation: string) => {
    bg: string;
    text: string;
    icon: "checkmark-circle" | "construct" | "close-circle" | "help-circle";
  };
}

function RoleRankingCard({
  roleRanking,
  isExpanded,
  onToggle,
  getScoreColor,
  getScoreBgColor,
  getRecommendationStyle,
}: RoleRankingCardProps) {
  const recommendationStyle = getRecommendationStyle(roleRanking.recommendation);

  return (
    <View className="bg-zinc-900 border border-zinc-800 rounded-xl mb-3 overflow-hidden">
      <TouchableOpacity
        onPress={onToggle}
        className="p-4"
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white font-semibold text-base mb-1">
              {roleRanking.role}
            </Text>
            <Text className="text-zinc-400 text-sm">
              {roleRanking.fitSummary}
            </Text>
          </View>
          <View className="flex-row items-center ml-3">
            <View
              className={`px-3 py-2 rounded-lg border mr-3 ${getScoreBgColor(
                roleRanking.marketabilityScore
              )}`}
            >
              <Text
                className={`font-bold ${getScoreColor(
                  roleRanking.marketabilityScore
                )}`}
              >
                {roleRanking.marketabilityScore.toFixed(1)}/10
              </Text>
            </View>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#71717a"
            />
          </View>
        </View>
        <View className="flex-row items-center mt-3 flex-wrap gap-2">
          <View
            className={`px-3 py-1.5 rounded-lg border ${recommendationStyle.bg}`}
          >
            <View className="flex-row items-center">
              <Ionicons
                name={recommendationStyle.icon}
                size={16}
                color={recommendationStyle.text.replace("text-", "#")}
              />
              <Text
                className={`ml-1.5 font-semibold uppercase text-xs ${recommendationStyle.text}`}
              >
                {roleRanking.recommendation}
              </Text>
            </View>
          </View>

          {roleRanking.appropriateLevel && (
            <View className="bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-lg">
              <Text className="text-purple-400 font-semibold uppercase text-xs">
                {roleRanking.appropriateLevel} LEVEL
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      {isExpanded && (
        <View className="px-4 pb-4 space-y-3 border-t border-zinc-800 pt-4">
          {roleRanking.levelReasoning && (
            <View className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="ribbon" size={16} color="#a855f7" />
                <Text className="text-purple-400 font-medium ml-1.5 text-sm">
                  Experience Level: {roleRanking.appropriateLevel?.toUpperCase()}
                </Text>
              </View>
              <Text className="text-zinc-300 text-xs leading-5">
                {roleRanking.levelReasoning}
              </Text>
            </View>
          )}
          <View className="bg-zinc-800/50 rounded-lg p-3">
            <Text className="text-white font-medium mb-2">Breakdown</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-zinc-400 text-sm">Technical Complexity</Text>
                <Text
                  className={`font-semibold ${getScoreColor(
                    roleRanking.technicalComplexity.score
                  )}`}
                >
                  {roleRanking.technicalComplexity.score.toFixed(1)}/10
                </Text>
              </View>
              <Text className="text-zinc-500 text-xs">
                {roleRanking.technicalComplexity.reasoning}
              </Text>
              <View className="border-b border-zinc-700 my-1" />
              <View className="flex-row justify-between items-center">
                <Text className="text-zinc-400 text-sm">Business Impact</Text>
                <Text
                  className={`font-semibold ${getScoreColor(
                    roleRanking.businessImpact.score
                  )}`}
                >
                  {roleRanking.businessImpact.score.toFixed(1)}/10
                </Text>
              </View>
              <Text className="text-zinc-500 text-xs">
                {roleRanking.businessImpact.reasoning}
              </Text>
              <View className="border-b border-zinc-700 my-1" />
              <View className="flex-row justify-between items-center">
                <Text className="text-zinc-400 text-sm">Market Relevance</Text>
                <Text
                  className={`font-semibold ${getScoreColor(
                    roleRanking.marketRelevance.score
                  )}`}
                >
                  {roleRanking.marketRelevance.score.toFixed(1)}/10
                </Text>
              </View>
              <Text className="text-zinc-500 text-xs">
                {roleRanking.marketRelevance.reasoning}
              </Text>
            </View>
          </View>
          {roleRanking.strengths && roleRanking.strengths.length > 0 && (
            <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                <Text className="text-emerald-400 font-medium ml-1.5 text-sm">
                  Strengths
                </Text>
              </View>
              {roleRanking.strengths.map((strength, index) => (
                <View key={index} className="flex-row items-start mt-1">
                  <Text className="text-emerald-400 mr-2 text-xs">•</Text>
                  <Text className="text-zinc-300 flex-1 text-xs">{strength}</Text>
                </View>
              ))}
            </View>
          )}
          {roleRanking.weaknesses && roleRanking.weaknesses.length > 0 && (
            <View className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="warning" size={16} color="#f59e0b" />
                <Text className="text-amber-400 font-medium ml-1.5 text-sm">
                  Weaknesses
                </Text>
              </View>
              {roleRanking.weaknesses.map((weakness, index) => (
                <View key={index} className="flex-row items-start mt-1">
                  <Text className="text-amber-400 mr-2 text-xs">•</Text>
                  <Text className="text-zinc-300 flex-1 text-xs">{weakness}</Text>
                </View>
              ))}
            </View>
          )}
          {roleRanking.redFlags && roleRanking.redFlags.length > 0 && (
            <View className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
                <Text className="text-red-400 font-medium ml-1.5 text-sm">
                  Red Flags
                </Text>
              </View>
              {roleRanking.redFlags.map((flag, index) => (
                <View key={index} className="flex-row items-start mt-1">
                  <Text className="text-red-400 mr-2 text-xs">•</Text>
                  <Text className="text-zinc-300 flex-1 text-xs">{flag}</Text>
                </View>
              ))}
            </View>
          )}
          {roleRanking.enhancementSuggestions && roleRanking.enhancementSuggestions.length > 0 && (
            <View className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <View className="flex-row items-center mb-2">
                <Ionicons name="construct" size={16} color="#3b82f6" />
                <Text className="text-blue-400 font-medium ml-1.5 text-sm">
                  How to Improve
                </Text>
              </View>
              {roleRanking.enhancementSuggestions.map((suggestion, index) => (
                <View key={index} className="bg-zinc-800/50 rounded p-2 mb-2">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-white text-xs flex-1 font-medium">
                      {suggestion.suggestion}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded ml-2 ${
                        suggestion.effort === "low"
                          ? "bg-emerald-500/20"
                          : suggestion.effort === "medium"
                          ? "bg-amber-500/20"
                          : "bg-red-500/20"
                      }`}
                    >
                      <Text
                        className={`text-xs ${
                          suggestion.effort === "low"
                            ? "text-emerald-400"
                            : suggestion.effort === "medium"
                            ? "text-amber-400"
                            : "text-red-400"
                        }`}
                      >
                        {suggestion.effort.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-zinc-400 text-xs">
                    {suggestion.impact}
                  </Text>
                </View>
              ))}
            </View>
          )}
          <View className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-3">
            <View className="flex-row items-center mb-2">
              <Ionicons name="bulb" size={16} color="#3b82f6" />
              <Text className="text-white font-medium ml-1.5 text-sm">
                How to Present This
              </Text>
            </View>
            <Text className="text-zinc-300 text-xs leading-5">
              {roleRanking.positioningAdvice}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
