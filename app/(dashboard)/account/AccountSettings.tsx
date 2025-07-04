'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@/components/ui';
import { 
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/Toast';

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const notificationSchema = z.object({
  emailUpdates: z.boolean(),
  securityAlerts: z.boolean(),
  marketingEmails: z.boolean(),
  documentReminders: z.boolean(),
});

interface AccountSettingsProps {
  user: any;
  section: 'profile' | 'communications' | 'security' | 'notifications' | 'danger';
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, section }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { showSuccess, showError } = useToast();

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      email: user?.email || '',
      phone: user?.profile?.phone || '',
    },
  });

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Notification form
  const notificationForm = useForm({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailUpdates: true,
      securityAlerts: true,
      marketingEmails: false,
      documentReminders: true,
    },
  });

  const handleProfileUpdate = async (data: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put('/user/profile', data);
      if (response.success) {
        showSuccess(
          'Profile Updated',
          'Your profile information has been updated successfully.'
        );
      }
    } catch (error) {
      console.error('Profile update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (data: z.infer<typeof passwordSchema>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put('/user/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.success) {
        showSuccess(
          'Password Updated',
          'Your password has been changed successfully.'
        );
        passwordForm.reset();
      }
    } catch (error) {
      console.error('Password change failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationUpdate = async (data: z.infer<typeof notificationSchema>) => {
    setIsLoading(true);
    try {
      const response = await apiClient.put('/user/notifications', data);
      if (response.success) {
        showSuccess(
          'Preferences Updated',
          'Your notification preferences have been saved.'
        );
      }
    } catch (error) {
      console.error('Notification update failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeactivation = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      setIsLoading(true);
      try {
        const response = await apiClient.delete('/user/account');
        if (response.success) {
          showError(
            'Account Deactivated',
            'Your account has been deactivated.'
          );
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Account deactivation failed:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (section === 'profile') {
    return (
      <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              First Name
            </label>
            <Input
              {...profileForm.register('firstName')}
              error={profileForm.formState.errors.firstName?.message}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Last Name
            </label>
            <Input
              {...profileForm.register('lastName')}
              error={profileForm.formState.errors.lastName?.message}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Email Address
          </label>
          <Input
            type="email"
            {...profileForm.register('email')}
            error={profileForm.formState.errors.email?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal-700 mb-2">
            Phone Number (Optional)
          </label>
          <Input
            type="tel"
            {...profileForm.register('phone')}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
          >
            Update Profile
          </Button>
        </div>
      </form>
    );
  }

  if (section === 'security') {
    return (
      <div className="space-y-8">
        <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-6">
          <h3 className="text-lg font-medium text-charcoal-900">Change Password</h3>
          
          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                {...passwordForm.register('currentPassword')}
                error={passwordForm.formState.errors.currentPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? 'text' : 'password'}
                {...passwordForm.register('newPassword')}
                error={passwordForm.formState.errors.newPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showNewPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                {...passwordForm.register('confirmPassword')}
                error={passwordForm.formState.errors.confirmPassword?.message}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Change Password
            </Button>
          </div>
        </form>

        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-charcoal-900 mb-4">Two-Factor Authentication</h3>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExclamationTriangleIcon className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Two-Factor Authentication</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Enhance your account security by enabling two-factor authentication. This feature will be available soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'notifications') {
    return (
      <form onSubmit={notificationForm.handleSubmit(handleNotificationUpdate)} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-charcoal-900">Email Updates</h4>
              <p className="text-sm text-charcoal-600">Receive updates about your will and account</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...notificationForm.register('emailUpdates')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-charcoal-900">Security Alerts</h4>
              <p className="text-sm text-charcoal-600">Important security notifications (recommended)</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...notificationForm.register('securityAlerts')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-charcoal-900">Document Reminders</h4>
              <p className="text-sm text-charcoal-600">Reminders to update your will periodically</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...notificationForm.register('documentReminders')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-charcoal-900">Marketing Emails</h4>
              <p className="text-sm text-charcoal-600">Product updates and special offers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...notificationForm.register('marketingEmails')}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isLoading}
            loading={isLoading}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    );
  }

  if (section === 'communications') {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800">Email Verified</h4>
              <p className="text-sm text-green-700 mt-1">
                Your email address {user.email} is verified and active.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-charcoal-900 mb-4">Communication Preferences</h3>
          <p className="text-charcoal-600 mb-4">
            We&apos;ll use your email address to send important updates about your account and legal documents.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Email Delivery</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Account security notifications</li>
              <li>• Document completion reminders</li>
              <li>• Legal compliance updates</li>
              <li>• Billing and subscription notices</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  if (section === 'danger') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-red-800 mb-4">Deactivate Account</h3>
          <p className="text-charcoal-600 mb-6">
            Deactivating your account will permanently delete all your data, including your will documents. 
            This action cannot be undone.
          </p>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-red-800 mb-2">What happens when you deactivate:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• All will documents and drafts will be permanently deleted</li>
              <li>• Your account data will be removed from our systems</li>
              <li>• Active subscriptions will be cancelled</li>
              <li>• You will lose access to all premium features</li>
            </ul>
          </div>

          <Button
            variant="outline"
            onClick={handleAccountDeactivation}
            disabled={isLoading}
            loading={isLoading}
          >
            Deactivate Account
          </Button>
        </div>
      </div>
    );
  }

  return null;
};

export default AccountSettings;