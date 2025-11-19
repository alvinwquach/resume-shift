export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: 'Is Resume Pivot really free?',
    answer: 'Yes! Resume Pivot is completely free with unlimited usage. No credit card required, no hidden fees.'
  },
  {
    question: 'What file formats do you support?',
    answer: 'We currently support DOC, DOCX, and TXT formats. PDF support is coming soon.'
  },
  {
    question: 'How does the AI analysis work?',
    answer: 'Our AI compares your resume against job requirements, analyzing skills, experience, keywords, and more to provide detailed compatibility scores and actionable suggestions.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. Your resume data is encrypted and stored securely. We never share your information with third parties.'
  },
  {
    question: 'Can I track multiple job applications?',
    answer: 'Yes! Our analytics dashboard lets you track performance across all your applications and see which resume versions perform best.'
  },
  {
    question: 'Do you support job posting URLs from all sites?',
    answer: 'We support most major job boards including LinkedIn, Indeed, Glassdoor, and company career pages. You can also paste job descriptions directly.'
  }
];
