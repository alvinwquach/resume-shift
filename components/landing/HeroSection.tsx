import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

interface HeroSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
}

export function HeroSection({ isDarkMode, textColor, mutedColor }: HeroSectionProps) {
  return (
    <View className="items-center px-6 py-20 md:py-32">
      <View className="mb-6 px-6 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
        <Text className="text-blue-400 text-sm font-semibold">AI-Powered Resume Optimization</Text>
      </View>
      <Text className={`text-6xl md:text-7xl font-black text-center mb-6 ${textColor}`}>
        Chat with AI.{'\n'}Land your dream job.
      </Text>
      <Text className={`text-xl md:text-2xl text-center mb-8 max-w-3xl ${mutedColor}`}>
        Upload your resume, paste a job link, and get instant AI-powered insights.
        Track performance across applications and optimize for success.
      </Text>
      <View className="flex-row flex-wrap justify-center gap-4 mb-10">
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text className={`ml-2 ${mutedColor}`}>Free forever</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text className={`ml-2 ${mutedColor}`}>No credit card</Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="checkmark-circle" size={20} color="#10b981" />
          <Text className={`ml-2 ${mutedColor}`}>Unlimited use</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/optimize')}
        className="bg-blue-600 px-12 py-5 rounded-2xl active:opacity-80 shadow-xl"
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-bold">Get Started Free</Text>
      </TouchableOpacity>
    </View>
  );
}
