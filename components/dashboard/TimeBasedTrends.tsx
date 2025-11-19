import { View, Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedAnalysis } from '../../types/analysis';
import { useState } from 'react';
import { LineChart, BarChart } from 'react-native-chart-kit';

interface TimeBasedTrendsProps {
  analyses: SavedAnalysis[];
}

type TimeRange = 'day' | 'week' | 'month' | 'quarter' | 'year';

export function TimeBasedTrends({ analyses }: TimeBasedTrendsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const screenWidth = Dimensions.get('window').width;

  if (analyses.length === 0) return null;

  // Group analyses by time period
  const groupByTimePeriod = () => {
    const now = new Date();
    const grouped: { [key: string]: { count: number; avgScore: number; totalScore: number } } = {};

    analyses.forEach(analysis => {
      const date = new Date(analysis.createdAt);
      let key: string;

      switch (timeRange) {
        case 'day':
          // Group by day (last 14 days)
          const daysDiff = Math.floor((now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000));
          if (daysDiff < 14) {
            if (daysDiff === 0) {
              key = 'Today';
            } else if (daysDiff === 1) {
              key = 'Yesterday';
            } else {
              // Use short date format for days
              key = `${date.getMonth() + 1}/${date.getDate()}`;
            }
          } else {
            return;
          }
          break;
        case 'week':
          // Group by week (last 8 weeks)
          const weeksDiff = Math.floor((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000));
          if (weeksDiff < 8) {
            key = weeksDiff === 0 ? 'This week' : `${weeksDiff} ${weeksDiff === 1 ? 'week' : 'weeks'} ago`;
          } else {
            return;
          }
          break;
        case 'month':
          // Group by month (last 6 months)
          const monthName = date.toLocaleDateString('en-US', { month: 'short' });
          const year = date.getFullYear();
          const currentYear = now.getFullYear();
          key = year === currentYear ? monthName : `${monthName} ${year}`;
          // Only include last 6 months
          const monthsDiff = (now.getFullYear() - year) * 12 + (now.getMonth() - date.getMonth());
          if (monthsDiff >= 6) return;
          break;
        case 'quarter':
          // Group by quarter (last 4 quarters)
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          const qYear = date.getFullYear();
          key = `Q${quarter} ${qYear}`;
          const quartersDiff = ((now.getFullYear() - qYear) * 4) + (Math.floor(now.getMonth() / 3) - (quarter - 1));
          if (quartersDiff >= 4) return;
          break;
        case 'year':
          // Group by year (last 3 years)
          const yearKey = date.getFullYear().toString();
          key = yearKey;
          if (now.getFullYear() - date.getFullYear() >= 3) return;
          break;
        default:
          key = 'Unknown';
      }

      if (!grouped[key]) {
        grouped[key] = { count: 0, avgScore: 0, totalScore: 0 };
      }
      grouped[key].count++;
      grouped[key].totalScore += analysis.result.compatibilityScore;
    });

    // Calculate averages
    Object.keys(grouped).forEach(key => {
      grouped[key].avgScore = Math.round(grouped[key].totalScore / grouped[key].count);
    });

    return grouped;
  };

  const groupedData = groupByTimePeriod();
  const periods = Object.keys(groupedData);
  const maxCount = Math.max(...Object.values(groupedData).map(d => d.count));

  // Calculate insights
  const totalApplications = analyses.length;
  const recentPeriodKey = periods[periods.length - 1]; // Get most recent period
  const previousPeriodKey = periods[periods.length - 2];
  const recentCount = recentPeriodKey ? groupedData[recentPeriodKey].count : 0;
  const previousCount = previousPeriodKey ? groupedData[previousPeriodKey].count : 0;

  // Calculate trend
  const trend = previousCount > 0 ? ((recentCount - previousCount) / previousCount) * 100 : 0;
  const isPositiveTrend = trend > 0;

  // Calculate average score across all analyses
  const avgScore = analyses.length > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.result.compatibilityScore, 0) / analyses.length)
    : 0;

  // Calculate recent period average score
  const recentAvgScore = recentPeriodKey ? groupedData[recentPeriodKey].avgScore : 0;

  // Get most active period
  const mostActivePeriod = periods.reduce((max, period) =>
    groupedData[period].count > (groupedData[max]?.count || 0) ? period : max
  , periods[0]) || 'N/A';

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-semibold">Activity Trends</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setTimeRange('day')}
            className={`mr-2 px-4 py-2 rounded-lg ${timeRange === 'day' ? 'bg-blue-600' : 'bg-zinc-900/50 border border-zinc-800/50'}`}
          >
            <Text className={`text-xs font-medium ${timeRange === 'day' ? 'text-white' : 'text-zinc-400'}`}>
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeRange('week')}
            className={`mr-2 px-4 py-2 rounded-lg ${timeRange === 'week' ? 'bg-blue-600' : 'bg-zinc-900/50 border border-zinc-800/50'}`}
          >
            <Text className={`text-xs font-medium ${timeRange === 'week' ? 'text-white' : 'text-zinc-400'}`}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeRange('month')}
            className={`mr-2 px-4 py-2 rounded-lg ${timeRange === 'month' ? 'bg-blue-600' : 'bg-zinc-900/50 border border-zinc-800/50'}`}
          >
            <Text className={`text-xs font-medium ${timeRange === 'month' ? 'text-white' : 'text-zinc-400'}`}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeRange('quarter')}
            className={`mr-2 px-4 py-2 rounded-lg ${timeRange === 'quarter' ? 'bg-blue-600' : 'bg-zinc-900/50 border border-zinc-800/50'}`}
          >
            <Text className={`text-xs font-medium ${timeRange === 'quarter' ? 'text-white' : 'text-zinc-400'}`}>
              Quarterly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTimeRange('year')}
            className={`px-4 py-2 rounded-lg ${timeRange === 'year' ? 'bg-blue-600' : 'bg-zinc-900/50 border border-zinc-800/50'}`}
          >
            <Text className={`text-xs font-medium ${timeRange === 'year' ? 'text-white' : 'text-zinc-400'}`}>
              Yearly
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View className="flex-row mb-4 -mx-2">
        <View className="w-1/4 px-2">
          <View className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-blue-400 text-xs font-medium">Total Apps</Text>
              <Ionicons name="briefcase-outline" size={14} color="#60a5fa" />
            </View>
            <Text className="text-white text-2xl font-bold">{totalApplications}</Text>
            <Text className="text-zinc-500 text-xs mt-1">All time</Text>
          </View>
        </View>
        <View className="w-1/4 px-2">
          <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-emerald-400 text-xs font-medium">Recent</Text>
              <Ionicons name="trending-up" size={14} color="#34d399" />
            </View>
            <Text className="text-white text-2xl font-bold">{recentCount}</Text>
            <View className="flex-row items-center mt-1">
              {Math.abs(trend) > 0 && (
                <>
                  <Ionicons
                    name={isPositiveTrend ? "arrow-up" : "arrow-down"}
                    size={10}
                    color={isPositiveTrend ? "#34d399" : "#fb7185"}
                  />
                  <Text className={`text-xs ml-1 ${isPositiveTrend ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.abs(Math.round(trend))}%
                  </Text>
                </>
              )}
              {Math.abs(trend) === 0 && <Text className="text-zinc-500 text-xs">No change</Text>}
            </View>
          </View>
        </View>
        <View className="w-1/4 px-2">
          <View className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-purple-400 text-xs font-medium">Avg Score</Text>
              <Ionicons name="analytics-outline" size={14} color="#a78bfa" />
            </View>
            <Text className="text-white text-2xl font-bold">{avgScore}%</Text>
            <Text className="text-zinc-500 text-xs mt-1">All time avg</Text>
          </View>
        </View>
        <View className="w-1/4 px-2">
          <View className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-amber-400 text-xs font-medium">Peak</Text>
              <Ionicons name="flame-outline" size={14} color="#fbbf24" />
            </View>
            <Text className="text-white text-lg font-bold" numberOfLines={1} style={{ fontSize: 14 }}>
              {mostActivePeriod}
            </Text>
            <Text className="text-zinc-500 text-xs mt-1">{groupedData[mostActivePeriod]?.count || 0} apps</Text>
          </View>
        </View>
      </View>
      <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white text-sm font-semibold">Application Activity</Text>
          <View className="flex-row items-center">
            <Ionicons name="bar-chart" size={14} color="#60a5fa" />
            <Text className="text-zinc-400 text-xs ml-1.5">Volume</Text>
          </View>
        </View>
        {periods.length === 0 ? (
          <View className="h-64 items-center justify-center">
            <Ionicons name="bar-chart-outline" size={48} color="#52525b" />
            <Text className="text-zinc-500 text-sm mt-3">No data for this time range</Text>
          </View>
        ) : (
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={{
                  labels: periods.reverse(),
                  datasets: [{
                    data: periods.map(period => groupedData[period].count),
                    colors: periods.map((period) => {
                      const avgScore = groupedData[period].avgScore;
                      if (avgScore >= 80) return () => '#34d399';
                      if (avgScore >= 60) return () => '#fbbf24';
                      return () => '#fb7185';
                    })
                  }]
                }}
                width={Math.max(screenWidth - 80, periods.length * 80)}
                height={240}
                chartConfig={{
                  backgroundColor: '#18181b',
                  backgroundGradientFrom: '#18181b',
                  backgroundGradientTo: '#18181b',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(96, 165, 250, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(113, 113, 122, ${opacity})`,
                  barPercentage: 0.7,
                  propsForBackgroundLines: {
                    strokeDasharray: '',
                    stroke: '#27272a',
                    strokeWidth: 1
                  },
                }}
                withCustomBarColorFromData={true}
                flatColor={true}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                showBarTops={true}
                fromZero={true}
              />
            </ScrollView>
            <View className="mt-3 pt-3 border-t border-zinc-800/50">
              <Text className="text-zinc-400 text-xs mb-2">Performance Scores</Text>
              <View className="flex-row flex-wrap">
                {periods.map((period, index) => {
                  const data = groupedData[period];
                  const scoreColor = data.avgScore >= 80 ? '#34d399' : data.avgScore >= 60 ? '#fbbf24' : '#fb7185';

                  return (
                    <View key={index} className="mr-4 mb-2">
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: scoreColor }} />
                        <Text className="text-zinc-400 text-xs">{period}:</Text>
                        <Text className="text-white text-xs font-semibold ml-1" style={{ color: scoreColor }}>
                          {data.avgScore}%
                        </Text>
                        <Text className="text-zinc-600 text-xs ml-1">({data.count})</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
            <View className="flex-row items-center justify-center mt-3 pt-3 border-t border-zinc-800/50">
              <View className="flex-row items-center mr-4">
                <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1" />
                <Text className="text-zinc-500 text-xs">Strong (80%+)</Text>
              </View>
              <View className="flex-row items-center mr-4">
                <View className="w-2 h-2 rounded-full bg-amber-400 mr-1" />
                <Text className="text-zinc-500 text-xs">Fair (60-79%)</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-rose-400 mr-1" />
                <Text className="text-zinc-500 text-xs">Weak ({'<'}60%)</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
