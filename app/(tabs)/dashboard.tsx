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
import { ResumeUploadSection } from "../../components/dashboard/ResumeUploadSection";
import { TimeBasedTrends } from "../../components/dashboard/TimeBasedTrends";
import { TrendingBanner } from "../../components/dashboard/TrendingBanner";
import { useAuth } from "../../hooks/useAuth";
import { useUserAnalyses } from "../../hooks/useUserAnalyses";
import { useUserResume } from "../../hooks/useUserResume";
import { logout } from "../../services/auth";
import { SavedAnalysis } from "../../types/analysis";

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: analyses = [], isLoading, refetch } = useUserAnalyses(user?.uid);
  const { resume, isLoading: isLoadingResume, uploadResume, isUploading, deleteResume, refetch: refetchResume } = useUserResume(user?.uid);
  const [selectedAnalysis, setSelectedAnalysis] = useState<SavedAnalysis | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetch(), refetchResume()]);
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

  if (isLoading || isLoadingResume) {
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

  return (
    <ScrollView
      className="flex-1 bg-[#0A0A0A]"
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#3b82f6" />
      }
    >
      <View className="w-full px-6 pt-16 pb-24" style={{ maxWidth: contentMaxWidth, alignSelf: 'center' }}>
        <View className="mb-8">
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
        {user && (
          <ResumeUploadSection
            resume={resume}
            isUploading={isUploading}
            onUpload={uploadResume}
            onDelete={deleteResume}
            userId={user.uid}
          />
        )}
        {analyses.length === 0 && <FeatureHighlights />}
        <DashboardStats analyses={analyses} />
        <TrendingBanner analyses={analyses} />
        {analyses.length > 0 && <AnalyticsCharts analyses={analyses} />}
        {analyses.length >= 2 && <TimeBasedTrends analyses={analyses} />}
        {analyses.length > 0 && <ActionableInsights analyses={analyses} />}
        <ApplicationsList analyses={analyses} onAnalysisClick={handleAnalysisClick} />
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
    </ScrollView>
  );
}
