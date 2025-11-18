import { View, Text, ViewProps } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SectionProps extends ViewProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}

export function Section({
  title,
  subtitle,
  icon,
  children,
  className = "",
  ...props
}: SectionProps) {
  return (
    <View className={`mb-12 ${className}`} {...props}>
      {icon && (
        <View className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl items-center justify-center mb-4">
          <Ionicons name={icon} size={24} color="#fff" />
        </View>
      )}
      <Text className="text-white text-2xl font-bold mb-3">{title}</Text>
      {subtitle && (
        <Text className="text-zinc-400 text-base leading-relaxed mb-4">
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
}
