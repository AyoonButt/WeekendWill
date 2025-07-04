import type { Metadata } from 'next';
import HomePage from './HomePage';

export const metadata: Metadata = {
  title: 'Create Your Legal Will Online in Minutes - Weekend Will',
  description: 'Create a legally valid will online with attorney-reviewed templates. State-compliant, secure, and easy. Protect your family today with Weekend Will.',
  keywords: [
    'online will',
    'create will online',
    'legal will',
    'estate planning',
    'last will and testament',
    'attorney reviewed will',
    'state compliant will',
    'will maker',
    'estate plan',
    'legal documents'
  ],
  openGraph: {
    title: 'Create Your Legal Will Online in Minutes - Weekend Will',
    description: 'Create a legally valid will online with attorney-reviewed templates. State-compliant, secure, and easy.',
    type: 'website',
    siteName: 'Weekend Will',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Weekend Will - Create Your Legal Will Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your Legal Will Online in Minutes - Weekend Will',
    description: 'Create a legally valid will online with attorney-reviewed templates. State-compliant, secure, and easy.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://weekendwill.com',
  },
};

export default HomePage;