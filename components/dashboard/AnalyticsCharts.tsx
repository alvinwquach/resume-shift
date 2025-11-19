
import { View, Text, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PieChart, LineChart } from 'react-native-chart-kit';
import { SavedAnalysis } from '../../types/analysis';
import { useState } from 'react';

interface AnalyticsChartsProps {
  analyses: SavedAnalysis[];
}

export function AnalyticsCharts({ analyses }: AnalyticsChartsProps) {
  const screenWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';
  const ITEMS_PER_PAGE = 10;

  const highScoreCount = analyses.filter(a => a.result.compatibilityScore >= 80).length;
  const mediumScoreCount = analyses.filter(a => a.result.compatibilityScore >= 60 && a.result.compatibilityScore < 80).length;
  const lowScoreCount = analyses.filter(a => a.result.compatibilityScore < 60).length;

  const pieData = [
    { name: "Strong", population: highScoreCount, color: "#34d399", legendFontColor: "#71717a", legendFontSize: 12 },
    { name: "Fair", population: mediumScoreCount, color: "#fbbf24", legendFontColor: "#71717a", legendFontSize: 12 },
    { name: "Weak", population: lowScoreCount, color: "#fb7185", legendFontColor: "#71717a", legendFontSize: 12 },
  ].filter(d => d.population > 0);

  // Sort analyses by date (oldest first for trend chart)
  const sortedAnalyses = [...analyses].sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // Calculate total pages
  const totalPages = Math.ceil(sortedAnalyses.length / ITEMS_PER_PAGE);

  // Default to last page (most recent data)
  const [currentPage, setCurrentPage] = useState(totalPages - 1);

  // Get paginated data (show most recent page by default)
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, sortedAnalyses.length);
  const paginatedAnalyses = sortedAnalyses.slice(startIndex, endIndex);

  // Generate labels and data points for current page
  const labels = paginatedAnalyses.map((a) => {
    const date = new Date(a.createdAt);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  });
  const dataPoints = paginatedAnalyses.map(a => a.result.compatibilityScore);

  const trendData = {
    labels,
    datasets: [{
      data: dataPoints.length > 0 ? dataPoints : [0],
    }]
  };

  // Top strengths and gaps
  const allStrengths: Record<string, number> = {};
  const allGaps: Record<string, number> = {};

  analyses.forEach(a => {
    a.result.strengths?.forEach(s => {
      allStrengths[s] = (allStrengths[s] || 0) + 1;
    });
    a.result.weaknesses?.forEach(w => {
      allGaps[w] = (allGaps[w] || 0) + 1;
    });
  });

  const topStrengths = Object.entries(allStrengths)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const topGaps = Object.entries(allGaps)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <View className="flex-row flex-wrap -mx-3">
      <View className="w-full px-3 mb-6" style={{ width: isWeb && screenWidth > 1024 ? '66.666%' : '100%' }}>
        {analyses.length > 0 && pieData.length > 0 && (
          <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 mb-6">
            <Text className="text-white text-base font-semibold mb-4">Score Distribution</Text>
            <View className="items-center overflow-hidden">
              <PieChart
                data={pieData}
                width={Math.min(screenWidth - 100, isWeb && screenWidth > 1024 ? 350 : 320)}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  backgroundColor: "#0A0A0A",
                  backgroundGradientFrom: "#0A0A0A",
                  backgroundGradientTo: "#0A0A0A",
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </View>
        )}
        {analyses.length > 1 && (
          <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-5 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-base font-semibold">Score Trend</Text>
              {totalPages > 1 && (
                <View className="flex-row items-center">
                  <TouchableOpacity
                    onPress={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className={`px-3 py-1.5 rounded-lg mr-2 flex-row items-center ${currentPage === 0 ? 'opacity-30 bg-zinc-800/30' : 'bg-zinc-800/50'}`}
                  >
                    <Ionicons name="chevron-back" size={14} color="#a1a1aa" />
                    <Text className="text-zinc-400 text-xs ml-1">Older</Text>
                  </TouchableOpacity>
                  <Text className="text-zinc-400 text-xs mx-2">
                    Page {currentPage + 1} of {totalPages}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage === totalPages - 1}
                    className={`px-3 py-1.5 rounded-lg flex-row items-center ${currentPage === totalPages - 1 ? 'opacity-30 bg-zinc-800/30' : 'bg-zinc-800/50'}`}
                  >
                    <Text className="text-zinc-400 text-xs mr-1">Newer</Text>
                    <Ionicons name="chevron-forward" size={14} color="#a1a1aa" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View className="overflow-x-auto">
              <LineChart
                data={trendData}
                width={paginatedAnalyses.length * 60}
                height={220}
                chartConfig={{
                  backgroundColor: "#0A0A0A",
                  backgroundGradientFrom: "#18181b",
                  backgroundGradientTo: "#18181b",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(113, 113, 122, ${opacity})`,
                  style: {
                    borderRadius: 16
                  },
                  propsForDots: {
                    r: "5",
                    strokeWidth: "2",
                    stroke: "#3b82f6"
                  }
                }}
                withInnerLines={true}
                withOuterLines={true}
                withVerticalLines={false}
                withHorizontalLines={true}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}
                getDotColor={() => '#3b82f6'}
                segments={4}
              />
            </View>
            <Text className="text-zinc-500 text-xs text-center mt-2">
              Showing {startIndex + 1}-{endIndex} of {sortedAnalyses.length} application{sortedAnalyses.length !== 1 ? 's' : ''}
            </Text>
          </View>
        )}
      </View>
      <View className="w-full px-3 mb-6" style={{ width: isWeb && screenWidth > 1024 ? '33.333%' : '100%' }}>
        {topStrengths.length > 0 && (
          <View className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="trending-up" size={18} color="#34d399" />
              <Text className="text-emerald-400 text-sm font-semibold ml-2">Top Strengths</Text>
            </View>
            {topStrengths.map(([strength, count], i) => (
              <View key={i} className="mb-2">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-zinc-300 text-xs flex-1" numberOfLines={2}>{strength}</Text>
                  <Text className="text-emerald-400 text-xs font-semibold ml-2">{count}</Text>
                </View>
                <View className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${(count / analyses.length) * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
        {topGaps.length > 0 && (
          <View className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="alert-circle" size={18} color="#fb7185" />
              <Text className="text-rose-400 text-sm font-semibold ml-2">Common Gaps</Text>
            </View>
            {topGaps.map(([gap, count], i) => (
              <View key={i} className="mb-2">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-zinc-300 text-xs flex-1" numberOfLines={2}>{gap}</Text>
                  <Text className="text-rose-400 text-xs font-semibold ml-2">{count}</Text>
                </View>
                <View className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-rose-400 rounded-full"
                    style={{ width: `${(count / analyses.length) * 100}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
