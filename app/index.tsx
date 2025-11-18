import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-zinc-950">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-zinc-950 border-b border-zinc-800">
          <View className="px-6 pt-12 pb-4 max-w-4xl mx-auto w-full">
            <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-8 h-8 bg-white rounded-lg items-center justify-center mr-2">
                <Ionicons name="document-text" size={18} color="#000" />
              </View>
              <Text className="text-white text-lg font-semibold">
                ResumeShift
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              className="px-4 py-2 bg-white rounded-md active:opacity-80"
            >
              <Text className="text-black font-medium text-sm">Log in</Text>
            </TouchableOpacity>
          </View>
          </View>
        </View>
        <View className="bg-zinc-950">
          <View className="px-6 pt-20 pb-24 max-w-4xl mx-auto w-full">
            <View className="mb-6">
            <View className="bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 self-start mb-8">
              <Text className="text-zinc-400 text-xs font-medium">
                ✨ AI-Powered Resume Intelligence
              </Text>
            </View>
          </View>
          <Text className="text-white text-5xl font-bold leading-tight mb-6">
            Your resume,{"\n"}
            <Text className="text-zinc-500">optimized.</Text>
          </Text>
          <Text className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-md">
            Upload your resume and a job link. Get an instant fit score with personalized feedback to improve your chances.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="bg-white rounded-md px-6 py-4 active:opacity-80 self-start"
          >
            <Text className="text-black font-semibold text-base">
              Get started →
            </Text>
          </TouchableOpacity>
          </View>
        </View>
        <View className="bg-zinc-900/30 border-y border-zinc-800">
          <View className="px-6 py-16 max-w-4xl mx-auto w-full">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-8">
            Features
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-6">
              <View className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg items-center justify-center mb-4">
                <Ionicons name="sparkles-outline" size={20} color="#fff" />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                Job fit analysis
              </Text>
              <Text className="text-zinc-400 text-base leading-relaxed">
                Upload your resume and a public job link. Our AI analyzes your fit and provides a score with actionable feedback.
              </Text>
            </View>
            <View className="w-1/2 px-2 mb-6">
              <View className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg items-center justify-center mb-4">
                <Ionicons name="analytics-outline" size={20} color="#fff" />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                Instant fit score
              </Text>
              <Text className="text-zinc-400 text-base leading-relaxed">
                See how well your resume matches the job requirements with a clear, quantified compatibility score.
              </Text>
            </View>
            <View className="w-1/2 px-2 mb-6">
              <View className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg items-center justify-center mb-4">
                <Ionicons name="bulb-outline" size={20} color="#fff" />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                Personalized suggestions
              </Text>
              <Text className="text-zinc-400 text-base leading-relaxed">
                Get specific, actionable feedback on how to improve your resume for each job you're applying to.
              </Text>
            </View>
            <View className="w-1/2 px-2 mb-6">
              <View className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg items-center justify-center mb-4">
                <Ionicons name="shield-checkmark-outline" size={20} color="#fff" />
              </View>
              <Text className="text-white text-xl font-semibold mb-2">
                Secure and private
              </Text>
              <Text className="text-zinc-400 text-base leading-relaxed">
                Your resume and job data are encrypted and secure. We never share your information with third parties.
              </Text>
            </View>
          </View>
          </View>
        </View>
        <View className="bg-zinc-950">
          <View className="px-6 py-16 max-w-4xl mx-auto w-full">
            <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">
              Pricing
            </Text>
            <Text className="text-white text-3xl font-bold mb-4">
              Just kidding, free!
            </Text>
            <Text className="text-zinc-400 text-lg leading-relaxed mb-4">
              We believe everyone deserves a shot at their dream job. Use ResumeShift completely free while we build something amazing together.
            </Text>
            <Text className="text-zinc-500 text-base">
              You can support us by sharing with friends who need help with their job search! 🚀
            </Text>
          </View>
        </View>
        <View className="bg-zinc-900/30 border-y border-zinc-800">
          <View className="px-6 py-16 max-w-4xl mx-auto w-full">
          <Text className="text-white text-2xl font-bold mb-8">
            Job hunters love ResumeShift!
          </Text>
          <View className="flex-row flex-wrap -mx-2">
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
                <Text className="text-white font-semibold mb-2">Ben B.</Text>
                <Text className="text-zinc-400 text-sm leading-relaxed">
                  I hate @ResumeShift so much that I rewrote my entire resume using it
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
                <Text className="text-white font-semibold mb-2">Sarah M.</Text>
                <Text className="text-zinc-400 text-sm leading-relaxed">
                  i know this won't get me hired, but @ResumeShift is so good
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
                <Text className="text-white font-semibold mb-2">Maria G.</Text>
                <Text className="text-zinc-400 text-sm leading-relaxed">
                  ResumeShift is terrible. It doesn't even support PDF uploads yet.
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
                <Text className="text-white font-semibold mb-2">Kevin T.</Text>
                <Text className="text-zinc-400 text-sm leading-relaxed">
                  I used ResumeShift and got hired. Now I have to wake up at 7am every day. Thanks a lot.
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
                <Text className="text-white font-semibold mb-2">Kevin C.</Text>
                <Text className="text-zinc-400 text-sm leading-relaxed">
                  Is this a joke? Because if this is a joke, it's a really good one. I got 3 interviews in one week.
                </Text>
              </View>
            </View>
            <View className="w-1/2 px-2 mb-4">
              <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
                <Text className="text-white font-semibold mb-2">Marcus J.</Text>
                <Text className="text-zinc-400 text-sm leading-relaxed">
                  ResumeShift: 85% fit score{"\n"}Me: applies anyway{"\n"}Them: offers me the job{"\n"}ResumeShift: surprised pikachu face
                </Text>
              </View>
            </View>
          </View>
          </View>
        </View>
        <View className="bg-zinc-950">
          <View className="px-6 py-20 max-w-4xl mx-auto w-full">
            <View className="items-center">
              <Text className="text-white text-4xl font-bold mb-4 text-center">
                Find your perfect fit
              </Text>
              <Text className="text-zinc-400 text-lg leading-relaxed mb-8 text-center max-w-2xl">
                Start analyzing your resume against job opportunities and get the insights you need to succeed.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/login")}
                className="bg-white rounded-lg px-8 py-4 active:opacity-80"
              >
                <Text className="text-black font-semibold text-base">
                  Get started for free →
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="bg-zinc-950 border-t border-zinc-800">
          <View className="px-6 py-12 max-w-4xl mx-auto w-full">
            <View className="mb-8">
              <View className="flex-row items-center mb-6">
                <View className="w-6 h-6 bg-white rounded items-center justify-center mr-2">
                  <Ionicons name="document-text" size={14} color="#000" />
                </View>
                <Text className="text-white text-base font-semibold">
                  ResumeShift
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-x-8 gap-y-4 mb-6">
                <TouchableOpacity onPress={() => router.push("/features")}>
                  <Text className="text-zinc-400 text-sm">Features</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/changelog")}>
                  <Text className="text-zinc-400 text-sm">Changelog</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/about")}>
                  <Text className="text-zinc-400 text-sm">About</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/privacy")}>
                  <Text className="text-zinc-400 text-sm">Privacy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push("/terms")}>
                  <Text className="text-zinc-400 text-sm">Terms</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="border-t border-zinc-800 pt-6">
              <Text className="text-zinc-600 text-xs">
                © 2025 ResumeShift. All rights reserved.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
