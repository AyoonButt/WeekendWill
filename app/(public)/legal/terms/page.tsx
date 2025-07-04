import { Metadata } from 'next';
import { Card } from '@/components/ui';
import { PublicPageContainer } from '@/components/layout';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our terms of service for using Weekend Will\'s estate planning platform.',
  robots: 'index, follow',
};

export default function TermsOfServicePage() {
  return (
    <PublicPageContainer>
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <DocumentTextIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-charcoal-900 mb-4">
            Terms of Service
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
                  Agreement to Terms
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  By accessing and using Weekend Will (&ldquo;the Service&rdquo;), you accept and agree to be bound by the terms 
                  and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibent text-charcoal-900 mb-4">
                  Description of Service
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  Weekend Will provides an online platform for creating legal documents, including last wills and testaments. 
                  Our service includes:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>Guided interview process for document creation</li>
                  <li>Attorney-reviewed document templates</li>
                  <li>State-specific legal compliance</li>
                  <li>Document storage and retrieval</li>
                  <li>Customer support services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Legal Disclaimer
                </h2>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                  <p className="text-amber-800 font-medium mb-2">
                    Important Legal Notice
                  </p>
                  <p className="text-amber-700 leading-relaxed">
                    Weekend Will is not a law firm and does not provide legal advice. The information provided by our service 
                    is not a substitute for the advice of an attorney. We recommend consulting with a qualified attorney for 
                    complex legal matters or if you have specific questions about your situation.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  User Responsibilities
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  By using our service, you agree to:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>Provide accurate and complete information</li>
                  <li>Be at least 18 years of age</li>
                  <li>Be of sound mind and legal capacity</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the service only for lawful purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Account Registration and Security
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  To use certain features of our service, you must register for an account. You are responsible for:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>Maintaining the security of your account and password</li>
                  <li>All activities that occur under your account</li>
                  <li>Immediately notifying us of any unauthorized use</li>
                  <li>Ensuring your contact information is current</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Payment Terms
                </h2>
                <h3 className="text-xl font-medium text-charcoal-900 mb-3">
                  Pricing
                </h3>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  Our current pricing is available on our pricing page. Prices are subject to change with notice.
                </p>
                
                <h3 className="text-xl font-medium text-charcoal-900 mb-3">
                  Payment Processing
                </h3>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  Payments are processed securely through third-party payment processors. You authorize us to charge 
                  your chosen payment method for all fees incurred.
                </p>

                <h3 className="text-xl font-medium text-charcoal-900 mb-3">
                  Refund Policy
                </h3>
                <p className="text-charcoal-700 leading-relaxed">
                  We offer a 60-day money-back guarantee. If you&apos;re not satisfied with your purchase, 
                  contact us within 60 days for a full refund.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Intellectual Property
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  The Weekend Will service, including all content, features, and functionality, is owned by Weekend Will 
                  and is protected by copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-charcoal-700 leading-relaxed">
                  You retain ownership of the content you create using our service, including your will and personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Prohibited Uses
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  You may not use our service:
                </p>
                <ul className="list-disc pl-6 mb-6 text-charcoal-700 space-y-2">
                  <li>For any unlawful purpose or to solicit others to unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations or laws</li>
                  <li>To transmit or procure the sending of any advertising or promotional material</li>
                  <li>To impersonate or attempt to impersonate another person</li>
                  <li>To harm minors or attempt to harm minors</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Data and Privacy
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                  to understand our practices regarding the collection and use of your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Limitation of Liability
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  To the maximum extent permitted by applicable law, Weekend Will shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, or any loss of profits or revenues.
                </p>
                <p className="text-charcoal-700 leading-relaxed">
                  Our total liability to you for all damages shall not exceed the amount paid by you to us for the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Indemnification
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless Weekend Will from and against any claims, damages, 
                  obligations, losses, liabilities, costs, or debt arising from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Termination
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice, 
                  for any reason, including breach of these Terms.
                </p>
                <p className="text-charcoal-700 leading-relaxed">
                  You may terminate your account at any time by contacting us or through your account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Changes to Terms
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes 
                  by posting the new Terms of Service on this page and updating the &ldquo;Last updated&rdquo; date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Governing Law
                </h2>
                <p className="text-charcoal-700 leading-relaxed">
                  These Terms shall be interpreted and governed by the laws of the State of California, without regard 
                  to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Contact Information
                </h2>
                <p className="text-charcoal-700 leading-relaxed mb-4">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-charcoal-700">
                    <strong>Email:</strong> legal@weekendwill.com<br />
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