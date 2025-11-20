import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useState } from 'react';
import { getAllUserResumes, UserResume } from '../services/resumeService';
import { Message } from '../types/message';

export function useResumeLoader(
  userId: string | undefined,
  selectedResumeId: string | null,
  messagesLength: number
) {
  const [resumeFile, setResumeFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [resumeFileName, setResumeFileName] = useState("");
  const [allResumes, setAllResumes] = useState<UserResume[]>([]);
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadSavedResume = useCallback(async () => {
    if (!userId) {
      setIsLoadingResume(false);
      return;
    }

    try {
      console.log('Loading saved resumes for user:', userId);
      const resumes = await getAllUserResumes(userId);
      setAllResumes(resumes);

      if (resumes.length > 0) {
        const resumeToUse = selectedResumeId
          ? resumes.find(r => r.id === selectedResumeId)
          : resumes.find(r => r.isDefault) || resumes[0];

        if (resumeToUse) {
          console.log('Found resume:', resumeToUse.fileName);
          setResumeText(resumeToUse.extractedText);
          setResumeFileName(resumeToUse.fileName);
          setResumeFile({
            name: resumeToUse.fileName,
            uri: resumeToUse.fileUrl,
            mimeType: resumeToUse.mimeType,
            size: resumeToUse.fileSize,
          } as DocumentPicker.DocumentPickerAsset);

          if (messagesLength === 0 || (messagesLength === 1 && messages[0]?.role === 'assistant')) {
            const resumeLabel = resumeToUse.label || resumeToUse.fileName;
            const multipleResumesHint = resumes.length > 1
              ? `\n\n💡 You have ${resumes.length} resume versions. Select a resume below to switch between them.`
              : '';
            setMessages([{
              id: '1',
              role: 'assistant',
              content: `Hi! I'm your resume optimization assistant.\n\nI've loaded your resume: **${resumeLabel}**${multipleResumesHint}\n\nPaste a job posting URL below to analyze how well your resume matches!`,
              timestamp: new Date(),
            }]);
          }
        }
      } else {
        console.log('No saved resume found');
        if (messagesLength === 0 || (messagesLength === 1 && messages[0]?.role === 'assistant')) {
          setMessages([{
            id: '1',
            role: 'assistant',
            content: "Hi! I'm your resume optimization assistant.\n\nIt looks like you haven't uploaded a resume yet. Please go to the Dashboard tab to upload your resume first, then come back here to analyze job postings!",
            timestamp: new Date(),
          }]);
        }
      }
    } catch (error) {
      console.error("Error loading saved resume:", error);
      if (messagesLength === 0 || (messagesLength === 1 && messages[0]?.role === 'assistant')) {
        setMessages([{
          id: '1',
          role: 'assistant',
          content: "Hi! I'm your resume optimization assistant.\n\nPlease upload your resume on the Dashboard tab to get started.",
          timestamp: new Date(),
        }]);
      }
    } finally {
      setIsLoadingResume(false);
    }
  }, [userId, messagesLength, selectedResumeId]);

  return {
    resumeFile,
    resumeText,
    resumeFileName,
    allResumes,
    isLoadingResume,
    messages,
    setMessages,
    loadSavedResume,
  };
}
