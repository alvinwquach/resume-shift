import { Ionicons } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'default';
}

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'default',
}: ConfirmDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        <View className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md">
          <View className={`w-12 h-12 rounded-full items-center justify-center mb-4 ${
            type === 'danger' ? 'bg-rose-500/20' : 'bg-blue-500/20'
          }`}>
            <Ionicons
              name={type === 'danger' ? 'alert-circle' : 'information-circle'}
              size={24}
              color={type === 'danger' ? '#fb7185' : '#3b82f6'}
            />
          </View>
          <Text className="text-white text-xl font-bold mb-2">
            {title}
          </Text>
          <Text className="text-zinc-400 text-sm leading-6 mb-6">
            {message}
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              className="flex-1 bg-zinc-800 rounded-xl py-3 items-center active:opacity-80"
            >
              <Text className="text-white font-semibold text-sm">
                {cancelText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              className={`flex-1 rounded-xl py-3 items-center active:opacity-80 ${
                type === 'danger' ? 'bg-rose-600' : 'bg-blue-600'
              }`}
            >
              <Text className="text-white font-semibold text-sm">
                {confirmText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
