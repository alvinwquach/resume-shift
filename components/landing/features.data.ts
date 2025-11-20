export interface Feature {
  icon: any;
  title: string;
  description: string;
  bgColor: string;
}

export const features: Feature[] = [
  {
    icon: 'chatbubble-ellipses',
    title: 'Resume Analysis Agent',
    description: 'Paste a job posting and get instant AI analysis. Identifies skill gaps, suggests projects to build, and shows how your experience fits across multiple tech roles.',
    bgColor: 'bg-blue-500/15'
  },
  {
    icon: 'analytics-outline',
    title: 'Project Ranking Agent',
    description: 'Submit your projects and get AI rankings across Frontend, Backend, AI/LLM, Data roles. See which 2-4 projects are strong enough for your resume with KEEP/ENHANCE/DROP recommendations.',
    bgColor: 'bg-purple-500/15'
  },
  {
    icon: 'layers-outline',
    title: 'Multi-Role Analysis',
    description: 'Your skills (SQL, Python, etc.) are analyzed for multiple roles at once. See how you fit as Data Analyst, Data Engineer, Backend Engineer, and more from a single analysis.',
    bgColor: 'bg-green-500/15'
  },
  {
    icon: 'construct-outline',
    title: 'Project Recommendations',
    description: 'Get personalized suggestions for projects to build based on your skill gaps. Each suggestion includes expected impact on your resume and effort level.',
    bgColor: 'bg-orange-500/15'
  },
  {
    icon: 'stats-chart',
    title: 'Performance Dashboard',
    description: 'Track your resume versions, view historical analyses, and see which projects rank highest. Save and compare results over time as you improve.',
    bgColor: 'bg-pink-500/15'
  }
];
