export interface Project {
  id: string;
  title: string;
  description: string;
  techStack?: string[];
  duration?: string;
  impact?: string;
  url?: string;
}

export interface RoleRanking {
  role: string;
  marketabilityScore: number; // 1-10
  recommendation: 'keep' | 'enhance' | 'drop';
  fitSummary: string;
  appropriateLevel: 'junior' | 'mid' | 'senior' | 'staff+';
  levelReasoning: string;
  technicalComplexity: {
    score: number;
    reasoning: string;
  };
  businessImpact: {
    score: number;
    reasoning: string;
  };
  marketRelevance: {
    score: number;
    reasoning: string;
  };
  strengths: string[];
  weaknesses: string[];
  enhancementSuggestions: {
    suggestion: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }[];
  redFlags: string[];
  positioningAdvice: string;
}

export interface ProjectRankingResult {
  projectName: string;
  projectType: string;
  overallSummary: string;
  hasAIComponents: boolean;
  roleRankings: RoleRanking[];
  bestFitRoles: string[];
  comparableProjects: string[];
  universalRedFlags: string[];
}

export interface RankedProject extends Project {
  rankingResult?: ProjectRankingResult;
  isRanking?: boolean;
  error?: string;
}

export interface SavedProjectRanking {
  id: string;
  userId: string;
  projects: RankedProject[];
  targetRole?: string;
  candidateLevel?: string;
  createdAt: Date;
}
