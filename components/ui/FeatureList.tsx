import { View, Text } from "react-native";
import { Card } from "./Card";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureListProps {
  features: Feature[];
  variant?: "checkmark" | "icon";
}

export function FeatureList({
  features,
  variant = "checkmark",
}: FeatureListProps) {
  return (
    <Card>
      {features.map((feature, index) => (
        <View
          key={index}
          className={index < features.length - 1 ? "mb-2" : ""}
        >
          <Text className="text-zinc-300 text-sm">
            {variant === "checkmark" ? "✓ " : `${feature.icon} `}{feature.title}
          </Text>
          {feature.description && (
            <Text className="text-zinc-500 text-sm leading-relaxed ml-4">
              {feature.description}
            </Text>
          )}
        </View>
      ))}
    </Card>
  );
}
