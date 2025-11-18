import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUserResume, saveUserResume, deleteUserResume, UserResume } from '../services/resumeService';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { FUNCTIONS_ENDPOINTS } from '../services/functionsConfig';

export function useUserResume(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['resume', userId],
    queryFn: async () => {
      if (!userId) return null;
      return await getUserResume(userId);
    },
    enabled: !!userId,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: DocumentPicker.DocumentPickerAsset }) => {
      console.log('Starting resume upload process...', file.name);

      // Step 1: Get file as blob
      let fileBlob: Blob;
      if (Platform.OS === 'web') {
        const response = await fetch(file.uri);
        fileBlob = await response.blob();
      } else {
        const base64 = await FileSystem.readAsStringAsync(file.uri, {
          encoding: 'base64',
        });
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        fileBlob = new Blob([byteArray], { type: file.mimeType || 'application/octet-stream' });
      }

      console.log('File blob created, size:', fileBlob.size);

      // Step 2: Convert blob to base64 for extraction
      console.log('Converting blob to base64 for text extraction...');
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(fileBlob);
      const fileData = await base64Promise;

      console.log('Base64 created, length:', fileData.length);

      // Step 3: Extract text via serverless function
      console.log('Extracting text from resume...');
      const extractResponse = await fetch(FUNCTIONS_ENDPOINTS.EXTRACT_RESUME, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileData,
          fileName: file.name,
          mimeType: file.mimeType,
        }),
      });

      if (!extractResponse.ok) {
        const errorData = await extractResponse.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to extract text from file");
      }

      const extractData = await extractResponse.json();
      const extractedText = extractData.text;

      console.log('Text extracted, length:', extractedText?.length);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("File appears to be empty");
      }

      // Step 4: Save resume to Firebase Storage
      console.log('Saving resume with metadata to permanent storage...');
      const savedResume = await saveUserResume(
        userId,
        fileBlob,
        file.name,
        extractedText,
        file.size,
        file.mimeType || undefined
      );

      return { resume: savedResume, userId };
    },
    onSuccess: async ({ resume, userId }) => {
      console.log('[useUserResume] Upload successful, updating cache for userId:', userId);
      queryClient.setQueryData(['resume', userId], resume);
      await queryClient.invalidateQueries({ queryKey: ['resume', userId] });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Your resume has been uploaded and saved!',
      });
    },
    onError: (error: Error) => {
      console.error("Error uploading resume:", error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: error.message || 'Failed to upload resume. Please try again.',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (userId: string) => {
      await deleteUserResume(userId);
    },
    onSuccess: async (_, userId) => {
      console.log('[useUserResume] Delete successful, updating cache for userId:', userId);
      queryClient.setQueryData(['resume', userId], null);
      await queryClient.invalidateQueries({ queryKey: ['resume', userId] });
      Toast.show({
        type: 'success',
        text1: 'Deleted',
        text2: 'Resume deleted successfully',
      });
    },
    onError: (error: Error) => {
      console.error("Error deleting resume:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete resume',
      });
    },
  });

  return {
    resume: query.data,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    uploadResume: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    deleteResume: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    refetch: query.refetch,
  };
}
