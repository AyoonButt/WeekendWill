import type { Metadata } from 'next';
import HowItWorksPage from './HowItWorksPage';

export const metadata: Metadata = {
  title: 'How It Works - Simple Will Creation Process | Weekend Will',
  description: 'Learn how to create your legal will in 3 easy steps. Simple guided process, attorney-reviewed templates, and instant download.',
  keywords: [
    'how to create a will',
    'will creation process',
    'online will steps',
    'estate planning process',
    'legal will guide',
    'will maker tutorial'
  ],
  openGraph: {
    title: 'How It Works - Simple Will Creation Process | Weekend Will',
    description: 'Learn how to create your legal will in 3 easy steps.',
    type: 'website',
    siteName: 'Weekend Will',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How It Works - Simple Will Creation Process | Weekend Will',
    description: 'Learn how to create your legal will in 3 easy steps.',
  },
  alternates: {
    canonical: 'https://weekendwill.com/how-it-works',
  },
};

export default HowItWorksPage;