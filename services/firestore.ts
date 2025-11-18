import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FieldValue } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { User } from "firebase/auth";
import { Platform } from "react-native";
import Constants from "expo-constants";

export interface UserData {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp | FieldValue;
  lastLoginAt: Timestamp | FieldValue;
  resumesCount?: number;
  jobComparisonsCount?: number;
  devicePlatform?: "web" | "ios" | "android";
  appVersion?: string;
}

/**
 * Creates or updates a user document in Firestore after authentication
 * @param user - The authenticated Firebase user
 */
export const createOrUpdateUser = async (user: User): Promise<void> => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Create new user document
      const userData: UserData = {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        resumesCount: 0,
        jobComparisonsCount: 0,
        devicePlatform: Platform.OS as "web" | "ios" | "android",
        appVersion: Constants.expoConfig?.version || "1.0.0",
      };

      await setDoc(userRef, userData);
      console.log("New user created in Firestore:", user.uid);
    } else {
      // Update existing user's last login time and platform metadata
      await setDoc(
        userRef,
        {
          lastLoginAt: serverTimestamp(),
          // Update profile info in case it changed
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          // Track which platform they're currently using
          devicePlatform: Platform.OS as "web" | "ios" | "android",
          appVersion: Constants.expoConfig?.version || "1.0.0",
        },
        { merge: true }
      );
      console.log("User last login updated in Firestore:", user.uid);
    }
  } catch (error) {
    console.error("Error creating/updating user in Firestore:", error);
    throw error;
  }
};

/**
 * Gets a user document from Firestore
 * @param uid - The user's unique ID
 */
export const getUser = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user from Firestore:", error);
    throw error;
  }
};

/**
 * Increments the resume count for a user
 * @param uid - The user's unique ID
 */
export const incrementResumeCount = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentCount = userDoc.data().resumesCount || 0;
      await setDoc(
        userRef,
        { resumesCount: currentCount + 1 },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Error incrementing resume count:", error);
    throw error;
  }
};

/**
 * Increments the job comparison count for a user
 * @param uid - The user's unique ID
 */
export const incrementJobComparisonCount = async (uid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const currentCount = userDoc.data().jobComparisonsCount || 0;
      await setDoc(
        userRef,
        { jobComparisonsCount: currentCount + 1 },
        { merge: true }
      );
    }
  } catch (error) {
    console.error("Error incrementing job comparison count:", error);
    throw error;
  }
};
