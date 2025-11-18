import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { signInWithGoogle } from "../services/auth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();

      if (result.user) {
        router.replace("/(tabs)/optimize");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-zinc-950 border-b border-zinc-800">
          <View className="px-6 pt-12 pb-4 max-w-4xl mx-auto w-full">
            <TouchableOpacity
              onPress={() => router.push("/")}
              className="flex-row items-center active:opacity-80"
            >
              <View className="w-8 h-8 bg-white rounded-lg items-center justify-center mr-2">
                <Ionicons name="document-text" size={18} color="#000" />
              </View>
              <Text className="text-white text-lg font-semibold">
                ResumeShift
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-zinc-950 min-h-screen">
          <View className="px-6 py-20 max-w-md mx-auto w-full">
            <View className="mb-12">
              <Text className="text-white text-4xl font-bold mb-4">
                Welcome back
              </Text>
              <Text className="text-zinc-400 text-lg leading-relaxed">
                Log in to analyze your resume and get personalized job fit
                insights.
              </Text>
            </View>
            <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                disabled={isLoading}
                className={`flex-row items-center justify-center bg-white rounded-xl py-4 px-6 ${
                  isLoading ? "opacity-50" : "active:opacity-80"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <>
                    <Ionicons name="logo-google" size={20} color="#DB4437" />
                    <Text className="ml-3 text-black font-semibold text-base">
                      Continue with Google
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View className="mt-8">
              <Text className="text-zinc-600 text-sm text-center leading-relaxed">
                By logging in, you agree to our{" "}
                <Text
                  className="text-zinc-400 underline"
                  onPress={() => router.push("/terms")}
                >
                  Terms of Service
                </Text>
                {" and "}
                <Text
                  className="text-zinc-400 underline"
                  onPress={() => router.push("/privacy")}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
