import type { Metadata } from 'next';
import { Source_Sans_3 } from 'next/font/google';
import './globals.css';
import '@uploadthing/react/styles.css';
import SessionProvider from '@/components/providers/SessionProvider';

const sourceSans = Source_Sans_3({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: {
    template: '%s | Weekend Will - Create Your Legal Will Online',
    default: 'Weekend Will - Create Your Legal Will Online in Minutes'
  },
  description: 'Create a legally valid will online with attorney-reviewed templates. State-compliant, secure, and easy. Protect your family today.',
  keywords: ['online will', 'estate planning', 'legal will', 'create will online', 'last will and testament'],
  authors: [{ name: 'Weekend Will Legal Team' }],
  creator: 'Weekend Will',
  publisher: 'Weekend Will',
  metadataBase: new URL('https://weekendwill.com'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://weekendwill.com',
    title: 'Weekend Will - Create Your Legal Will Online',
    description: 'Create a legally valid will online with attorney-reviewed templates. State-compliant, secure, and easy.',
    siteName: 'Weekend Will',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Weekend Will - Create Your Legal Will Online',
    description: 'Create a legally valid will online with attorney-reviewed templates. State-compliant, secure, and easy.',
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${sourceSans.className} h-full antialiased`}>
        <SessionProvider>
          <div id="root" className="min-h-full">
            {children}
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}