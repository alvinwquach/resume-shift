import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  variant?: "default" | "bordered" | "elevated";
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Card({
  variant = "bordered",
  padding = "md",
  children,
  className = "",
  ...props
}: CardProps) {
  const variantStyles = {
    default: "bg-zinc-950",
    bordered: "bg-zinc-950 border border-zinc-800",
    elevated: "bg-zinc-900 border border-zinc-800",
  };

  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <View
      className={`rounded-xl ${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
