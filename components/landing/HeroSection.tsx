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
    <View className="items-center px-6 py-32 md:py-48 relative overflow-hidden">
      <View className={`absolute -top-20 -left-20 w-[500px] h-[500px] ${isDarkMode ? 'bg-blue-600/20' : 'bg-blue-400/30'} rounded-full blur-3xl opacity-60`} />
      <View className={`absolute -bottom-20 -right-20 w-[500px] h-[500px] ${isDarkMode ? 'bg-purple-600/20' : 'bg-purple-400/30'} rounded-full blur-3xl opacity-60`} />
      <View className={`absolute top-1/2 left-1/2 w-[400px] h-[400px] ${isDarkMode ? 'bg-pink-600/10' : 'bg-pink-400/20'} rounded-full blur-3xl opacity-40`} />

      <View className="z-10 items-center max-w-5xl">
        <View className={`mb-8 px-5 py-2.5 ${isDarkMode ? 'bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'} border ${isDarkMode ? 'border-blue-500/20' : 'border-blue-300'} rounded-full shadow-2xl`}>
          <Text className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'} text-xs font-extrabold tracking-wider`}>
            ✨ AI-POWERED CAREER AGENTS
          </Text>
        </View>
        <View className="items-center mb-6">
          <Text className={`text-6xl md:text-8xl font-black text-center mb-2 ${textColor} leading-none tracking-tight`}>
            Land your dream
          </Text>
          <View className="flex-row items-center gap-3">
            <Text className="text-6xl md:text-8xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-none tracking-tight">
              tech role
            </Text>
          </View>
        </View>
        <Text className={`text-xl md:text-2xl text-center mb-12 max-w-3xl ${mutedColor} leading-relaxed font-medium`}>
          Two AI agents that analyze your resume, rank your projects, and show you exactly what to build for any tech role
        </Text>
        <View className="items-center gap-6">
          <TouchableOpacity
            onPress={() => router.push('/login')}
            className={`${isDarkMode ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gradient-to-r from-blue-600 to-purple-600'} px-12 py-5 rounded-2xl active:opacity-90 shadow-2xl flex-row items-center`}
            activeOpacity={0.9}
          >
            <Text className="text-white text-lg font-bold mr-3">Start Free Analysis</Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={16} color={isDarkMode ? '#4ade80' : '#16a34a'} />
              <Text className={`${mutedColor} text-sm font-medium`}>No credit card</Text>
            </View>
            <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={16} color={isDarkMode ? '#4ade80' : '#16a34a'} />
              <Text className={`${mutedColor} text-sm font-medium`}>Free forever</Text>
            </View>
            <View className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-zinc-700' : 'bg-gray-300'}`} />
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle" size={16} color={isDarkMode ? '#4ade80' : '#16a34a'} />
              <Text className={`${mutedColor} text-sm font-medium`}>2 AI agents</Text>
            </View>
          </View>
        </View>
        <View className="mt-16 flex-row flex-wrap justify-center gap-8">
          <View className="items-center">
            <Text className={`text-4xl font-black ${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-blue-600 to-cyan-600'} bg-clip-text text-transparent mb-1`}>
              10+
            </Text>
            <Text className={`${mutedColor} text-sm font-semibold`}>Tech Roles</Text>
          </View>
          <View className="items-center">
            <Text className={`text-4xl font-black ${isDarkMode ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gradient-to-r from-purple-600 to-pink-600'} bg-clip-text text-transparent mb-1`}>
              ~30s
            </Text>
            <Text className={`${mutedColor} text-sm font-semibold`}>Analysis Time</Text>
          </View>
          <View className="items-center">
            <Text className={`text-4xl font-black ${isDarkMode ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-emerald-600 to-teal-600'} bg-clip-text text-transparent mb-1`}>
              100%
            </Text>
            <Text className={`${mutedColor} text-sm font-semibold`}>Free</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
