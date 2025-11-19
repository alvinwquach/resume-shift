import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { DemoSection } from "../components/landing/DemoSection";
import { FAQSection } from "../components/landing/FAQSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HeroSection } from "../components/landing/HeroSection";
import { HowItWorksSection } from "../components/landing/HowItWorksSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";

export default function LandingPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);

  const bgColor = isDarkMode ? 'bg-[#0A0A0A]' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-zinc-900/50' : 'bg-white';
  const borderColor = isDarkMode ? 'border-zinc-800' : 'border-gray-200';
  const accentBg = isDarkMode ? 'bg-zinc-900' : 'bg-gray-50';

  return (
    <View className={`flex-1 ${bgColor}`}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className={`${bgColor} border-b ${borderColor} sticky top-0 z-50`}>
          <View className="px-6 py-4 max-w-7xl mx-auto w-full">
            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                onPress={() => router.push("/")}
                className="flex-row items-center active:opacity-80"
              >
                <View className={`w-9 h-9 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-900'} rounded-xl items-center justify-center mr-3`}>
                  <Ionicons name="document-text" size={20} color="white" />
                </View>
                <Text className={`${textColor} text-xl font-black`}>
                  Resume Pivot
                </Text>
              </TouchableOpacity>
              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => setIsDarkMode(!isDarkMode)}
                  className={`w-10 h-10 rounded-xl ${cardBg} border ${borderColor} items-center justify-center active:opacity-70`}
                >
                  <Ionicons name={isDarkMode ? "sunny" : "moon"} size={18} color={isDarkMode ? "#fbbf24" : "#6366f1"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push("/login")}
                  className={`px-5 py-2.5 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-900'} rounded-xl active:opacity-90`}
                >
                  <Text className="text-white font-semibold text-sm">Get Started</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <HeroSection isDarkMode={isDarkMode} textColor={textColor} mutedColor={mutedColor} />
        <View className={`${accentBg} border-y ${borderColor}`}>
          <FeaturesSection
            isDarkMode={isDarkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            cardBg={cardBg}
            borderColor={borderColor}
          />
        </View>
        <DemoSection
          isDarkMode={isDarkMode}
          textColor={textColor}
          mutedColor={mutedColor}
          cardBg={cardBg}
          borderColor={borderColor}
          accentBg={accentBg}
        />
        <View className={`${accentBg} border-y ${borderColor}`}>
          <HowItWorksSection
            isDarkMode={isDarkMode}
            textColor={textColor}
            mutedColor={mutedColor}
            cardBg={cardBg}
            borderColor={borderColor}
          />
        </View>
        <TestimonialsSection
          isDarkMode={isDarkMode}
          textColor={textColor}
          mutedColor={mutedColor}
          cardBg={cardBg}
          borderColor={borderColor}
          accentBg={accentBg}
        />
        <FAQSection
          isDarkMode={isDarkMode}
          textColor={textColor}
          mutedColor={mutedColor}
          cardBg={cardBg}
          borderColor={borderColor}
        />
        <View className={`${accentBg} py-24 border-t ${borderColor}`}>
          <View className="px-6 max-w-5xl mx-auto w-full items-center">
            <Text className={`${textColor} text-6xl font-black mb-6 text-center`}>
              Ready to land your{'\n'}dream job?
            </Text>
            <Text className={`${mutedColor} text-xl mb-12 text-center max-w-2xl`}>
              Join job seekers using AI to optimize their resumes and get hired faster.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              className={`${isDarkMode ? 'bg-blue-600' : 'bg-gray-900'} rounded-2xl px-12 py-6 active:opacity-90 shadow-2xl`}
            >
              <Text className="text-white font-bold text-xl">
                Start for Free →
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className={`${bgColor} border-t ${borderColor}`}>
          <View className="px-6 py-12 max-w-7xl mx-auto w-full">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className={`w-8 h-8 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-900'} rounded-lg items-center justify-center mr-3`}>
                  <Ionicons name="document-text" size={16} color="white" />
                </View>
                <Text className={`${textColor} text-lg font-black`}>Resume Pivot</Text>
              </View>
              <Text className={`${mutedColor} text-sm`}>
                © 2025 Resume Pivot. All rights reserved.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
