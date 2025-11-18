import { View, Text, TouchableOpacity, ActivityIndicator, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import { ConfirmDialog } from '../ConfirmDialog';
import { UserResume } from '../../services/resumeService';

interface ResumeUploadSectionProps {
  resume: UserResume | null | undefined;
  isUploading: boolean;
  onUpload: (variables: { userId: string; file: DocumentPicker.DocumentPickerAsset }) => void;
  onDelete: (userId: string) => void;
  userId: string;
}

export function ResumeUploadSection({
  resume,
  isUploading,
  onUpload,
  onDelete,
  userId
}: ResumeUploadSectionProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUploadResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["text/plain", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onUpload({ userId, file });
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Toast.show({
        type: 'error',
        text1: 'Upload Failed',
        text2: 'Failed to pick document. Please try again.',
      });
    }
  };

  const handleDeleteResume = () => {
    console.log('[ResumeUploadSection] Delete button clicked');
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    console.log('[ResumeUploadSection] Delete confirmed, calling onDelete');
    setShowDeleteConfirm(false);
    onDelete(userId);
  };

  const handleViewResume = () => {
    if (!resume?.fileUrl) return;

    console.log('[ResumeUploadSection] Opening resume:', resume.fileUrl);

    if (Platform.OS === 'web') {
      window.open(resume.fileUrl, '_blank');
    } else {
      Linking.openURL(resume.fileUrl);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <View className="mb-6">
      {resume ? (
        <View>
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-1">
              <Text className="text-white text-base font-semibold mb-1">
                Upload your resume
              </Text>
              <Text className="text-zinc-500 text-xs">
                File types: DOC, DOCX, TXT
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-white text-sm mb-1">
                {resume.fileName}
              </Text>
              <TouchableOpacity onPress={handleViewResume}>
                <Text className="text-blue-400 text-xs">View your resume</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleUploadResume}
            disabled={isUploading}
            className="bg-transparent border-2 border-dashed border-zinc-800 rounded-xl p-8 mb-3 active:opacity-80"
          >
            <View className="items-center">
              <View className="mb-3">
                <Ionicons name="document-text" size={48} color="#3b82f6" />
              </View>
              <Text className="text-white text-sm mb-1">
                {resume.fileName}
              </Text>
              <TouchableOpacity onPress={(e) => {
                e.stopPropagation();
                handleViewResume();
              }}>
                <Text className="text-blue-400 text-xs">( preview )</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('[ResumeUploadSection] Remove resume pressed');
              handleDeleteResume();
            }}
            className="active:opacity-70"
          >
            <Text className="text-zinc-400 text-sm">Remove your resume</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <View className="mb-3">
            <Text className="text-white text-base font-semibold mb-1">
              Upload your resume
            </Text>
            <Text className="text-zinc-500 text-xs">
              File types: DOC, DOCX, TXT
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleUploadResume}
            disabled={isUploading}
            className="bg-transparent border-2 border-dashed border-zinc-800 rounded-xl p-12 active:opacity-80"
          >
            {isUploading ? (
              <View className="items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-zinc-400 text-sm mt-4">Processing your resume...</Text>
              </View>
            ) : (
              <View className="items-center">
                <View className="mb-4">
                  <Ionicons name="document-text" size={48} color="#3b82f6" />
                </View>
                <Text className="text-blue-400 text-sm font-medium">Upload new file</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}

      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Resume"
        message="Are you sure you want to delete your resume? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </View>
  );
}
