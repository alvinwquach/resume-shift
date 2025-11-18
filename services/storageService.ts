import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * Upload a resume file to Firebase Storage
 * @param userId - The user's UID
 * @param file - The file blob/buffer to upload
 * @param fileName - Original file name
 * @returns Download URL of the uploaded file
 */
export async function uploadResumeToStorage(
  userId: string,
  file: Blob | Uint8Array,
  fileName: string
): Promise<string> {
  try {
    // Create a unique file path
    const timestamp = Date.now();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `resumes/${userId}/${timestamp}_${sanitizedFileName}`;

    // Create storage reference
    const storageRef = ref(storage, filePath);

    console.log('Uploading file to Firebase Storage:', filePath);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    console.log('Upload successful, getting download URL...');

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log('Download URL obtained:', downloadURL);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw new Error('Failed to upload file to storage');
  }
}

/**
 * Delete a resume file from Firebase Storage
 * @param fileUrl - The download URL of the file to delete
 */
export async function deleteResumeFromStorage(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    console.log('File deleted from storage');
  } catch (error) {
    console.error('Error deleting file from storage:', error);
    // Don't throw error - deletion failure is not critical
  }
}
