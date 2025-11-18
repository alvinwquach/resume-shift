import { Slot, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../firebaseConfig";
import { QueryProvider } from "../providers/QueryProvider";
import Toast from 'react-native-toast-message';
import "../global.css";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed:", user ? user.email : "No user");
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(tabs)";
    console.log("Current route:", segments, "User:", user?.email, "In auth group:", inAuthGroup);

    if (!user && inAuthGroup) {
      // Redirect to login page if user is not authenticated
      console.log("Redirecting to login page - user not authenticated");
      router.replace("/login");
    }
    // Removed auto-redirect from login page - allow users to manually log in/switch accounts
  }, [user, segments, loading, router]);

  // Only show loading state for protected routes, not for landing page
  const isLandingPage = segments.length === 0 || segments[0] === "index";
  if (loading && !isLandingPage) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <QueryProvider>
      <Slot />
      <Toast />
    </QueryProvider>
  );
}
