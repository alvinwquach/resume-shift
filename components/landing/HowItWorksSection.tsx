import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface HowItWorksSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}

const steps = [
  {
    number: '01',
    icon: 'cloud-upload',
    title: 'Upload your resume',
    description: 'Upload your resume in DOC, DOCX, or TXT format. We will keep it secure and private.'
  },
  {
    number: '02',
    icon: 'link',
    title: 'Paste a job link',
    description: 'Simply paste the URL of any job posting or the full job description text into our chat interface.'
  },
  {
    number: '03',
    icon: 'sparkles',
    title: 'Get instant insights',
    description: 'Our AI analyzes your resume against the job requirements and provides actionable feedback instantly.'
  }
];

export function HowItWorksSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor }: HowItWorksSectionProps) {
  return (
    <View className="px-6 py-20">
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        How it works
      </Text>
      <Text className={`text-xl text-center mb-16 ${mutedColor}`}>
        Three simple steps to optimize your resume
      </Text>

      <View className="max-w-5xl mx-auto">
        {steps.map((step, idx) => (
          <View key={idx} className="mb-12 last:mb-0">
            <View className="flex-row items-start">
              <View className="mr-6">
                <Text className={`text-7xl font-black ${isDarkMode ? 'text-zinc-800' : 'text-gray-200'}`}>
                  {step.number}
                </Text>
              </View>
              <View className="flex-1">
                <View className={`${cardBg} border ${borderColor} rounded-2xl p-8`}>
                  <View className="flex-row items-center mb-4">
                    <View className="w-14 h-14 bg-blue-500/10 rounded-2xl items-center justify-center mr-4">
                      <Ionicons name={step.icon as any} size={28} color="#3b82f6" />
                    </View>
                    <Text className={`text-2xl font-bold ${textColor}`}>{step.title}</Text>
                  </View>
                  <Text className={`text-lg leading-7 ${mutedColor}`}>{step.description}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
