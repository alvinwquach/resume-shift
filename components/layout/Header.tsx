import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

interface HeaderProps {
  showLoginButton?: boolean;
}

export function Header({ showLoginButton = true }: HeaderProps) {
  const router = useRouter();

  return (
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
          <View className="flex-row gap-x-3">
            <TouchableOpacity
              onPress={() => router.push("/")}
              className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-md active:opacity-80"
            >
              <Text className="text-white font-medium text-sm">Home</Text>
            </TouchableOpacity>
            {showLoginButton && (
              <TouchableOpacity
                onPress={() => router.push("/login")}
                className="px-4 py-2 bg-white rounded-md active:opacity-80"
              >
                <Text className="text-black font-medium text-sm">Log in</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
