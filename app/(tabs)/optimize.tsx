import { useState } from "react";
import { Text, View, TouchableOpacity, ScrollView, Platform, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useAuth } from "../../hooks/useAuth";

export default function OptimizePage() {
  const { user } = useAuth();
  const [jobLink, setJobLink] = useState("");
  const [resumeFile, setResumeFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const handleUploadResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setResumeFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const handleAnalyze = () => {
    if (!resumeFile || !jobLink) {
      alert("Please upload a resume and paste a job link");
      return;
    }
    console.log("Analyzing resume:", resumeFile.name, "for job:", jobLink);
  };

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="px-6 pt-16" style={{ paddingBottom: Platform.OS === "web" ? 100 : 80 }}>
        <View className="mb-8">
          <Text className="text-white text-3xl font-bold mb-2">
            Optimize Resume
          </Text>
          <Text className="text-zinc-400 text-base">
            Upload your resume and job link to optimize your fit
          </Text>
        </View>
        <View className="mb-6">
          <Text className="text-white text-base font-semibold mb-3">
            Resume
          </Text>
          <TouchableOpacity
            onPress={handleUploadResume}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 items-center active:opacity-80"
          >
            {resumeFile ? (
              <View className="items-center">
                <Ionicons name="document-text" size={32} color="#22c55e" />
                <Text className="text-green-500 text-base font-medium mt-2">
                  {resumeFile.name}
                </Text>
                <Text className="text-zinc-500 text-sm mt-1">
                  Tap to change
                </Text>
              </View>
            ) : (
              <View className="items-center">
                <Ionicons name="cloud-upload-outline" size={32} color="#71717a" />
                <Text className="text-white text-base font-medium mt-2">
                  Upload Resume
                </Text>
                <Text className="text-zinc-500 text-sm mt-1">
                  PDF, DOC, or DOCX
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mb-6">
          <Text className="text-white text-base font-semibold mb-3">
            Job Link
          </Text>
          <View className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden">
            <TextInput
              className="text-white text-base px-4 py-4"
              placeholder="Paste job posting URL here..."
              placeholderTextColor="#71717a"
              value={jobLink}
              onChangeText={setJobLink}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={handleAnalyze}
          className={`rounded-xl px-6 py-4 active:opacity-80 ${
            resumeFile && jobLink ? "bg-white" : "bg-zinc-800"
          }`}
          disabled={!resumeFile || !jobLink}
        >
          <Text className={`font-semibold text-base text-center ${
            resumeFile && jobLink ? "text-black" : "text-zinc-600"
          }`}>
            Analyze Resume
          </Text>
        </TouchableOpacity>
        <View className="mt-8 bg-zinc-950 border border-zinc-900 rounded-xl p-4">
          <View className="flex-row items-start mb-3">
            <Ionicons name="information-circle" size={20} color="#71717a" />
            <Text className="text-zinc-400 text-sm ml-2 flex-1">
              Upload your resume and paste a job posting URL to get an AI-powered compatibility analysis
            </Text>
          </View>
          <View className="flex-row items-start">
            <Ionicons name="shield-checkmark" size={20} color="#71717a" />
            <Text className="text-zinc-400 text-sm ml-2 flex-1">
              Your data is encrypted and never shared with third parties
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
