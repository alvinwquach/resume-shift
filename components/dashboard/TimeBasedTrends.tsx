import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedAnalysis } from '../../types/analysis';
import { useState } from 'react';

interface TimeBasedTrendsProps {
  analyses: SavedAnalysis[];
}

type TimeRange = 'week' | 'month' | 'quarter' | 'year';

export function TimeBasedTrends({ analyses }: TimeBasedTrendsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('month');

  if (analyses.length === 0) return null;

  // Group analyses by time period
  const groupByTimePeriod = () => {
    const now = new Date();
    const grouped: { [key: string]: { count: number; avgScore: number; totalScore: number } } = {};

    analyses.forEach(analysis => {
      const date = new Date(analysis.createdAt);
      let key: string;

      switch (timeRange) {
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
  const recentPeriodKey = periods[0];
  const recentCount = recentPeriodKey ? groupedData[recentPeriodKey].count : 0;

  return (
    <View className="mb-6">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-semibold">Activity Trends</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row">
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
        <View className="w-1/3 px-2">
          <View className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
            <Text className="text-blue-400 text-xs font-medium mb-1">Total Apps</Text>
            <Text className="text-white text-2xl font-bold">{totalApplications}</Text>
          </View>
        </View>
        <View className="w-1/3 px-2">
          <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3">
            <Text className="text-emerald-400 text-xs font-medium mb-1">This {timeRange === 'week' ? 'Week' : timeRange === 'month' ? 'Month' : timeRange === 'quarter' ? 'Quarter' : 'Year'}</Text>
            <Text className="text-white text-2xl font-bold">{recentCount}</Text>
          </View>
        </View>
        <View className="w-1/3 px-2">
          <View className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
            <Text className="text-purple-400 text-xs font-medium mb-1">Most Active</Text>
            <Text className="text-white text-base font-bold" numberOfLines={1}>
              {periods.reduce((max, period) =>
                groupedData[period].count > (groupedData[max]?.count || 0) ? period : max
              , periods[0]) || 'N/A'}
            </Text>
          </View>
        </View>
      </View>
      <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4">
        <Text className="text-zinc-400 text-xs mb-4">Applications per {timeRange}</Text>
        <View className="h-48">
          {periods.length === 0 ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-zinc-500 text-sm">No data for this time range</Text>
            </View>
          ) : (
            <View className="flex-row items-end justify-between h-full">
              {periods.reverse().map((period, index) => {
                const data = groupedData[period];
                const height = (data.count / maxCount) * 100;
                const scoreColor = data.avgScore >= 80 ? '#34d399' : data.avgScore >= 60 ? '#fbbf24' : '#fb7185';

                return (
                  <View key={index} className="flex-1 items-center justify-end px-1">
                    <View className="w-full items-center mb-2">
                      <Text className="text-white text-xs font-semibold mb-1">{data.count}</Text>
                      <View
                        className="w-full rounded-t-lg"
                        style={{
                          height: `${Math.max(height, 5)}%`,
                          backgroundColor: scoreColor + '40',
                          borderTopWidth: 3,
                          borderTopColor: scoreColor,
                        }}
                      />
                    </View>
                    {/* Label */}
                    <Text className="text-zinc-500 text-xs text-center" numberOfLines={2}>
                      {period}
                    </Text>
                    <Text className="text-zinc-600 text-xs font-semibold mt-1" style={{ color: scoreColor }}>
                      {data.avgScore}%
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
        <View className="flex-row items-center justify-center mt-4 pt-3 border-t border-zinc-800/50">
          <View className="flex-row items-center mr-4">
            <View className="w-3 h-3 rounded-full bg-emerald-400 mr-1" />
            <Text className="text-zinc-500 text-xs">80%+</Text>
          </View>
          <View className="flex-row items-center mr-4">
            <View className="w-3 h-3 rounded-full bg-amber-400 mr-1" />
            <Text className="text-zinc-500 text-xs">60-79%</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-rose-400 mr-1" />
            <Text className="text-zinc-500 text-xs">{'<60%'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
