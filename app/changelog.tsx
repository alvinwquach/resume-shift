import { Card, PageLayout } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function ChangelogPage() {
  return (
    <PageLayout>
      <Text className="text-white text-4xl font-bold mb-4">Changelog</Text>
      <Text className="text-zinc-400 text-lg leading-relaxed mb-12">
        All the latest updates, improvements, and bug fixes.
      </Text>
      <View className="mb-10">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white text-2xl font-bold mb-1">v1.0.0</Text>
            <Text className="text-zinc-500 text-sm">November 2025</Text>
          </View>
          <View className="bg-green-500/20 border border-green-500/30 rounded-full px-3 py-1">
            <Text className="text-green-400 text-xs font-semibold">Latest</Text>
          </View>
        </View>
        <Card className="mb-4">
          <Text className="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-3">
            New Features
          </Text>
          <View className="mb-3">
            <Text className="text-white text-base font-medium mb-1">
              🎉 Initial Launch
            </Text>
            <Text className="text-zinc-400 text-sm leading-relaxed">
              Resume Pivot is officially live! Upload your resume and job links
              to get instant fit scores.
            </Text>
          </View>
          <View className="mb-3">
            <Text className="text-white text-base font-medium mb-1">
              ✨ AI-Powered Analysis
            </Text>
            <Text className="text-zinc-400 text-sm leading-relaxed">
              Advanced AI algorithms analyze your resume against job
              requirements to provide accurate compatibility scores.
            </Text>
          </View>
          <View className="mb-3">
            <Text className="text-white text-base font-medium mb-1">
              💡 Personalized Feedback
            </Text>
            <Text className="text-zinc-400 text-sm leading-relaxed">
              Get specific, actionable suggestions on how to improve your resume
              for each job application.
            </Text>
          </View>
          <View>
            <Text className="text-white text-base font-medium mb-1">
              🔒 Secure Authentication
            </Text>
            <Text className="text-zinc-400 text-sm leading-relaxed">
              Sign in securely with Google to access your personalized dashboard
              and saved analyses.
            </Text>
          </View>
        </Card>
      </View>
      <Card padding="md" className="rounded-2xl">
        <View className="flex-row items-start mb-3">
          <Ionicons name="chatbubble-outline" size={24} color="#fff" />
          <View className="flex-1 ml-3">
            <Text className="text-white text-xl font-bold mb-2">
              Have feedback?
            </Text>
            <Text className="text-zinc-400 text-base leading-relaxed">
              We'd love to hear your thoughts on what features you'd like to see
              next. Your feedback helps shape ResumeShift's future.
            </Text>
          </View>
        </View>
      </Card>
    </PageLayout>
  );
}
