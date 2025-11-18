import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from "../firebaseConfig";

export interface UserResume {
  fileName: string;
  fileUrl: string;
  storagePath: string;
  extractedText: string;
  uploadedAt: Date;
  fileSize?: number;
  mimeType?: string;
}

/**
 * Upload and save a user's resume to Firebase Storage and Firestore
 * @param userId - The user's UID
 * @param file - The file blob to upload
 * @param fileName - Original file name
 * @param extractedText - Extracted text from the resume
 * @param fileSize - Size of the file in bytes
 * @param mimeType - MIME type of the file
 * @returns UserResume object with file details
 */
export async function saveUserResume(
  userId: string,
  file: Blob | Uint8Array,
  fileName: string,
  extractedText: string,
  fileSize?: number,
  mimeType?: string
): Promise<UserResume> {
  try {
    // First, delete old resume if it exists
    await deleteUserResume(userId, false);

    // Create a storage path (single resume per user, not timestamped)
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `resumes/${userId}/current_${sanitizedFileName}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    console.log('Uploading resume to Firebase Storage:', storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    console.log('Resume uploaded, URL:', fileUrl);

    // Save metadata to Firestore
    const resumeData: UserResume = {
      fileName,
      fileUrl,
      storagePath,
      extractedText,
      uploadedAt: new Date(),
      fileSize,
      mimeType,
    };

    const userResumeRef = doc(db, "users", userId, "resume", "current");
    await setDoc(userResumeRef, {
      ...resumeData,
      uploadedAt: serverTimestamp(),
    });

    console.log('Resume metadata saved to Firestore');

    return resumeData;
  } catch (error) {
    console.error('Error saving user resume:', error);
    throw new Error('Failed to save resume');
  }
}

/**
 * Get a user's saved resume from Firestore
 * @param userId - The user's UID
 * @returns UserResume object or null if no resume exists
 */
export async function getUserResume(userId: string): Promise<UserResume | null> {
  try {
    const userResumeRef = doc(db, "users", userId, "resume", "current");
    const resumeDoc = await getDoc(userResumeRef);

    if (resumeDoc.exists()) {
      const data = resumeDoc.data();
      return {
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        storagePath: data.storagePath,
        extractedText: data.extractedText,
        uploadedAt: data.uploadedAt?.toDate() || new Date(),
        fileSize: data.fileSize,
        mimeType: data.mimeType,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user resume:', error);
    throw new Error('Failed to retrieve resume');
  }
}

/**
 * Delete a user's resume from both Firebase Storage and Firestore
 * @param userId - The user's UID
 * @param throwOnError - Whether to throw error if deletion fails
 */
export async function deleteUserResume(
  userId: string,
  throwOnError: boolean = true
): Promise<void> {
  try {
    // Get existing resume metadata
    const existingResume = await getUserResume(userId);

    if (existingResume) {
      // Delete from Storage
      try {
        const storageRef = ref(storage, existingResume.storagePath);
        await deleteObject(storageRef);
        console.log('Resume deleted from Storage');
      } catch (storageError) {
        console.error('Error deleting from storage:', storageError);
        // Continue even if storage deletion fails
      }

      // Delete from Firestore
      const userResumeRef = doc(db, "users", userId, "resume", "current");
      await deleteDoc(userResumeRef);

      console.log('Resume metadata deleted from Firestore');
    }
  } catch (error) {
    console.error('Error deleting user resume:', error);
    if (throwOnError) {
      throw new Error('Failed to delete resume');
    }
  }
}

/**
 * Check if a user has a resume saved
 * @param userId - The user's UID
 * @returns boolean indicating if resume exists
 */
export async function hasUserResume(userId: string): Promise<boolean> {
  try {
    const resume = await getUserResume(userId);
    return resume !== null && resume.extractedText !== null;
  } catch (error) {
    console.error('Error checking if user has resume:', error);
    return false;
  }
}
