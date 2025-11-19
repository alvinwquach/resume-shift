import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

interface DemoSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
  accentBg: string;
}

export function DemoSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor, accentBg }: DemoSectionProps) {
  const [score, setScore] = useState(0);
  const targetScore = 87;

  useEffect(() => {
    const interval = setInterval(() => {
      setScore(prev => {
        if (prev >= targetScore) {
          clearInterval(interval);
          return targetScore;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  const skills = [
    { name: 'Technical Skills', match: 92 },
    { name: 'Experience Level', match: 85 },
    { name: 'Education', match: 78 },
    { name: 'Keywords', match: 95 }
  ];

  const stats = [
    { icon: 'briefcase', label: 'Applications', value: '24' },
    { icon: 'trending-up', label: 'Avg Score', value: '84%' },
    { icon: 'trophy', label: 'Top Score', value: '96%' },
    { icon: 'time', label: 'This Week', value: '+12' }
  ];

  return (
    <View className={`px-6 py-20 ${accentBg}`}>
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        See it in action
      </Text>
      <Text className={`text-xl text-center mb-16 ${mutedColor}`}>
        From job post to insights in seconds
      </Text>
      <View className="max-w-6xl mx-auto">
        <View className="flex-row flex-wrap gap-8 mb-12">
          <View className={`flex-1 min-w-[300px] ${cardBg} border ${borderColor} rounded-3xl p-8`}>
            <View className="flex-row items-center mb-6">
              <View className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full items-center justify-center mr-4">
                <Ionicons name="person" size={24} color="#fff" />
              </View>
              <View>
                <Text className={`text-sm ${mutedColor}`}>Analyzing for</Text>
                <Text className={`text-lg font-bold ${textColor}`}>Senior Software Engineer</Text>
                <Text className={`text-sm ${mutedColor}`}>AcmeTech</Text>
              </View>
            </View>
            <View className={`${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-2xl p-6 mb-6`}>
              <Text className={`text-6xl font-black ${textColor} text-center mb-2`}>{score}%</Text>
              <Text className={`text-center ${mutedColor}`}>Match Score</Text>
            </View>
            <Text className={`text-sm font-semibold mb-4 ${textColor}`}>Skills Breakdown</Text>
            {skills.map((skill, idx) => (
              <View key={idx} className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className={`text-sm ${mutedColor}`}>{skill.name}</Text>
                  <Text className={`text-sm font-semibold ${textColor}`}>{skill.match}%</Text>
                </View>
                <View className={`h-2 ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${skill.match}%` }}
                  />
                </View>
              </View>
            ))}
          </View>
          <View className="flex-1 min-w-[300px]">
            <View className={`${cardBg} border ${borderColor} rounded-3xl p-8 mb-6`}>
              <Text className={`text-lg font-bold mb-6 ${textColor}`}>Performance Dashboard</Text>
              <View className="flex-row flex-wrap gap-4">
                {stats.map((stat, idx) => (
                  <View key={idx} className={`flex-1 min-w-[45%] ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} rounded-xl p-4`}>
                    <Ionicons name={stat.icon as any} size={24} color="#3b82f6" />
                    <Text className={`text-2xl font-bold mt-2 ${textColor}`}>{stat.value}</Text>
                    <Text className={`text-sm ${mutedColor}`}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className={`${cardBg} border ${borderColor} rounded-3xl p-8`}>
              <Text className={`text-lg font-bold mb-4 ${textColor}`}>AI Suggestions</Text>
              <View className="space-y-3">
                <View className="flex-row items-start mb-3">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text className={`ml-3 flex-1 ${mutedColor}`}>
                    Add more quantifiable metrics to your achievements
                  </Text>
                </View>
                <View className="flex-row items-start mb-3">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text className={`ml-3 flex-1 ${mutedColor}`}>
                    Include React and TypeScript in your skills section
                  </Text>
                </View>
                <View className="flex-row items-start">
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text className={`ml-3 flex-1 ${mutedColor}`}>
                    Emphasize leadership experience in your role descriptions
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
