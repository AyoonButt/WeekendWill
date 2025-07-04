import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { Card, Button } from '@/components/ui';
import { DashboardPageContainer } from '@/components/layout';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payment Successful',
  description: 'Your payment has been processed successfully.',
};

export default async function PaymentSuccessPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/login');
  }

  return (
    <DashboardPageContainer>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="text-center p-12">
          <CheckCircleIcon className="w-24 h-24 text-success-600 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-charcoal-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-lg text-charcoal-600 mb-8">
            Thank you for your purchase. Your plan has been activated and you can now 
            start creating your will or access all the features included in your plan.
          </p>

          <div className="bg-success-50 border border-success-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-success-800 mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-success-700 space-y-2 text-left">
              <li>• You&apos;ll receive a confirmation email with your receipt</li>
              <li>• Your account has been upgraded with your selected plan features</li>
              <li>• You can start creating your will immediately</li>
              <li>• Access to customer support for any questions</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button variant="primary" size="lg">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/documents">
              <Button variant="outline" size="lg">
                Start Creating Will
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </DashboardPageContainer>
  );
}