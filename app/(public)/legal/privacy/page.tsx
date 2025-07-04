import { Metadata } from 'next';
import { Card } from '@/components/ui';
import { PublicPageContainer } from '@/components/layout';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how Weekend Will protects your personal information and privacy.',
  robots: 'index, follow',
};

export default function PrivacyPolicyPage() {
  return (
    <PublicPageContainer>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <ShieldCheckIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-charcoal-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-charcoal-600">
            Last updated: January 1, 2024
          </p>
        </div>

        <Card>
          <Card.Content className="p-8 prose max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Introduction
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  Weekend Will (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                  use our website and services. Please read this privacy policy carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Information We Collect
                </h2>
                
                <h3 className="text-xl font-medium text-charcoal-900 mb-3">
                  Personal Information
                </h3>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  We collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>Create an account</li>
                  <li>Complete the will creation interview</li>
                  <li>Make a payment</li>
                  <li>Contact our support team</li>
                  <li>Subscribe to our newsletter</li>
                </ul>

                <p className="text-charcoal-700 leading-relaxed mb-4">
                  This information may include:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>Name, email address, and contact information</li>
                  <li>Financial information (assets, debts, beneficiaries)</li>
                  <li>Family information (spouse, children, relatives)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                  <li>Legal preferences and wishes</li>
                </ul>

                <h3 className="text-xl font-medium text-charcoal-900 mb-3">
                  Automatically Collected Information
                </h3>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  When you visit our website, we automatically collect certain information:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>IP address and geolocation data</li>
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>Usage data and analytics</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>To provide and maintain our services</li>
                  <li>To create legally valid wills and estate planning documents</li>
                  <li>To process payments and manage your account</li>
                  <li>To communicate with you about your account and our services</li>
                  <li>To provide customer support</li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                  <li>To send marketing communications (with your consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Information Sharing and Disclosure
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties, 
                  except in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li><strong>Service Providers:</strong> Trusted third parties who assist in operating our website and conducting our business</li>
                  <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Protection of Rights:</strong> To protect our rights, property, or safety, or that of our users</li>
                  <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Data Security
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  We implement appropriate technical and organizational security measures to protect your personal information:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>SSL/TLS encryption for data transmission</li>
                  <li>AES-256 encryption for data storage</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Access controls and employee training</li>
                  <li>Secure data centers with physical security measures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Your Privacy Rights
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your information in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
                <p className="text-charcoal-700 leading-relaxed">
                  To exercise these rights, please contact us at privacy@weekendwill.com.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Cookies and Tracking
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our website. 
                  You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Children&apos;s Privacy
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  Our services are not intended for individuals under 18 years of age. We do not knowingly 
                  collect personal information from children under 18.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Changes to This Privacy Policy
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material 
                  changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Contact Us
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-charcoal-700">
                    <strong>Email:</strong> privacy@weekendwill.com<br />
                    <strong>Address:</strong> 123 Legal Street, Suite 456, San Francisco, CA 94105<br />
                    <strong>Phone:</strong> 1-800-WEEKEND
                  </p>
                </div>
              </section>
            </div>
          </Card.Content>
        </Card>
      </div>
    </PublicPageContainer>
  );
}