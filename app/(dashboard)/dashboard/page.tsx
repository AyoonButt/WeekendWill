import type { Metadata } from 'next';
import DashboardPage from './DashboardPage';

export const metadata: Metadata = {
  title: 'Dashboard - Your Will & Estate Planning | Weekend Will',
  description: 'Manage your wills and estate planning documents. Track progress, make updates, and access your legal documents.',
  robots: {
    index: false,
    follow: false,
  },
};

export default DashboardPage;