import { ResumeAnalysisResult } from './analysis';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
  analysisResult?: Partial<ResumeAnalysisResult>;
  jobTitle?: string;
  jobCompany?: string;
}
