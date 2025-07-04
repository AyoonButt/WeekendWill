import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { Card, Button, Input } from '@/components/ui';
import { DashboardPageContainer } from '@/components/layout';
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import AccountSettings from './AccountSettings';

export const metadata: Metadata = {
  title: 'Account Settings',
  description: 'Manage your account settings, profile information, and security preferences.',
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <DashboardPageContainer>
      <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal-900 mb-2">
          Account Settings
        </h1>
        <p className="text-charcoal-600">
          Manage your profile information, security settings, and preferences.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Profile Information */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <UserIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-charcoal-900">
                Profile Information
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <AccountSettings 
              user={session.user}
              section="profile"
            />
          </div>
        </Card>

        {/* Email & Communications */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <EnvelopeIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-charcoal-900">
                Email & Communications
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <AccountSettings 
              user={session.user}
              section="communications"
            />
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-charcoal-900">
                Security & Privacy
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <AccountSettings 
              user={session.user}
              section="security"
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <BellIcon className="w-5 h-5 text-primary-600 mr-2" />
              <h2 className="text-xl font-semibold text-charcoal-900">
                Notification Preferences
              </h2>
            </div>
          </div>
          <div className="px-6 py-4">
            <AccountSettings 
              user={session.user}
              section="notifications"
            />
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-red-800">
              Danger Zone
            </h2>
            <p className="text-sm text-red-600 mt-1">
              These actions cannot be undone. Please proceed with caution.
            </p>
          </div>
          <div className="px-6 py-4">
            <AccountSettings 
              user={session.user}
              section="danger"
            />
          </div>
        </Card>
      </div>
      </div>
    </DashboardPageContainer>
  );
}