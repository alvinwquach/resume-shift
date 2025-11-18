import { View, Text } from "react-native";

interface TestimonialCardProps {
  name: string;
  quote: string;
}

export function TestimonialCard({ name, quote }: TestimonialCardProps) {
  return (
    <View className="w-1/2 px-2 mb-4">
      <View className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 h-full">
        <Text className="text-white font-semibold mb-2">{name}</Text>
        <Text className="text-zinc-400 text-sm leading-relaxed">{quote}</Text>
      </View>
    </View>
  );
}
