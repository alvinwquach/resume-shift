import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedAnalysis } from '../../types/analysis';
import { useRouter } from 'expo-router';

interface ActionableInsightsProps {
  analyses: SavedAnalysis[];
}

export function ActionableInsights({ analyses }: ActionableInsightsProps) {
  const router = useRouter();

  if (analyses.length === 0) return null;

  // Calculate insights
  const averageScore = analyses.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / analyses.length;
  const highScores = analyses.filter(a => a.result.compatibilityScore >= 80);
  const lowScores = analyses.filter(a => a.result.compatibilityScore < 60);

  // Determine trend
  const getTrend = () => {
    if (analyses.length < 4) return null;
    const recent = analyses.slice(0, 3);
    const older = analyses.slice(3, 6);
    const recentAvg = recent.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / older.length;
    return recentAvg - olderAvg;
  };

  const trend = getTrend();

  // Generate actionable tips
  const tips = [];

  if (averageScore < 70) {
    tips.push({
      icon: 'bulb' as const,
      color: '#fbbf24',
      title: 'Improve Your Resume',
      description: 'Your average match is below 70%. Focus on highlighting relevant experience and skills.',
    });
  }

  if (trend !== null && trend < 0) {
    tips.push({
      icon: 'trending-down' as const,
      color: '#fb7185',
      title: 'Score Trending Down',
      description: 'Recent applications show declining scores. Review common gaps and update your resume.',
    });
  }

  if (trend !== null && trend > 5) {
    tips.push({
      icon: 'trophy' as const,
      color: '#34d399',
      title: 'Great Progress!',
      description: `Your scores improved by ${trend.toFixed(1)} points. Keep applying to similar roles!`,
    });
  }

  if (analyses.length >= 5 && highScores.length / analyses.length < 0.3) {
    tips.push({
      icon: 'star' as const,
      color: '#3b82f6',
      title: 'Target Better Matches',
      description: 'Only 30% of your applications are strong matches. Focus on roles that align with your skills.',
    });
  }

  if (tips.length === 0) {
    tips.push({
      icon: 'checkmark-circle' as const,
      color: '#34d399',
      title: 'Looking Good!',
      description: 'Your application strategy is on track. Keep analyzing jobs to find the best fits.',
    });
  }

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-semibold">Insights & Tips</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/optimize')}>
          <Text className="text-blue-400 text-xs font-medium">Analyze Job →</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row flex-wrap -mx-2">
        {tips.map((tip, index) => (
          <View key={index} className="w-full px-2 mb-4" style={{ width: '100%' }}>
            <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4">
              <View className="flex-row items-start">
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: `${tip.color}20` }}
                >
                  <Ionicons name={tip.icon} size={20} color={tip.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-semibold mb-1">
                    {tip.title}
                  </Text>
                  <Text className="text-zinc-400 text-xs leading-5">
                    {tip.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
