import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { logout } from "../services/auth";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleCancel = () => {
    router.back();
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
                Log out?
              </Text>
              <Text className="text-zinc-400 text-lg leading-relaxed">
                Are you sure you want to log out? You can log back in anytime.
              </Text>
            </View>
            <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center justify-center bg-red-600 rounded-xl py-4 px-6 mb-3 active:opacity-80"
              >
                <Text className="text-white font-semibold text-base">
                  Yes, log out
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                className="flex-row items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl py-4 px-6 active:opacity-80"
              >
                <Text className="text-white font-semibold text-base">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
