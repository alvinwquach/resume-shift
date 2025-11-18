import { Slot, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { auth } from "../firebaseConfig";
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
    } else if (user && !inAuthGroup && segments[0] === "login") {
      // Redirect to optimize page if user is authenticated and on login page
      console.log("Redirecting to optimize - user authenticated");
      router.replace("/(tabs)/optimize");
    }
  }, [user, segments, loading, router]);

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return <Slot />;
}
