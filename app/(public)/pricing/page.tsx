import type { Metadata } from 'next';
import PricingPage from './PricingPage';

export const metadata: Metadata = {
  title: 'Pricing Plans - Affordable Will Creation | Weekend Will',
  description: 'Choose the perfect plan for your estate planning needs. Essential and Unlimited plans with attorney-reviewed templates and state compliance.',
  keywords: [
    'will pricing',
    'estate planning cost',
    'affordable will',
    'online will price',
    'legal will cost',
    'will maker pricing',
    'estate plan pricing'
  ],
  openGraph: {
    title: 'Pricing Plans - Affordable Will Creation | Weekend Will',
    description: 'Choose the perfect plan for your estate planning needs. Starting at just $39.',
    type: 'website',
    siteName: 'Weekend Will',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing Plans - Affordable Will Creation | Weekend Will',
    description: 'Choose the perfect plan for your estate planning needs. Starting at just $39.',
  },
  alternates: {
    canonical: 'https://weekendwill.com/pricing',
  },
};

export default PricingPage;