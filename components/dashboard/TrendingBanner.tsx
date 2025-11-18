import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedAnalysis } from '../../types/analysis';

interface TrendingBannerProps {
  analyses: SavedAnalysis[];
}

export function TrendingBanner({ analyses }: TrendingBannerProps) {
  const getTrend = () => {
    if (analyses.length < 4) return null;
    const recent = analyses.slice(0, 3);
    const older = analyses.slice(3, 6);
    const recentAvg = recent.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / recent.length;
    const olderAvg = older.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / older.length;
    const diff = recentAvg - olderAvg;
    return { diff, improving: diff > 0 };
  };

  const trend = getTrend();

  if (!trend) return null;

  return (
    <View className={`mb-6 rounded-2xl p-4 border ${
      trend.improving
        ? 'bg-emerald-500/5 border-emerald-500/20'
        : 'bg-rose-500/5 border-rose-500/20'
    }`}>
      <View className="flex-row items-center">
        <View className={`w-10 h-10 rounded-xl items-center justify-center ${
          trend.improving ? 'bg-emerald-500/20' : 'bg-rose-500/20'
        }`}>
          <Ionicons
            name={trend.improving ? "trending-up" : "trending-down"}
            size={20}
            color={trend.improving ? "#34d399" : "#fb7185"}
          />
        </View>
        <View className="ml-3 flex-1">
          <Text className={`font-semibold text-sm ${trend.improving ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.improving ? 'Trending Up!' : 'Needs Improvement'}
          </Text>
          <Text className="text-zinc-500 text-xs mt-0.5">
            Recent applications {trend.improving ? 'improved by' : 'decreased by'} {Math.abs(trend.diff).toFixed(1)} points
          </Text>
        </View>
      </View>
    </View>
  );
}
