import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function FeatureHighlights() {
  const features = [
    {
      icon: 'analytics' as const,
      title: 'Instant Fit Score',
      description: 'See how well your resume matches job requirements with a clear, quantified compatibility score.',
      color: '#3b82f6',
    },
    {
      icon: 'bulb' as const,
      title: 'Personalized Suggestions',
      description: 'Get specific, actionable feedback on how to improve your resume for each job you\'re applying to.',
      color: '#fbbf24',
    },
    {
      icon: 'shield-checkmark' as const,
      title: 'Secure and Private',
      description: 'Your resume and job data are encrypted and secure. We never share your information with third parties.',
      color: '#34d399',
    },
  ];

  return (
    <View className="mb-6">
      <Text className="text-white text-lg font-semibold mb-4">How It Works</Text>
      <View className="flex-row flex-wrap -mx-2">
        {features.map((feature, index) => (
          <View key={index} className="w-full md:w-1/3 px-2 mb-4" style={{ width: '100%' }}>
            <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-4">
              <View className="flex-row items-start mb-2">
                <View
                  className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Ionicons name={feature.icon} size={20} color={feature.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-sm font-semibold mb-1">
                    {feature.title}
                  </Text>
                  <Text className="text-zinc-400 text-xs leading-5">
                    {feature.description}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
      <View className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-3 mt-2">
        <View className="flex-row items-center">
          <Ionicons name="information-circle" size={16} color="#3b82f6" />
          <Text className="text-blue-400 text-xs ml-2 flex-1">
            File types: DOC, DOCX, TXT • PDF support coming soon
          </Text>
        </View>
      </View>
    </View>
  );
}
