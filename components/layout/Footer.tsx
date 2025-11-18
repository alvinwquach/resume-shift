import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

const footerLinks = [
  { label: "Features", route: "/features" },
  { label: "Changelog", route: "/changelog" },
  { label: "About", route: "/about" },
  { label: "Privacy", route: "/privacy" },
  { label: "Terms", route: "/terms" },
] as const;

export function Footer() {
  const router = useRouter();

  return (
    <View className="bg-zinc-950 border-t border-zinc-800">
      <View className="px-6 py-12 max-w-4xl mx-auto w-full">
        <View className="mb-8">
          <View className="flex-row items-center mb-6">
            <View className="w-6 h-6 bg-white rounded items-center justify-center mr-2">
              <Ionicons name="document-text" size={14} color="#000" />
            </View>
            <Text className="text-white text-base font-semibold">
              ResumeShift
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-x-8 gap-y-4 mb-6">
            {footerLinks.map((link) => (
              <TouchableOpacity
                key={link.route}
                onPress={() => router.push(link.route)}
              >
                <Text className="text-zinc-400 text-sm">{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="border-t border-zinc-800 pt-6">
          <Text className="text-zinc-600 text-xs">
            © 2025 ResumeShift. All rights reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}
