import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { signInWithGoogle, logout } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithGoogle();

      if (result.user) {
        router.replace("/(tabs)/dashboard");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = error instanceof Error ? error.message : "An error occurred during login";
      Alert.alert("Login Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Logout Failed", "Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleContinue = () => {
    router.replace("/(tabs)/dashboard");
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
            {user ? (
              // User is already logged in
              <>
                <View className="mb-12">
                  <Text className="text-white text-4xl font-bold mb-4">
                    You're logged in
                  </Text>
                  <Text className="text-zinc-400 text-lg leading-relaxed">
                    Continue to your dashboard or switch to a different account.
                  </Text>
                </View>
                <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-4">
                  <View className="flex-row items-center mb-6">
                    <View className="w-12 h-12 bg-zinc-800 rounded-full items-center justify-center mr-4">
                      <Text className="text-white text-lg font-bold">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-white text-base font-semibold">
                        {user.displayName || "User"}
                      </Text>
                      <Text className="text-zinc-400 text-sm">{user.email}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleContinue}
                    className="bg-white rounded-xl py-4 px-6 mb-3 active:opacity-80"
                  >
                    <Text className="text-black font-semibold text-base text-center">
                      Continue to Dashboard
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                    className={`bg-zinc-800 border border-zinc-700 rounded-xl py-4 px-6 ${
                      isLoggingOut ? "opacity-50" : "active:opacity-80"
                    }`}
                  >
                    {isLoggingOut ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text className="text-white font-semibold text-base text-center">
                        Switch Account
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              // User is not logged in
              <>
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
              </>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
