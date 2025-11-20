import { Text, View } from "react-native";

interface StatsSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
}

export function StatsSection({ isDarkMode, textColor, mutedColor }: StatsSectionProps) {
  const stats = [
    {
      value: "2",
      label: "AI Agents",
      description: "Specialized for tech careers"
    },
    {
      value: "10+",
      label: "Tech Roles",
      description: "From Frontend to AI/LLM"
    },
    {
      value: "Real-time",
      label: "Analysis",
      description: "Instant AI feedback"
    },
    {
      value: "100%",
      label: "Free",
      description: "No credit card required"
    }
  ];

  return (
    <View className="px-6 py-16">
      <View className="max-w-6xl mx-auto">
        <View className="flex-row flex-wrap justify-around gap-8">
          {stats.map((stat, index) => (
            <View key={index} className="items-center min-w-[150px]">
              <Text className={`text-5xl md:text-6xl font-black mb-2 ${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'}`}>
                {stat.value}
              </Text>
              <Text className={`${textColor} text-lg font-bold mb-1`}>
                {stat.label}
              </Text>
              <Text className={`${mutedColor} text-sm text-center`}>
                {stat.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
