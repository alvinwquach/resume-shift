import {
  signInWithPopup,
  signInWithCredential,
  signOut,
  onAuthStateChanged,
  User,
  UserCredential,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { createOrUpdateUser } from "./firestore";

WebBrowser.maybeCompleteAuthSession();

/**
 * Sign in with Google using popup (for web) or WebBrowser (for mobile)
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    console.log("Platform:", Platform.OS);

    // Use popup for web
    if (Platform.OS === "web") {
      console.log("Using web popup flow");
      const googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Sign in successful:", result.user?.email);

      // Add user to Firestore
      await createOrUpdateUser(result.user);

      return result;
    }

    // Use WebBrowser for mobile
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
    console.log("Client ID configured:", !!clientId);

    if (!clientId) {
      throw new Error("Google Web Client ID is not configured. Please add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to your .env file");
    }

    const redirectUri = "resumeshift://";
    console.log("Redirect URI:", redirectUri);

    // Build the Google OAuth URL
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent("openid profile email")}` +
      `&nonce=${Math.random().toString(36)}`;

    console.log("Opening auth session...");
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
    console.log("Auth session result:", result.type);

    if (result.type === "success" && result.url) {
      // Extract id_token from the URL
      const url = new URL(result.url);
      const hashParams = new URLSearchParams(url.hash.substring(1));
      const idToken = hashParams.get("id_token");

      if (idToken) {
        const credential = GoogleAuthProvider.credential(idToken);
        const result = await signInWithCredential(auth, credential);

        // Add user to Firestore
        await createOrUpdateUser(result.user);

        return result;
      }
    }

    throw new Error("Authentication was cancelled or failed");
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

/**
 * Subscribe to auth state changes
 */
export const subscribeToAuthChanges = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
