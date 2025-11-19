export interface ResumeAnalysisRequest {
  resumeText: string;
  jobUrl: string;
  jobDescription: string;
}

export interface SkillMatch {
  skill: string;
  present: boolean;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

export interface ExperienceGap {
  requirement: string;
  gap: string;
  suggestion: string;
}

export interface KeywordRecommendation {
  keyword: string;
  reason: string;
  currentlyPresent: boolean;
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  skills: string[];
  impact: string;
  timeEstimate: string;
}

export interface ResumeAnalysisResult {
  compatibilityScore: number;
  strengths: string[];
  weaknesses: string[];
  skillMatches: SkillMatch[];
  experienceGaps: ExperienceGap[];
  projectRecommendations: ProjectRecommendation[];
  keywordRecommendations: KeywordRecommendation[];
  formattingTips: string[];
  overallFeedback: string;
  competitivePositioning: string;
}

export interface SavedAnalysis {
  id: string;
  userId: string;
  jobUrl: string;
  jobTitle?: string;
  companyName?: string;
  result: ResumeAnalysisResult;
  createdAt: Date;
  resumeFileName?: string;
  resumeId?: string; 
  resumeLabel?: string; 
}
