import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession, createOrRetrieveCustomer } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { priceId, planName } = await request.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Create or retrieve Stripe customer
    const customerId = await createOrRetrieveCustomer(
      session.user.email!,
      session.user.name || session.user.email!,
      session.user.id
    );

    // Create checkout session
    const checkoutSession = await createCheckoutSession(
      customerId,
      priceId,
      `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      `${process.env.NEXTAUTH_URL}/dashboard?payment=cancelled`,
      {
        userId: session.user.id,
        planName: planName || 'Unknown Plan',
        customerEmail: session.user.email!,
      }
    );

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });

  } catch (error) {
    console.error('Checkout session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}