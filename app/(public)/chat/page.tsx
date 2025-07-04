'use client';

import { Card } from '@/components/ui';
import { EnhancedPublicLayout } from '@/components/layout';
import { 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserIcon 
} from '@heroicons/react/24/outline';

export default function ChatPage() {
  return (
    <EnhancedPublicLayout>
      {/* Header Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ChatBubbleLeftRightIcon className="w-16 h-16 text-primary-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-charcoal-900 mb-4">
              Live Chat Support
            </h1>
            <p className="text-xl text-charcoal-600 max-w-2xl mx-auto">
              Connect with our estate planning experts for real-time assistance with your will creation questions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Chat Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-green-50 border-green-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <UserIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-900">Support Available</h3>
                  <p className="text-green-700">Our team is online now</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <ClockIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Average Response</h3>
                  <p className="text-blue-700">Under 2 minutes</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Chat Interface Placeholder */}
        <Card>
          <div className="p-8 text-center">
            <ChatBubbleLeftRightIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-charcoal-900 mb-4">
              Live Chat Coming Soon
            </h2>
            <p className="text-charcoal-600 mb-6 max-w-2xl mx-auto">
              We&apos;re working on bringing you a seamless live chat experience. 
              In the meantime, you can reach us through the contact methods below.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <a
                href="tel:1-800-WEEKEND"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Call Now
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-charcoal-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Send Message
              </a>
            </div>
          </div>
        </Card>

        {/* Help Topics */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-charcoal-900 mb-6 text-center">
            Common Chat Topics
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-charcoal-900 mb-2">
                  Will Creation Help
                </h3>
                <p className="text-charcoal-600 text-sm">
                  Get assistance with the will creation process and interview questions.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-charcoal-900 mb-2">
                  Legal Requirements
                </h3>
                <p className="text-charcoal-600 text-sm">
                  Learn about state-specific legal requirements and execution steps.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-charcoal-900 mb-2">
                  Account Support
                </h3>
                <p className="text-charcoal-600 text-sm">
                  Get help with your account, billing, or subscription questions.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-charcoal-900 mb-2">
                  Document Access
                </h3>
                <p className="text-charcoal-600 text-sm">
                  Assistance with downloading, printing, or updating your documents.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-charcoal-900 mb-2">
                  Technical Issues
                </h3>
                <p className="text-charcoal-600 text-sm">
                  Resolve technical problems or browser compatibility issues.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="font-semibold text-charcoal-900 mb-2">
                  General Questions
                </h3>
                <p className="text-charcoal-600 text-sm">
                  Ask any other questions about our service or estate planning.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <Card className="bg-blue-50 border-blue-200">
            <div className="p-6 text-center">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Alternative Contact Methods
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-blue-800">Phone Support</h4>
                  <p className="text-blue-700">1-800-WEEKEND</p>
                  <p className="text-blue-600">Mon-Fri, 9 AM - 6 PM EST</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Email Support</h4>
                  <p className="text-blue-700">support@weekendwill.com</p>
                  <p className="text-blue-600">Response within 24 hours</p>
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Contact Form</h4>
                  <p className="text-blue-700">Detailed inquiries</p>
                  <p className="text-blue-600">Priority support available</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </EnhancedPublicLayout>
  );
}