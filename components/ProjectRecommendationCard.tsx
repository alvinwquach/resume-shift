import { View, Text } from "react-native";
import { ProjectRecommendation } from "../types/analysis";

interface ProjectRecommendationCardProps {
  project: ProjectRecommendation;
}

export function ProjectRecommendationCard({ project }: ProjectRecommendationCardProps) {
  return (
    <View className="mb-3 bg-gradient-to-br from-emerald-950/40 to-zinc-950 border border-emerald-800/30 rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-emerald-400 text-base font-bold flex-1 mr-2">
          {project.title}
        </Text>
        <View className="bg-emerald-500/20 px-2 py-1 rounded">
          <Text className="text-emerald-300 text-xs font-semibold">
            {project.timeEstimate}
          </Text>
        </View>
      </View>
      <Text className="text-zinc-300 text-sm mb-2 leading-relaxed">
        {project.description}
      </Text>
      <View className="flex-row flex-wrap gap-1 mb-2">
        {project.skills.map((skill, skillIndex) => (
          <View key={skillIndex} className="bg-zinc-800/60 px-2 py-1 rounded">
            <Text className="text-zinc-400 text-xs">{skill}</Text>
          </View>
        ))}
      </View>
      <View className="mt-2 pt-2 border-t border-emerald-800/20">
        <Text className="text-emerald-300 text-xs font-semibold mb-1">
          💪 Impact on Your Candidacy:
        </Text>
        <Text className="text-zinc-400 text-xs leading-relaxed">
          {project.impact}
        </Text>
      </View>
    </View>
  );
}
