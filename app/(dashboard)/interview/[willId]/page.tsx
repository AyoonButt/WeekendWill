import type { Metadata } from 'next';
import InterviewPage from './InterviewPage';

export const metadata: Metadata = {
  title: 'Create Your Will - Interview | Weekend Will',
  description: 'Answer simple questions to create your legal will. Guided interview process takes just 15 minutes.',
  robots: {
    index: false,
    follow: false,
  },
};

export default InterviewPage;