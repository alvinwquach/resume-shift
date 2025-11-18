import { View, Text, TouchableOpacity, ScrollView, Platform, Dimensions, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SavedAnalysis } from '../../types/analysis';
import { useState } from 'react';
import { useRouter } from 'expo-router';

interface ApplicationsListProps {
  analyses: SavedAnalysis[];
  onAnalysisClick: (analysis: SavedAnalysis) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc' | 'company-asc';

export function ApplicationsList({ analyses, onAnalysisClick }: ApplicationsListProps) {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const screenWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#34d399";
    if (score >= 60) return "#fbbf24";
    return "#fb7185";
  };

  const getScoreCategory = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  // Apply search and filters
  let filteredAnalyses = analyses;

  // Search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredAnalyses = filteredAnalyses.filter(a =>
      a.jobTitle?.toLowerCase().includes(query) ||
      a.companyName?.toLowerCase().includes(query) ||
      a.result.strengths?.some(s => s.toLowerCase().includes(query)) ||
      a.result.weaknesses?.some(w => w.toLowerCase().includes(query))
    );
  }

  // Score category filter
  if (selectedFilter !== 'all') {
    filteredAnalyses = filteredAnalyses.filter(a =>
      getScoreCategory(a.result.compatibilityScore) === selectedFilter
    );
  }

  // Sort
  filteredAnalyses = [...filteredAnalyses].sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'date-asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'score-desc':
        return b.result.compatibilityScore - a.result.compatibilityScore;
      case 'score-asc':
        return a.result.compatibilityScore - b.result.compatibilityScore;
      case 'company-asc':
        return (a.companyName || '').localeCompare(b.companyName || '');
      default:
        return 0;
    }
  });

  const highScoreCount = analyses.filter(a => a.result.compatibilityScore >= 80).length;
  const mediumScoreCount = analyses.filter(a => a.result.compatibilityScore >= 60 && a.result.compatibilityScore < 80).length;
  const lowScoreCount = analyses.filter(a => a.result.compatibilityScore < 60).length;

  return (
    <View className="mt-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-white text-lg font-semibold">Applications</Text>
      </View>
      {analyses.length > 0 && (
        <View className="mb-4">
          <View className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl flex-row items-center px-4 py-3">
            <Ionicons name="search" size={18} color="#71717a" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by job title, company, or skills..."
              placeholderTextColor="#52525b"
              className="flex-1 ml-3 text-white text-sm"
              style={{ outlineStyle: 'none' } as any}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#52525b" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      {analyses.length > 0 && (
        <View className="mb-4 flex-row items-center">
          <Text className="text-zinc-500 text-xs mr-2">Sort by:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setSortBy('date-desc')}
                className={`mr-2 px-3 py-1.5 rounded-lg ${sortBy === 'date-desc' ? 'bg-zinc-800' : 'bg-zinc-900/30'}`}
              >
                <Text className={`text-xs ${sortBy === 'date-desc' ? 'text-white font-medium' : 'text-zinc-500'}`}>
                  Newest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSortBy('date-asc')}
                className={`mr-2 px-3 py-1.5 rounded-lg ${sortBy === 'date-asc' ? 'bg-zinc-800' : 'bg-zinc-900/30'}`}
              >
                <Text className={`text-xs ${sortBy === 'date-asc' ? 'text-white font-medium' : 'text-zinc-500'}`}>
                  Oldest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSortBy('score-desc')}
                className={`mr-2 px-3 py-1.5 rounded-lg ${sortBy === 'score-desc' ? 'bg-zinc-800' : 'bg-zinc-900/30'}`}
              >
                <Text className={`text-xs ${sortBy === 'score-desc' ? 'text-white font-medium' : 'text-zinc-500'}`}>
                  Highest Score
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSortBy('score-asc')}
                className={`mr-2 px-3 py-1.5 rounded-lg ${sortBy === 'score-asc' ? 'bg-zinc-800' : 'bg-zinc-900/30'}`}
              >
                <Text className={`text-xs ${sortBy === 'score-asc' ? 'text-white font-medium' : 'text-zinc-500'}`}>
                  Lowest Score
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSortBy('company-asc')}
                className={`px-3 py-1.5 rounded-lg ${sortBy === 'company-asc' ? 'bg-zinc-800' : 'bg-zinc-900/30'}`}
              >
                <Text className={`text-xs ${sortBy === 'company-asc' ? 'text-white font-medium' : 'text-zinc-500'}`}>
                  Company A-Z
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}
      {analyses.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setSelectedFilter('all')}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedFilter === 'all' ? 'bg-blue-600' : 'bg-zinc-900/50 border border-zinc-800/50'
              }`}
            >
              <Text className={`text-xs font-semibold ${selectedFilter === 'all' ? 'text-white' : 'text-zinc-400'}`}>
                All · {analyses.length}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter('high')}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedFilter === 'high' ? 'bg-emerald-600' : 'bg-zinc-900/50 border border-zinc-800/50'
              }`}
            >
              <Text className={`text-xs font-semibold ${selectedFilter === 'high' ? 'text-white' : 'text-zinc-400'}`}>
                Strong · {highScoreCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter('medium')}
              className={`mr-2 px-4 py-2 rounded-full ${
                selectedFilter === 'medium' ? 'bg-amber-600' : 'bg-zinc-900/50 border border-zinc-800/50'
              }`}
            >
              <Text className={`text-xs font-semibold ${selectedFilter === 'medium' ? 'text-white' : 'text-zinc-400'}`}>
                Fair · {mediumScoreCount}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedFilter('low')}
              className={`px-4 py-2 rounded-full ${
                selectedFilter === 'low' ? 'bg-rose-600' : 'bg-zinc-900/50 border border-zinc-800/50'
              }`}
            >
              <Text className={`text-xs font-semibold ${selectedFilter === 'low' ? 'text-white' : 'text-zinc-400'}`}>
                Weak · {lowScoreCount}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
      {filteredAnalyses.length === 0 ? (
        <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-12 items-center">
          <Ionicons name="document-text-outline" size={48} color="#52525b" />
          <Text className="text-zinc-400 text-sm text-center mt-4">
            {selectedFilter === 'all' ? "No applications yet" : `No ${selectedFilter} matches`}
          </Text>
          {selectedFilter === 'all' && (
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/optimize")}
              className="bg-blue-600 px-6 py-3 rounded-xl mt-4"
            >
              <Text className="text-white font-semibold text-sm">Get Started</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <View className="flex-row flex-wrap -mx-2">
          {filteredAnalyses.map((analysis) => (
            <View
              key={analysis.id}
              className="w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
              style={{ width: isWeb && screenWidth > 768 ? (screenWidth > 1024 ? '33.333%' : '50%') : '100%' }}
            >
              <TouchableOpacity
                className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 h-full"
                onPress={() => onAnalysisClick(analysis)}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1 mr-2">
                    <Text className="text-white text-sm font-semibold mb-1" numberOfLines={2}>
                      {analysis.jobTitle || "Job Application"}
                    </Text>
                    {analysis.companyName && (
                      <Text className="text-zinc-400 text-xs mb-2" numberOfLines={1}>
                        {analysis.companyName}
                      </Text>
                    )}
                  </View>
                  <View className="px-2 py-1 rounded-lg" style={{ backgroundColor: `${getScoreColor(analysis.result.compatibilityScore)}20` }}>
                    <Text className="font-bold text-sm" style={{ color: getScoreColor(analysis.result.compatibilityScore) }}>
                      {analysis.result.compatibilityScore}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center border-t border-zinc-800/50 pt-2">
                  <View className="flex-row items-center mr-3">
                    <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1" />
                    <Text className="text-zinc-500 text-xs">{analysis.result.strengths?.length || 0}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <View className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1" />
                    <Text className="text-zinc-500 text-xs">{analysis.result.weaknesses?.length || 0}</Text>
                  </View>
                  <Text className="text-zinc-600 text-xs ml-auto">
                    {new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
