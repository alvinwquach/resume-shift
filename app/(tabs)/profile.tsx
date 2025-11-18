import { Text, View, TouchableOpacity, ScrollView, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { logout } from "../../services/auth";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logout successful, navigating to home");
      router.replace("/");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="px-6 pt-16" style={{ paddingBottom: Platform.OS === "web" ? 100 : 80 }}>
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2">Profile</Text>
          <Text className="text-zinc-400 text-base">
            Manage your account settings
          </Text>
        </View>
        <View className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 mb-6">
          <View className="flex-row items-center mb-4">
            <View className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full items-center justify-center mr-4">
              <Text className="text-white text-2xl font-bold">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xl font-semibold mb-1">
                {user?.displayName || "User"}
              </Text>
              <Text className="text-zinc-400 text-sm">{user?.email}</Text>
            </View>
          </View>
        </View>
        <View className="mb-6">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">
            Settings
          </Text>
          <View className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-900 active:opacity-60">
              <View className="flex-row items-center flex-1">
                <Ionicons name="notifications-outline" size={20} color="#fff" />
                <Text className="text-white text-base ml-3">
                  Notifications
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#71717a" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-zinc-900 active:opacity-60">
              <View className="flex-row items-center flex-1">
                <Ionicons name="lock-closed-outline" size={20} color="#fff" />
                <Text className="text-white text-base ml-3">Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#71717a" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between p-4 active:opacity-60">
              <View className="flex-row items-center flex-1">
                <Ionicons name="help-circle-outline" size={20} color="#fff" />
                <Text className="text-white text-base ml-3">Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mb-6">
          <Text className="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-4">
            Account
          </Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-zinc-950 border border-red-900/30 rounded-2xl p-4 active:opacity-60"
          >
            <View className="flex-row items-center">
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text className="text-red-500 text-base ml-3 font-medium">
                Log out
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View className="items-center mt-8">
          <Text className="text-zinc-600 text-xs">
            ResumeShift v1.0.0
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
