import { doc, setDoc, getDoc, deleteDoc, serverTimestamp, collection, getDocs, query, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from "../firebaseConfig";

export interface UserResume {
  id: string; // Unique ID for each resume version
  fileName: string;
  fileUrl: string;
  storagePath: string;
  extractedText: string;
  uploadedAt: Date;
  fileSize?: number;
  mimeType?: string;
  label?: string; // User-friendly label like "Software Engineer", "TPM Focus", etc.
  isDefault?: boolean; // Mark one resume as default
  tags?: string[]; // Tags for categorization
}

/**
 * Upload and save a user's resume version to Firebase Storage and Firestore
 * @param userId - The user's UID
 * @param file - The file blob to upload
 * @param fileName - Original file name
 * @param extractedText - Extracted text from the resume
 * @param label - User-friendly label for this version
 * @param fileSize - Size of the file in bytes
 * @param mimeType - MIME type of the file
 * @param tags - Tags for categorization
 * @returns UserResume object with file details
 */
export async function saveUserResume(
  userId: string,
  file: Blob | Uint8Array,
  fileName: string,
  extractedText: string,
  fileSize?: number,
  mimeType?: string,
  label?: string,
  tags?: string[]
): Promise<UserResume> {
  try {
    // Generate unique ID for this resume version
    const resumeId = `resume_${Date.now()}`;

    // Create a storage path with unique ID
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `resumes/${userId}/${resumeId}_${sanitizedFileName}`;

    // Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    console.log('Uploading resume to Firebase Storage:', storagePath);

    const snapshot = await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(snapshot.ref);

    console.log('Resume uploaded, URL:', fileUrl);

    // Check if this is the first resume (make it default)
    const allResumes = await getAllUserResumes(userId);
    const isFirstResume = allResumes.length === 0;

    // Save metadata to Firestore
    const resumeData: UserResume = {
      id: resumeId,
      fileName,
      fileUrl,
      storagePath,
      extractedText,
      uploadedAt: new Date(),
      fileSize,
      mimeType,
      label: label || fileName.replace(/\.[^/.]+$/, ''), // Default to filename without extension
      isDefault: isFirstResume,
      tags: tags || [],
    };

    const userResumeRef = doc(db, "users", userId, "resumes", resumeId);
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
 * Get all resume versions for a user
 * @param userId - The user's UID
 * @returns Array of UserResume objects
 */
export async function getAllUserResumes(userId: string): Promise<UserResume[]> {
  try {
    const resumesRef = collection(db, "users", userId, "resumes");
    const resumesSnapshot = await getDocs(resumesRef);

    const resumes: UserResume[] = [];
    resumesSnapshot.forEach((doc) => {
      const data = doc.data();
      resumes.push({
        id: doc.id,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        storagePath: data.storagePath,
        extractedText: data.extractedText,
        uploadedAt: data.uploadedAt?.toDate() || new Date(),
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        label: data.label,
        isDefault: data.isDefault || false,
        tags: data.tags || [],
      });
    });

    // Sort by uploadedAt (newest first) and isDefault (default first)
    resumes.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return b.uploadedAt.getTime() - a.uploadedAt.getTime();
    });

    return resumes;
  } catch (error) {
    console.error('Error getting user resumes:', error);
    throw new Error('Failed to retrieve resumes');
  }
}

/**
 * Get the default resume for a user
 * @param userId - The user's UID
 * @returns UserResume object or null if no resume exists
 */
export async function getDefaultResume(userId: string): Promise<UserResume | null> {
  try {
    const allResumes = await getAllUserResumes(userId);
    return allResumes.find(r => r.isDefault) || allResumes[0] || null;
  } catch (error) {
    console.error('Error getting default resume:', error);
    throw new Error('Failed to retrieve default resume');
  }
}

/**
 * Get a specific resume by ID
 * @param userId - The user's UID
 * @param resumeId - The resume ID
 * @returns UserResume object or null
 */
export async function getResumeById(userId: string, resumeId: string): Promise<UserResume | null> {
  try {
    const resumeRef = doc(db, "users", userId, "resumes", resumeId);
    const resumeDoc = await getDoc(resumeRef);

    if (resumeDoc.exists()) {
      const data = resumeDoc.data();
      return {
        id: resumeDoc.id,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        storagePath: data.storagePath,
        extractedText: data.extractedText,
        uploadedAt: data.uploadedAt?.toDate() || new Date(),
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        label: data.label,
        isDefault: data.isDefault || false,
        tags: data.tags || [],
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting resume by ID:', error);
    throw new Error('Failed to retrieve resume');
  }
}

/**
 * DEPRECATED: Use getAllUserResumes() instead
 * Get a user's saved resume from Firestore (returns default resume)
 * @param userId - The user's UID
 * @returns UserResume object or null if no resume exists
 */
export async function getUserResume(userId: string): Promise<UserResume | null> {
  return getDefaultResume(userId);
}

/**
 * Delete a specific resume version
 * @param userId - The user's UID
 * @param resumeId - The resume ID to delete
 */
export async function deleteResumeVersion(userId: string, resumeId: string): Promise<void> {
  try {
    const resume = await getResumeById(userId, resumeId);

    if (!resume) {
      throw new Error('Resume not found');
    }

    // If this is the default resume, unset default first
    if (resume.isDefault) {
      const allResumes = await getAllUserResumes(userId);
      // Set another resume as default if available
      const otherResume = allResumes.find(r => r.id !== resumeId);
      if (otherResume) {
        await setDefaultResume(userId, otherResume.id);
      }
    }

    // Delete from Storage
    try {
      const storageRef = ref(storage, resume.storagePath);
      await deleteObject(storageRef);
      console.log('Resume deleted from Storage');
    } catch (storageError) {
      console.error('Error deleting from storage:', storageError);
      // Continue even if storage deletion fails
    }

    // Delete from Firestore
    const resumeRef = doc(db, "users", userId, "resumes", resumeId);
    await deleteDoc(resumeRef);

    console.log('Resume version deleted from Firestore');
  } catch (error) {
    console.error('Error deleting resume version:', error);
    throw new Error('Failed to delete resume');
  }
}

/**
 * DEPRECATED: Use deleteResumeVersion() instead
 * Delete a user's resume from both Firebase Storage and Firestore
 * @param userId - The user's UID
 * @param throwOnError - Whether to throw error if deletion fails
 */
export async function deleteUserResume(
  userId: string,
  throwOnError: boolean = true
): Promise<void> {
  try {
    const defaultResume = await getDefaultResume(userId);
    if (defaultResume) {
      await deleteResumeVersion(userId, defaultResume.id);
    }
  } catch (error) {
    console.error('Error deleting user resume:', error);
    if (throwOnError) {
      throw new Error('Failed to delete resume');
    }
  }
}

/**
 * Set a resume as the default
 * @param userId - The user's UID
 * @param resumeId - The resume ID to set as default
 */
export async function setDefaultResume(userId: string, resumeId: string): Promise<void> {
  try {
    const allResumes = await getAllUserResumes(userId);

    // Unset all defaults
    for (const resume of allResumes) {
      const resumeRef = doc(db, "users", userId, "resumes", resume.id);
      await updateDoc(resumeRef, { isDefault: resume.id === resumeId });
    }

    console.log(`Resume ${resumeId} set as default`);
  } catch (error) {
    console.error('Error setting default resume:', error);
    throw new Error('Failed to set default resume');
  }
}

/**
 * Update resume metadata (label, tags)
 * @param userId - The user's UID
 * @param resumeId - The resume ID
 * @param updates - Fields to update
 */
export async function updateResumeMetadata(
  userId: string,
  resumeId: string,
  updates: { label?: string; tags?: string[] }
): Promise<void> {
  try {
    const resumeRef = doc(db, "users", userId, "resumes", resumeId);
    await updateDoc(resumeRef, updates);
    console.log(`Resume ${resumeId} metadata updated`);
  } catch (error) {
    console.error('Error updating resume metadata:', error);
    throw new Error('Failed to update resume');
  }
}

/**
 * Check if a user has a resume saved
 * @param userId - The user's UID
 * @returns boolean indicating if resume exists
 */
export async function hasUserResume(userId: string): Promise<boolean> {
  try {
    const resumes = await getAllUserResumes(userId);
    return resumes.length > 0;
  } catch (error) {
    console.error('Error checking if user has resume:', error);
    return false;
  }
}
