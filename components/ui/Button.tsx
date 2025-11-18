import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: "bg-white",
    secondary: "bg-zinc-900 border border-zinc-800",
    ghost: "bg-transparent",
  };

  const sizeStyles = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const textVariantStyles = {
    primary: "text-black",
    secondary: "text-white",
    ghost: "text-white",
  };

  const textSizeStyles = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      className={`rounded-md active:opacity-80 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      <Text
        className={`font-semibold text-center ${textVariantStyles[variant]} ${textSizeStyles[size]}`}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}
