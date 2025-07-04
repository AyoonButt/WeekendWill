import type { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: 'About Weekend Will - Our Mission & Story',
  description: 'Learn about Weekend Will\'s mission to make estate planning accessible, affordable, and easy for everyone. Discover our story and commitment to protecting families.',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'About Weekend Will - Making Estate Planning Simple',
    description: 'Learn about Weekend Will\'s mission to make estate planning accessible and affordable for everyone.',
    type: 'website',
  },
};

// Enable static generation for better performance
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export default AboutPage;