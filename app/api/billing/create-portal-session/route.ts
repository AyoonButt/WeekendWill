import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Stripe from 'stripe';
import { connectToMongoDB, User } from '@/lib/models';

// Initialize Stripe with error handling for build time
let stripe: Stripe;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
  });
} catch (error) {
  console.warn('Stripe portal initialization failed:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      return NextResponse.json(
        { error: 'Portal service not available' },
        { status: 503 }
      );
    }

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { returnUrl } = await request.json();

    await connectToMongoDB();

    // Get user from database
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      return NextResponse.json(
        { error: 'No billing account found' },
        { status: 400 }
      );
    }

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXTAUTH_URL}/dashboard`,
    });

    return NextResponse.json({
      url: portalSession.url,
    });

  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}