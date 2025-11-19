import { View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Platform, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useUserResumes } from '../../hooks/useUserResumes';
import * as DocumentPicker from 'expo-document-picker';
import { ConfirmDialog } from '../ConfirmDialog';

interface ResumeVersionManagerProps {
  userId: string;
}

export function ResumeVersionManager({ userId }: ResumeVersionManagerProps) {
  const {
    resumes,
    defaultResume,
    isLoading,
    uploadResume,
    isUploading,
    deleteResume,
    setDefaultResume,
    updateMetadata,
  } = useUserResumes(userId);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [newTags, setNewTags] = useState('');
  const [editLabel, setEditLabel] = useState('');
  const [editTags, setEditTags] = useState('');

  const handleUploadResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const file = result.assets[0];
      const tags = newTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

      uploadResume({
        userId,
        file,
        label: newLabel || undefined,
        tags: tags.length > 0 ? tags : undefined,
      });

      setShowUploadModal(false);
      setNewLabel('');
      setNewTags('');
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleViewResume = (fileUrl: string) => {
    if (Platform.OS === 'web') {
      window.open(fileUrl, '_blank');
    } else {
      Linking.openURL(fileUrl);
    }
  };

  const handleEditResume = (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId);
    if (resume) {
      setSelectedResumeId(resumeId);
      setEditLabel(resume.label || '');
      setEditTags(resume.tags?.join(', ') || '');
      setShowEditModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (!selectedResumeId) return;

    const tags = editTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
    updateMetadata({
      userId,
      resumeId: selectedResumeId,
      label: editLabel || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    setShowEditModal(false);
    setSelectedResumeId(null);
    setEditLabel('');
    setEditTags('');
  };

  const handleDeleteClick = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedResumeId) {
      deleteResume({ userId, resumeId: selectedResumeId });
      setShowDeleteConfirm(false);
      setSelectedResumeId(null);
    }
  };

  if (isLoading) {
    return (
      <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 mb-6">
        <Text className="text-zinc-400 text-sm text-center">Loading resumes...</Text>
      </View>
    );
  }

  return (
    <>
      <View className="mb-6">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white text-lg font-semibold">Resume Versions</Text>
            <Text className="text-zinc-500 text-xs mt-1">
              Manage multiple resume versions for different roles
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowUploadModal(true)}
            className="bg-blue-600 px-4 py-2 rounded-xl flex-row items-center"
            disabled={isUploading}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text className="text-white text-sm font-medium ml-1">Add Version</Text>
          </TouchableOpacity>
        </View>
        {resumes.length === 0 ? (
          <View className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-12 items-center">
            <Ionicons name="document-text-outline" size={48} color="#52525b" />
            <Text className="text-zinc-400 text-sm text-center mt-4 mb-2">
              No resume versions yet
            </Text>
            <Text className="text-zinc-500 text-xs text-center mb-4">
              Upload your first resume to get started
            </Text>
            <TouchableOpacity
              onPress={() => setShowUploadModal(true)}
              className="bg-blue-600 px-6 py-3 rounded-xl"
            >
              <Text className="text-white font-semibold text-sm">Upload Resume</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {resumes.map((resume) => (
                <View
                  key={resume.id}
                  className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4 mr-4"
                  style={{ width: 280 }}
                >
                  <View className="flex-row items-start justify-between mb-3">
                    <View className="flex-1 mr-2">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-white text-sm font-semibold flex-1" numberOfLines={1}>
                          {resume.label || resume.fileName}
                        </Text>
                        {resume.isDefault && (
                          <View className="bg-emerald-500/20 px-2 py-0.5 rounded ml-2">
                            <Text className="text-emerald-400 text-xs font-medium">Default</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-zinc-500 text-xs" numberOfLines={1}>
                        {resume.fileName}
                      </Text>
                    </View>
                  </View>
                  {resume.tags && resume.tags.length > 0 && (
                    <View className="flex-row flex-wrap mb-3">
                      {resume.tags.map((tag, index) => (
                        <View key={index} className="bg-blue-500/10 border border-blue-500/30 rounded px-2 py-1 mr-2 mb-1">
                          <Text className="text-blue-400 text-xs">{tag}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="calendar-outline" size={12} color="#71717a" />
                    <Text className="text-zinc-500 text-xs ml-1">
                      {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                    {resume.fileSize && (
                      <>
                        <View className="w-1 h-1 rounded-full bg-zinc-700 mx-2" />
                        <Text className="text-zinc-500 text-xs">
                          {(resume.fileSize / 1024).toFixed(1)} KB
                        </Text>
                      </>
                    )}
                  </View>
                  <View className="border-t border-zinc-800/50 pt-3 mt-2">
                    <View className="flex-row mb-2">
                      <TouchableOpacity
                        onPress={() => handleViewResume(resume.fileUrl)}
                        className="flex-1 flex-row items-center justify-center bg-zinc-800/50 py-2.5 rounded-lg mr-2"
                      >
                        <Ionicons name="eye-outline" size={14} color="#a1a1aa" />
                        <Text className="text-zinc-400 text-xs font-medium ml-1.5">View</Text>
                      </TouchableOpacity>

                      {!resume.isDefault && (
                        <TouchableOpacity
                          onPress={() => setDefaultResume({ userId, resumeId: resume.id })}
                          className="flex-1 flex-row items-center justify-center bg-emerald-500/10 border border-emerald-500/20 py-2.5 rounded-lg"
                        >
                          <Ionicons name="checkmark-circle" size={14} color="#34d399" />
                          <Text className="text-emerald-400 text-xs font-medium ml-1.5">Set Default</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() => handleEditResume(resume.id)}
                        className="flex-1 flex-row items-center justify-center bg-zinc-800/50 py-2.5 rounded-lg mr-2"
                      >
                        <Ionicons name="create-outline" size={14} color="#a1a1aa" />
                        <Text className="text-zinc-400 text-xs font-medium ml-1.5">Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteClick(resume.id)}
                        className="flex-1 flex-row items-center justify-center bg-red-500/10 border border-red-500/20 py-2.5 rounded-lg"
                      >
                        <Ionicons name="trash-outline" size={14} color="#ef4444" />
                        <Text className="text-red-400 text-xs font-medium ml-1.5">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowUploadModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <Text className="text-white text-lg font-bold mb-4">Add Resume Version</Text>
            <Text className="text-zinc-400 text-sm mb-2">Label (optional)</Text>
            <TextInput
              value={newLabel}
              onChangeText={setNewLabel}
              placeholder="e.g., Software Engineer, TPM Focus"
              placeholderTextColor="#52525b"
              className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm mb-4"
              style={{ outlineStyle: 'none' } as any}
            />
            <Text className="text-zinc-400 text-sm mb-2">Tags (comma-separated, optional)</Text>
            <TextInput
              value={newTags}
              onChangeText={setNewTags}
              placeholder="e.g., TPM, Infrastructure, Platform"
              placeholderTextColor="#52525b"
              className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm mb-6"
              style={{ outlineStyle: 'none' } as any}
            />
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowUploadModal(false)}
                className="flex-1 bg-zinc-800 py-3 rounded-xl mr-2"
              >
                <Text className="text-white text-sm font-semibold text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleUploadResume}
                className="flex-1 bg-blue-600 py-3 rounded-xl ml-2"
                disabled={isUploading}
              >
                <Text className="text-white text-sm font-semibold text-center">
                  {isUploading ? 'Uploading...' : 'Choose File'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
            <Text className="text-white text-lg font-bold mb-4">Edit Resume</Text>
            <Text className="text-zinc-400 text-sm mb-2">Label</Text>
            <TextInput
              value={editLabel}
              onChangeText={setEditLabel}
              placeholder="e.g., Software Engineer, TPM Focus"
              placeholderTextColor="#52525b"
              className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm mb-4"
              style={{ outlineStyle: 'none' } as any}
            />
            <Text className="text-zinc-400 text-sm mb-2">Tags (comma-separated)</Text>
            <TextInput
              value={editTags}
              onChangeText={setEditTags}
              placeholder="e.g., TPM, Infrastructure, Platform"
              placeholderTextColor="#52525b"
              className="bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm mb-6"
              style={{ outlineStyle: 'none' } as any}
            />
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                className="flex-1 bg-zinc-800 py-3 rounded-xl mr-2"
              >
                <Text className="text-white text-sm font-semibold text-center">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveEdit}
                className="flex-1 bg-blue-600 py-3 rounded-xl ml-2"
              >
                <Text className="text-white text-sm font-semibold text-center">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ConfirmDialog
        visible={showDeleteConfirm}
        title="Delete Resume Version"
        message="Are you sure you want to delete this resume version? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        type="danger"
      />
    </>
  );
}
