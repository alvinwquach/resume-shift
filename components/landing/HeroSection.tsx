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
      <View className={`mb-6 px-6 py-2 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-200'} rounded-full`}>
        <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-700'} text-sm font-semibold`}>✨ AI-Powered Resume Optimization</Text>
      </View>
      <Text className={`text-6xl md:text-7xl font-black text-center mb-6 ${textColor} leading-tight`}>
        Chat with AI.{'\n'}Land your dream job.
      </Text>
      <Text className={`text-xl md:text-2xl text-center mb-8 max-w-3xl ${mutedColor} leading-relaxed`}>
        Upload your resume, paste a job link, and get instant AI-powered insights.
        Track performance across applications and optimize for success.
      </Text>
      <View className="flex-row flex-wrap justify-center gap-6 mb-10">
        <View className="flex-row items-center">
          <View className={`w-5 h-5 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-2`}>
            <Ionicons name="checkmark" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
          </View>
          <Text className={`${mutedColor} font-medium`}>Free forever</Text>
        </View>
        <View className="flex-row items-center">
          <View className={`w-5 h-5 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-2`}>
            <Ionicons name="checkmark" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
          </View>
          <Text className={`${mutedColor} font-medium`}>No credit card</Text>
        </View>
        <View className="flex-row items-center">
          <View className={`w-5 h-5 rounded-full ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'} items-center justify-center mr-2`}>
            <Ionicons name="checkmark" size={14} color={isDarkMode ? '#4ade80' : '#16a34a'} />
          </View>
          <Text className={`${mutedColor} font-medium`}>Unlimited use</Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/optimize')}
        className={`${isDarkMode ? 'bg-blue-600' : 'bg-blue-600'} px-12 py-5 rounded-2xl active:opacity-80 shadow-2xl`}
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-bold">Get Started Free →</Text>
      </TouchableOpacity>
    </View>
  );
}
