import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface ComparisonSectionProps {
  isDarkMode: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
  accentBg: string;
}

const comparisons = [
  { feature: 'Price', resumePivot: 'Free', others: '$29-300/mo', coaches: '$100-300/hr' },
  { feature: 'Speed', resumePivot: 'Instant', others: 'Minutes', coaches: 'Days' },
  { feature: 'AI Analysis', resumePivot: true, others: 'Limited', coaches: false },
  { feature: 'Version Tracking', resumePivot: true, others: 'Paid Only', coaches: false },
  { feature: 'Analytics Dashboard', resumePivot: true, others: false, coaches: false },
  { feature: 'Unlimited Use', resumePivot: true, others: false, coaches: false }
];

export function ComparisonSection({ isDarkMode, textColor, mutedColor, cardBg, borderColor, accentBg }: ComparisonSectionProps) {
  const renderCheck = (value: boolean | string) => {
    if (value === true) {
      return <Ionicons name="checkmark-circle" size={24} color="#22c55e" />;
    } else if (value === false) {
      return <Ionicons name="close-circle" size={24} color="#ef4444" />;
    } else {
      return <Text className={`${mutedColor} text-sm font-medium text-center`}>{value}</Text>;
    }
  };

  return (
    <View className={`${accentBg} px-6 py-20 border-y ${borderColor}`}>
      <Text className={`text-5xl font-black text-center mb-4 ${textColor}`}>
        Why Resume Pivot?
      </Text>
      <Text className={`text-xl text-center mb-16 ${mutedColor}`}>
        Better than expensive coaches and limited tools
      </Text>
      <View className="max-w-5xl mx-auto">
        <View className={`${cardBg} border ${borderColor} rounded-3xl overflow-hidden`}>
          <View className={`flex-row ${isDarkMode ? 'bg-zinc-800' : 'bg-gray-100'} border-b ${borderColor} p-4`}>
            <View className="flex-1" />
            <View className="flex-1 items-center">
              <Text className={`text-lg font-black ${textColor}`}>Resume Pivot</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className={`text-sm font-semibold ${mutedColor}`}>Other Tools</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className={`text-sm font-semibold ${mutedColor}`}>Career Coaches</Text>
            </View>
          </View>
          {comparisons.map((row, idx) => (
            <View
              key={idx}
              className={`flex-row p-4 ${idx !== comparisons.length - 1 ? `border-b ${borderColor}` : ''}`}
            >
              <View className="flex-1 justify-center">
                <Text className={`text-base font-semibold ${textColor}`}>{row.feature}</Text>
              </View>
              <View className="flex-1 items-center justify-center">
                {renderCheck(row.resumePivot)}
              </View>
              <View className="flex-1 items-center justify-center">
                {renderCheck(row.others)}
              </View>
              <View className="flex-1 items-center justify-center">
                {renderCheck(row.coaches)}
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
