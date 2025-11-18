import { ScrollView, View } from "react-native";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  showLoginButton?: boolean;
  maxWidth?: boolean;
}

export function PageLayout({
  children,
  showLoginButton = true,
  maxWidth = true,
}: PageLayoutProps) {
  return (
    <View className="flex-1 bg-black">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Header showLoginButton={showLoginButton} />
        <View className="bg-zinc-950">
          <View
            className={`px-6 pt-8 pb-12 ${maxWidth ? "max-w-4xl mx-auto" : ""} w-full`}
          >
            {children}
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  );
}
