import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export function Footer() {
  const router = useRouter();

  return (
    <View className="bg-zinc-950 border-t border-zinc-800">
      <View className="px-6 py-12 max-w-4xl mx-auto w-full">
        <View className="mb-8 md:mb-12">
          <View className="md:flex-row md:justify-between md:items-start">
            <View className="mb-8 md:mb-0 md:max-w-xs items-center md:items-start">
              <TouchableOpacity
                onPress={() => router.push("/")}
                className="flex-row items-center mb-4 active:opacity-80"
              >
                <View className="w-6 h-6 bg-white rounded items-center justify-center mr-2">
                  <Ionicons name="document-text" size={14} color="#000" />
                </View>
                <Text className="text-white text-base font-semibold">
                  Resume Pivot
                </Text>
              </TouchableOpacity>
              <Text className="text-zinc-500 text-sm leading-relaxed text-center md:text-left">
                AI-powered resume analysis to help you land your dream job.
              </Text>
            </View>

            <View className="md:flex-row md:gap-x-12">
              <View className="mb-6 md:mb-0 items-center md:items-start">
                <Text className="text-white text-sm font-semibold mb-3">Company</Text>
                <View className="gap-y-2 items-center md:items-start">
                  <TouchableOpacity onPress={() => router.push("/about")}>
                    <Text className="text-zinc-400 text-sm">About</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="mb-6 md:mb-0 items-center md:items-start">
                <Text className="text-white text-sm font-semibold mb-3">Product</Text>
                <View className="gap-y-2 items-center md:items-start">
                  <TouchableOpacity onPress={() => router.push("/features")}>
                    <Text className="text-zinc-400 text-sm">Features</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/changelog")}>
                    <Text className="text-zinc-400 text-sm">Changelog</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="items-center md:items-start">
                <Text className="text-white text-sm font-semibold mb-3">Legal</Text>
                <View className="gap-y-2 items-center md:items-start">
                  <TouchableOpacity onPress={() => router.push("/privacy")}>
                    <Text className="text-zinc-400 text-sm">Privacy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push("/terms")}>
                    <Text className="text-zinc-400 text-sm">Terms</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="border-t border-zinc-800 pt-6">
          <Text className="text-zinc-600 text-xs text-center md:text-left">
            © 2025 Resume Pivot. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}
