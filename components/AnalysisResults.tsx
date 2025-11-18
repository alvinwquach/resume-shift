import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ResumeAnalysisResult } from "../types/analysis";
import { useState } from "react";
import { CompatibilityScoreBar } from "./CompatibilityScoreBar";
import { SectionHeader } from "./SectionHeader";
import { ListItem } from "./ListItem";
import { SkillMatchItem } from "./SkillMatchItem";
import { ExperienceGapCard } from "./ExperienceGapCard";
import { ProjectRecommendationCard } from "./ProjectRecommendationCard";
import { KeywordRecommendationCard } from "./KeywordRecommendationCard";

interface AnalysisResultsProps {
  result: Partial<ResumeAnalysisResult>;
  userEmail?: string;
  jobTitle?: string;
  jobCompany?: string;
  resumeFileName?: string;
}

export function AnalysisResults({ result, userEmail, jobTitle, jobCompany, resumeFileName }: AnalysisResultsProps) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleEmailSummary = async () => {
    if (!userEmail) {
      Alert.alert('Error', 'Please log in to email your analysis summary');
      return;
    }

    console.log('Sending email to:', userEmail);
    console.log('Job info:', { jobTitle, jobCompany, resumeFileName });

    setIsSendingEmail(true);
    try {
      console.log('Calling /api/send-email endpoint...');
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          jobTitle,
          jobCompany,
          resumeFileName,
          analysisResult: result,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        Alert.alert(
          'Email Sent!',
          `Your analysis summary has been sent to ${userEmail}`,
          [{ text: 'OK' }]
        );
      } else {
        console.error('Email API error:', data);
        throw new Error(data.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Email error:', error);
      Alert.alert(
        'Error',
        'Failed to send email. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <View className="w-full">
      {result.compatibilityScore !== undefined && (
        <CompatibilityScoreBar score={result.compatibilityScore} />
      )}
      {result.competitivePositioning && (
        <View className="mb-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="trophy" size={18} color="#eab308" />
            <Text className="text-white text-base font-semibold ml-2">
              Competitive Position
            </Text>
          </View>
          <Text className="text-zinc-300 text-sm leading-relaxed">
            {result.competitivePositioning}
          </Text>
        </View>
      )}
      {result.strengths && result.strengths.length > 0 && (
        <View className="mb-4">
          <SectionHeader icon="checkmark-circle" iconColor="#22c55e" title="Strengths" />
          {result.strengths.map((strength, index) => (
            <ListItem
              key={index}
              icon="checkmark"
              iconColor="#22c55e"
              text={strength}
            />
          ))}
        </View>
      )}
      {result.weaknesses && result.weaknesses.length > 0 && (
        <View className="mb-4">
          <SectionHeader icon="alert-circle" iconColor="#ef4444" title="Areas to Improve" />
          {result.weaknesses.map((weakness, index) => (
            <ListItem
              key={index}
              icon="close"
              iconColor="#ef4444"
              text={weakness}
            />
          ))}
        </View>
      )}
      {result.skillMatches && result.skillMatches.length > 0 && (
        <View className="mb-4">
          <SectionHeader icon="code-slash" iconColor="#3b82f6" title="Skill Analysis" />
          <View className="bg-zinc-950 border border-zinc-800 rounded-xl p-3">
            {result.skillMatches.map((skill, index) => (
              <SkillMatchItem
                key={index}
                skill={skill}
                isLast={index === result.skillMatches!.length - 1}
              />
            ))}
          </View>
        </View>
      )}
      {result.experienceGaps && result.experienceGaps.length > 0 && (
        <View className="mb-4">
          <SectionHeader icon="briefcase" iconColor="#f59e0b" title="Experience Gaps" />
          {result.experienceGaps.map((gap, index) => (
            <ExperienceGapCard key={index} gap={gap} />
          ))}
        </View>
      )}
      {result.projectRecommendations && result.projectRecommendations.length > 0 && (
        <View className="mb-4">
          <SectionHeader icon="hammer" iconColor="#10b981" title="Projects to Build" />
          {result.projectRecommendations.map((project, index) => (
            <ProjectRecommendationCard key={index} project={project} />
          ))}
        </View>
      )}
      {result.keywordRecommendations && result.keywordRecommendations.length > 0 && (
        <View className="mb-4">
          <SectionHeader icon="pricetag" iconColor="#8b5cf6" title="Keywords" />
          {result.keywordRecommendations.map((keyword, index) => (
            <KeywordRecommendationCard key={index} keyword={keyword} />
          ))}
        </View>
      )}
      {result.formattingTips && result.formattingTips.length > 0 && (
        <View className="mb-4">
          <SectionHeader icon="document-text" iconColor="#06b6d4" title="Formatting Tips" />
          {result.formattingTips.map((tip, index) => (
            <ListItem
              key={index}
              icon="bulb"
              iconColor="#06b6d4"
              text={tip}
            />
          ))}
        </View>
      )}
      {result.overallFeedback && (
        <View className="mb-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="chatbox-ellipses" size={18} color="#a78bfa" />
            <Text className="text-white text-base font-semibold ml-2">
              Overall Feedback
            </Text>
          </View>
          <Text className="text-zinc-300 text-sm leading-relaxed">
            {result.overallFeedback}
          </Text>
        </View>
      )}
      {userEmail && (
        <TouchableOpacity
          onPress={handleEmailSummary}
          disabled={isSendingEmail}
          className={`mt-2 mb-4 flex-row items-center justify-center py-3 px-4 rounded-xl border ${
            isSendingEmail
              ? 'bg-zinc-800/50 border-zinc-700'
              : 'bg-blue-600/20 border-blue-600'
          }`}
        >
          {isSendingEmail ? (
            <>
              <Ionicons name="hourglass-outline" size={18} color="#71717a" />
              <Text className="text-zinc-400 text-sm font-semibold ml-2">
                Sending...
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="mail-outline" size={18} color="#3b82f6" />
              <Text className="text-blue-400 text-sm font-semibold ml-2">
                Email Summary to {userEmail}
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
