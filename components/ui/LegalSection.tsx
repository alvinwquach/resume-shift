import { Text, View } from "react-native";

interface LegalSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function LegalSection({ title, subtitle, children }: LegalSectionProps) {
  return (
    <View className="mb-10">
      {title && (
        <Text className="text-white text-2xl font-bold mb-4">{title}</Text>
      )}
      {subtitle && (
        <Text className="text-white text-lg font-semibold mb-3">{subtitle}</Text>
      )}
      {children}
    </View>
  );
}
