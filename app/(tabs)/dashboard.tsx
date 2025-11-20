import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Dimensions, Modal, Platform, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AnalysisResults } from "../../components/AnalysisResults";
import { ActionableInsights } from "../../components/dashboard/ActionableInsights";
import { AnalyticsCharts } from "../../components/dashboard/AnalyticsCharts";
import { ApplicationsList } from "../../components/dashboard/ApplicationsList";
import { DashboardStats } from "../../components/dashboard/DashboardStats";
import { FeatureHighlights } from "../../components/dashboard/FeatureHighlights";
import { ProjectRankingsList } from "../../components/dashboard/ProjectRankingsList";
import { ResumeVersionManager } from "../../components/dashboard/ResumeVersionManager";
import { ResumeVersionPerformance } from "../../components/dashboard/ResumeVersionPerformance";
import { TimeBasedTrends } from "../../components/dashboard/TimeBasedTrends";
import { TrendingBanner } from "../../components/dashboard/TrendingBanner";
import { ProjectRankingResults } from "../../components/project-ranking/ProjectRankingResults";
import { useAuth } from "../../hooks/useAuth";
import { useUserAnalyses } from "../../hooks/useUserAnalyses";
import { useUserProjectRankings } from "../../hooks/useUserProjectRankings";
import { useUserResumes } from "../../hooks/useUserResumes";
import { logout } from "../../services/auth";
import { SavedAnalysis } from "../../types/analysis";
import type { SavedProjectRanking } from "../../types/project";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: analyses = [], isLoading, refetch } = useUserAnalyses(user?.uid);
  const { resumes, isLoading: isLoadingResumes, refetch: refetchResumes } = useUserResumes(user?.uid);
  const { data: projectRankings = [], isLoading: isLoadingRankings, refetch: refetchRankings } = useUserProjectRankings(user?.uid);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [selectedRanking, setSelectedRanking] = useState<SavedProjectRanking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [rankingModalVisible, setRankingModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'resumes' | 'analytics' | 'projects' | 'applications'>('overview');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), refetchResumes(), refetchRankings()]);
    setIsRefreshing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful, navigating to home");
      router.replace("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAnalysisClick = (analysis: SavedAnalysis) => {
    setSelectedAnalysis(analysis);
    setModalVisible(true);
  };

  const handleRankingClick = (ranking: SavedProjectRanking) => {
    setSelectedRanking(ranking);
    setRankingModalVisible(true);
  };

  if (isLoading || isLoadingResumes || isLoadingRankings) {
    return (
      <View className="flex-1 bg-[#0A0A0A] items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-zinc-400 mt-4 text-sm">Loading your dashboard...</Text>
      </View>
    );
  }

  const screenWidth = Dimensions.get('window').width;
  const isWeb = Platform.OS === 'web';
  const contentMaxWidth = isWeb ? 1200 : screenWidth;

  const sections = [
    { id: 'overview' as const, label: 'Overview', icon: 'home-outline' },
    { id: 'resumes' as const, label: 'Resumes', icon: 'document-text-outline' },
    { id: 'analytics' as const, label: 'Analytics', icon: 'bar-chart-outline' },
    { id: 'projects' as const, label: 'Projects', icon: 'briefcase-outline' },
    { id: 'applications' as const, label: 'Applications', icon: 'list-outline' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <>
            {analyses.length === 0 && <FeatureHighlights />}
            <DashboardStats analyses={analyses} />
            <TrendingBanner analyses={analyses} />
          </>
        );
      case 'resumes':
        return (
          <>
            {user && <ResumeVersionManager userId={user.uid} />}
            {analyses.length > 0 && <ResumeVersionPerformance analyses={analyses} />}
          </>
        );
      case 'analytics':
        return (
          <>
            {analyses.length > 0 && <AnalyticsCharts analyses={analyses} />}
            {analyses.length >= 2 && <TimeBasedTrends analyses={analyses} />}
            {analyses.length > 0 && <ActionableInsights analyses={analyses} />}
          </>
        );
      case 'projects':
        return <ProjectRankingsList rankings={projectRankings} onRankingClick={handleRankingClick} />;
      case 'applications':
        return <ApplicationsList analyses={analyses} onAnalysisClick={handleAnalysisClick} />;
      default:
        return null;
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#0A0A0A]"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#3b82f6" />
      }
    >
      <View className="w-full px-6 pt-16 pb-24" style={{ maxWidth: contentMaxWidth, alignSelf: 'center' }}>
        {/* Header */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-white text-3xl font-bold tracking-tight">
                Dashboard
              </Text>
              <Text className="text-zinc-500 text-sm mt-1.5">
                Welcome back{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="w-10 h-10 rounded-full bg-zinc-900/50 border border-zinc-800/50 items-center justify-center active:opacity-70"
            >
              <Ionicons name="log-out-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Segmented Control */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View className="flex-row gap-2">
            {sections.map((section) => (
              <TouchableOpacity
                key={section.id}
                onPress={() => setActiveSection(section.id)}
                className={`px-4 py-2.5 rounded-xl flex-row items-center ${
                  activeSection === section.id
                    ? 'bg-blue-600'
                    : 'bg-zinc-900/50 border border-zinc-800/50'
                }`}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={section.icon as any}
                  size={16}
                  color={activeSection === section.id ? '#ffffff' : '#71717a'}
                />
                <Text
                  className={`ml-2 text-sm font-medium ${
                    activeSection === section.id ? 'text-white' : 'text-zinc-400'
                  }`}
                >
                  {section.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Content */}
        {renderContent()}
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-[#0A0A0A]">
          <View className="px-6 pt-16 pb-4 border-b border-zinc-800/50 bg-zinc-900/30">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="w-10 h-10 rounded-full bg-zinc-800/50 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-base font-semibold">Details</Text>
              <View className="w-10" />
            </View>
          </View>
          <ScrollView className="flex-1">
            {selectedAnalysis && (
              <View className="px-6 py-6">
                <View className="mb-6">
                  <Text className="text-white text-2xl font-bold mb-2">
                    {selectedAnalysis.jobTitle || "Job Application"}
                  </Text>
                  {selectedAnalysis.companyName && (
                    <Text className="text-zinc-400 text-base mb-3">
                      {selectedAnalysis.companyName}
                    </Text>
                  )}
                  {selectedAnalysis.jobUrl && (
                    <TouchableOpacity
                      className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 self-start flex-row items-center mt-2"
                      onPress={() => {
                        if (Platform.OS === 'web') {
                          window.open(selectedAnalysis.jobUrl, '_blank');
                        }
                      }}
                    >
                      <Ionicons name="open-outline" size={14} color="#3b82f6" />
                      <Text className="text-blue-400 text-xs ml-2 font-medium">View Posting</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4">
                  <AnalysisResults
                    result={selectedAnalysis.result}
                    userEmail={user?.email || undefined}
                    jobTitle={selectedAnalysis.jobTitle}
                    jobCompany={selectedAnalysis.companyName}
                    resumeFileName={selectedAnalysis.resumeFileName}
                  />
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>

      {/* Project Ranking Details Modal */}
      <Modal
        visible={rankingModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setRankingModalVisible(false)}
      >
        <View className="flex-1 bg-[#0A0A0A]">
          <View className="px-6 pt-16 pb-4 border-b border-zinc-800/50 bg-zinc-900/30">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => setRankingModalVisible(false)}
                className="w-10 h-10 rounded-full bg-zinc-800/50 items-center justify-center"
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
              <Text className="text-white text-base font-semibold">Project Rankings</Text>
              <View className="w-10" />
            </View>
          </View>
          <ScrollView className="flex-1">
            {selectedRanking && (
              <View className="px-6 py-6">
                <View className="mb-6">
                  <Text className="text-white text-2xl font-bold mb-2">
                    Project Analysis Session
                  </Text>
                  <Text className="text-zinc-400 text-sm mb-2">
                    {selectedRanking.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                  {selectedRanking.targetRole && (
                    <View className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2 mt-2 self-start">
                      <Text className="text-blue-400 text-sm">
                        Target: {selectedRanking.targetRole}
                      </Text>
                    </View>
                  )}
                  {selectedRanking.candidateLevel && (
                    <View className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 mt-2 self-start">
                      <Text className="text-zinc-300 text-sm">
                        Level: {selectedRanking.candidateLevel}
                      </Text>
                    </View>
                  )}
                </View>

                {selectedRanking.projects.map((project, index) => (
                  <View
                    key={project.id}
                    className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 mb-4"
                  >
                    <View className="mb-4">
                      <Text className="text-white text-xl font-bold mb-1">
                        {project.title}
                      </Text>
                      <Text className="text-zinc-400 text-sm leading-5">
                        {project.description}
                      </Text>
                    </View>

                    {project.rankingResult && (
                      <ProjectRankingResults result={project.rankingResult} />
                    )}

                    {project.error && (
                      <View className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <Text className="text-red-400">{project.error}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    </ScrollView>
  );
}
