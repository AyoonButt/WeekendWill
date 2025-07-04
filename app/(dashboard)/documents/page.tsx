'use client';

import React from 'react';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, Button } from '@/components/ui';
import { DashboardPageContainer } from '@/components/layout';
import { 
  DocumentTextIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import DocumentsList from './DocumentsList';

export default async function DocumentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <DashboardPageContainer>
      <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-900 mb-2">
          My Documents
        </h1>
        <p className="text-charcoal-600">
          Access and manage your legal documents, will drafts, and related files.
        </p>
      </div>

      {/* Document Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <DocumentTextIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900">Will Draft</h3>
                <p className="text-blue-700">In Progress</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-lg mr-4">
                <ClockIcon className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-amber-900">Review Pending</h3>
                <p className="text-amber-700">3 Items</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Completed</h3>
                <p className="text-green-700">0 Documents</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Documents List */}
      <div className="grid gap-6">
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-charcoal-900">
                Your Documents
              </h2>
              <Button variant="outline" size="sm">
                <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                Download All
              </Button>
            </div>
          </div>
          <Card.Content>
            <DocumentsList userId={session.user.id} />
          </Card.Content>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-charcoal-900">
              Quick Actions
            </h2>
          </div>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <PencilIcon className="w-6 h-6 text-primary-600" />
                <span>Continue Will</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <EyeIcon className="w-6 h-6 text-primary-600" />
                <span>Preview Will</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-24 flex flex-col items-center justify-center space-y-2"
              >
                <ArrowDownTrayIcon className="w-6 h-6 text-primary-600" />
                <span>Download PDF</span>
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Legal Notice */}
        <Card className="bg-amber-50 border-amber-200">
          <div className="p-6">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">
                  Important Legal Notice
                </h3>
                <p className="text-amber-800 text-sm leading-relaxed">
                  These documents are legally binding once properly executed according to your state&apos;s laws. 
                  Please ensure all required signatures and witnesses are present before considering your will complete. 
                  We recommend consulting with a qualified attorney for complex estates or special circumstances.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
      </div>
    </DashboardPageContainer>
  );
}