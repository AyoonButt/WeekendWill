'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { 
  DocumentTextIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  UserGroupIcon,
  BanknotesIcon,
  HomeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Button, Card } from '@/components/ui';
import { DocumentGrid, SimpleProgressSteps, SecurityInfo } from '@/components/estate-planning';
import { DashboardPageContainer } from '@/components/layout';
import { useToast } from '@/components/ui/Toast';

const DashboardPage: React.FC = () => {
  const { data: session } = useSession();
  const { showSuccess, showError } = useToast();
  const [wills, setWills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [stats, setStats] = useState({
    totalWills: 0,
    completedWills: 0,
    draftWills: 0,
  });

  const loadUserData = useCallback(async () => {
    if (!session?.user?.id) return;
    
    try {
      // Create user if needed (deferred from auth)
      if ((session as any).needsUserCreation) {
        await fetch('/api/auth/create-user', { method: 'POST' });
      }
      
      // Load wills data optimized query
      const response = await fetch('/api/will/list');
      const userWills = response.ok ? await response.json() : [];

      setWills(userWills);
      setStats({
        totalWills: userWills.length,
        completedWills: userWills.filter((w: any) => w.status === 'completed').length,
        draftWills: userWills.filter((w: any) => w.status === 'draft').length,
      });
      setDataLoaded(true);
    } catch (error) {
      console.error('Error loading user data:', error);
      showError('Error loading data', 'Please try refreshing the page');
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, showError]);

  useEffect(() => {
    if (session?.user?.id && !dataLoaded) {
      // Use requestIdleCallback for non-blocking loading
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadUserData());
      } else {
        setTimeout(loadUserData, 0);
      }
    }
  }, [session?.user?.id, dataLoaded, loadUserData]);

  const handleCreateNewWill = () => {
    // In real implementation, this would create a new will and redirect to interview
    window.location.href = '/interview/new';
  };

  const quickActions = [
    {
      title: 'Start a New Will',
      description: 'Create a legally valid will in 15 minutes',
      icon: DocumentTextIcon,
      action: handleCreateNewWill,
      primary: true
    },
    {
      title: 'Update Family Info',
      description: 'Add new family members or update details',
      icon: UserGroupIcon,
      action: () => showSuccess('Feature coming soon', 'Family updates will be available in the next release'),
      primary: false
    },
    {
      title: 'Review Assets',
      description: 'Add new assets or update valuations',
      icon: BanknotesIcon,
      action: () => showSuccess('Feature coming soon', 'Asset management will be available in the next release'),
      primary: false
    },
    {
      title: 'Property Manager',
      description: 'Manage real estate and properties',
      icon: HomeIcon,
      action: () => showSuccess('Feature coming soon', 'Property management will be available in the next release'),
      primary: false
    }
  ];

  const recentActivity = [
    {
      action: 'Will created',
      description: 'Started creating your first will',
      time: '2 hours ago',
      icon: DocumentTextIcon,
      status: 'in-progress'
    },
    {
      action: 'Account created',
      description: 'Welcome to Weekend Will!',
      time: '1 day ago',
      icon: CheckCircleIcon,
      status: 'completed'
    }
  ];

  if (isLoading) {
    return (
      <DashboardPageContainer>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardPageContainer>
    );
  }

  return (
    <DashboardPageContainer>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-primary-600 to-teal-600 rounded-xl p-8 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {session?.user?.name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="text-primary-100 text-lg">
                Let&apos;s continue protecting your family&apos;s future.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleCreateNewWill}
                className="bg-white text-primary-600 hover:bg-gray-50"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create New Will
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <DocumentTextIcon className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal-900">{stats.totalWills}</p>
                <p className="text-sm text-charcoal-600">Total Wills</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
                <CheckCircleIcon className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal-900">{stats.completedWills}</p>
                <p className="text-sm text-charcoal-600">Completed</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mr-4">
                <ClockIcon className="w-6 h-6 text-gold-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-charcoal-900">{stats.draftWills}</p>
                <p className="text-sm text-charcoal-600">In Progress</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Documents */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-charcoal-900">Your Documents</h2>
                <Button variant="outline" onClick={handleCreateNewWill}>
                  <PlusIcon className="w-4 h-4 mr-2" />
                  New Will
                </Button>
              </div>

              {wills.length > 0 ? (
                <DocumentGrid documents={wills} />
              ) : (
                <Card className="p-12 text-center">
                  <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-charcoal-900 mb-2">
                    No wills created yet
                  </h3>
                  <p className="text-charcoal-600 mb-6">
                    Start creating your first will to protect your family and assets.
                  </p>
                  <Button variant="primary" onClick={handleCreateNewWill}>
                    Create Your First Will
                  </Button>
                </Card>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-2xl font-bold text-charcoal-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Card 
                      key={index} 
                      className={`p-6 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        action.primary ? 'border-primary-200 bg-primary-50' : ''
                      }`}
                      onClick={action.action}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          action.primary ? 'bg-primary-600' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            action.primary ? 'text-white' : 'text-charcoal-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-charcoal-900 mb-1">
                            {action.title}
                          </h3>
                          <p className="text-sm text-charcoal-600">
                            {action.description}
                          </p>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-charcoal-400" />
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            {stats.draftWills > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-charcoal-900 mb-4">
                  Continue Your Will
                </h3>
                <SimpleProgressSteps current={2} total={5} className="mb-4" />
                <p className="text-sm text-charcoal-600 mb-4">
                  You&apos;re making great progress! Complete your will to ensure your family is protected.
                </p>
                <Button variant="primary" size="sm" className="w-full">
                  Continue Will
                </Button>
              </Card>
            )}

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="font-semibold text-charcoal-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => {
                  const Icon = activity.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'completed' ? 'bg-success-100' : 'bg-gold-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          activity.status === 'completed' ? 'text-success-600' : 'text-gold-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-charcoal-900">
                          {activity.action}
                        </p>
                        <p className="text-xs text-charcoal-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-charcoal-500 mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Security Info */}
            <SecurityInfo />

            {/* Help */}
            <Card className="p-6 bg-gradient-to-br from-teal-50 to-primary-50">
              <h3 className="font-semibold text-charcoal-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-charcoal-600 mb-4">
                Our support team is here to help you with any questions.
              </p>
              <div className="space-y-2">
                <Link href="/help">
                  <Button variant="outline" size="sm" className="w-full">
                    Help Center
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" className="w-full">
                  Live Chat
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardPageContainer>
  );
};

export default DashboardPage;