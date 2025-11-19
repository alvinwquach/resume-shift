export interface Feature {
  icon: any;
  title: string;
  description: string;
  bgColor: string;
}

export const features: Feature[] = [
  {
    icon: 'chatbubble-ellipses',
    title: 'AI Chat Interface',
    description: 'Simply paste a job URL or description into the chat. Our AI instantly analyzes your resume and provides real-time feedback.',
    bgColor: 'bg-blue-500/15'
  },
  {
    icon: 'git-branch',
    title: 'Version Management',
    description: 'Manage multiple resume versions and track which performs best across different job applications.',
    bgColor: 'bg-purple-500/15'
  },
  {
    icon: 'analytics',
    title: 'Analytics Dashboard',
    description: 'Track your application performance with detailed analytics, trends, and actionable insights over time.',
    bgColor: 'bg-green-500/15'
  },
  {
    icon: 'trophy',
    title: 'Instant Fit Scores',
    description: 'Get quantified compatibility scores with personalized suggestions to improve your match for each position.',
    bgColor: 'bg-orange-500/15'
  }
];
