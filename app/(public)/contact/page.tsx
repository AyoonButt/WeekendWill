import { Metadata } from 'next';
import { Card } from '@/components/ui';
import { PublicPageContainer } from '@/components/layout';
import { 
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with our estate planning experts. We\'re here to help with your will creation questions.',
  openGraph: {
    title: 'Contact Us - Weekend Will',
    description: 'Get in touch with our estate planning experts. We\'re here to help with your will creation questions.',
  },
};

// Enable static generation for better performance
export const dynamic = 'force-static';
export const revalidate = 3600;

export default function ContactPage() {
  return (
    <PublicPageContainer>
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-charcoal-900 mb-4">
              Contact Our Estate Planning Experts
            </h1>
            <p className="text-xl text-charcoal-600 max-w-3xl mx-auto">
              Have questions about creating your will? Our team is here to help guide you through 
              the process and ensure your wishes are properly documented.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-charcoal-900 mb-6">
                    Get in Touch
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <EnvelopeIcon className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-charcoal-900">Email</h3>
                        <p className="text-charcoal-600">support@weekendwill.com</p>
                        <p className="text-sm text-charcoal-500 mt-1">
                          We respond within 24 hours
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <PhoneIcon className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-charcoal-900">Phone</h3>
                        <p className="text-charcoal-600">1-800-WEEKEND</p>
                        <p className="text-sm text-charcoal-500 mt-1">
                          Mon-Fri, 9 AM - 6 PM EST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-charcoal-900">Live Chat</h3>
                        <p className="text-charcoal-600">Available on our website</p>
                        <p className="text-sm text-charcoal-500 mt-1">
                          Mon-Fri, 9 AM - 6 PM EST
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPinIcon className="w-6 h-6 text-primary-600 mr-3 mt-1" />
                      <div>
                        <h3 className="font-medium text-charcoal-900">Address</h3>
                        <p className="text-charcoal-600">
                          655 May St<br />
                          Fort Worth, TX 76104
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                    Business Hours
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-charcoal-600">Monday - Friday</span>
                      <span className="text-charcoal-900">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-600">Saturday</span>
                      <span className="text-charcoal-900">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-600">Sunday</span>
                      <span className="text-charcoal-900">Closed</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <ClockIcon className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="text-sm text-blue-800">
                        Emergency support available 24/7 for urgent legal matters
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-charcoal-600 mb-4">
                    Before reaching out, check our comprehensive FAQ section for quick answers 
                    to common questions about will creation and estate planning.
                  </p>
                  <a
                    href="/faqs"
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-charcoal-700 bg-white hover:bg-gray-50 transition-colors w-full"
                  >
                    View FAQs
                  </a>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-charcoal-900">
                  Send us a Message
                </h2>
                <p className="text-charcoal-600 mt-2">
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>
              </div>
              <div className="px-6 py-4">
                <ContactForm />
              </div>
            </Card>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-12">
          <Card>
            <div className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
                  Need Immediate Assistance?
                </h2>
                <p className="text-charcoal-600 mb-6 max-w-2xl mx-auto">
                  If you have urgent questions about your will or need to make immediate changes, 
                  our priority support team is available to help.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <a
                    href="tel:1-800-WEEKEND"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors w-full"
                  >
                    <PhoneIcon className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                  <a
                    href="/chat"
                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-charcoal-700 bg-white hover:bg-gray-50 transition-colors w-full"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Live Chat
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PublicPageContainer>
  );
}