import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToMongoDB, User } from '@/lib/models';
import Stripe from 'stripe';

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
  console.warn('Stripe subscription initialization failed:', error);
}

export async function GET(request: NextRequest) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe) {
      return NextResponse.json(
        { error: 'Subscription service not available' },
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

    await connectToMongoDB();

    // Get user with subscription details
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const subscription = user.subscription || {
      plan: 'none',
      status: 'inactive',
    };

    // If user has a Stripe customer ID, fetch live subscription data
    if (subscription.stripeCustomerId && subscription.subscriptionId) {
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.subscriptionId
        ) as Stripe.Subscription;

        const stripeCustomer = await stripe.customers.retrieve(
          subscription.stripeCustomerId
        ) as Stripe.Customer;

        return NextResponse.json({
          plan: subscription.plan,
          status: stripeSubscription.status,
          currentPeriodEnd: (stripeSubscription as any).current_period_end
            ? new Date((stripeSubscription as any).current_period_end * 1000)
            : null,
          currentPeriodStart: (stripeSubscription as any).current_period_start
            ? new Date((stripeSubscription as any).current_period_start * 1000)
            : null,
          cancelAtPeriodEnd: (stripeSubscription as any).cancel_at_period_end,
          subscriptionId: stripeSubscription.id,
          customerId: subscription.stripeCustomerId,
          defaultPaymentMethod: stripeSubscription.default_payment_method,
          nextBillingDate: (stripeSubscription as any).cancel_at_period_end
            ? null
            : new Date((stripeSubscription as any).current_period_end * 1000),
          customer: {
            email: stripeCustomer.email,
            name: stripeCustomer.name,
          },
        });
      } catch (stripeError) {
        console.error('Error fetching Stripe subscription:', stripeError);
        // Fall back to database data if Stripe API fails
      }
    }

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.currentPeriodEnd,
      subscriptionId: subscription.subscriptionId,
      customerId: subscription.stripeCustomerId,
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectToMongoDB();

    // Get user
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const subscription = user.subscription;
    if (!subscription?.subscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      );
    }

    // Cancel the subscription at period end in Stripe
    const canceledSubscription = await stripe.subscriptions.update(
      subscription.subscriptionId,
      {
        cancel_at_period_end: true,
      }
    );

    // Update user in database
    await User.findByIdAndUpdate(user._id, {
      $set: {
        'subscription.cancelAtPeriodEnd': true,
        'subscription.canceledAt': new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Subscription will be canceled at the end of the current period',
      cancelAtPeriodEnd: (canceledSubscription as any).cancel_at_period_end,
      currentPeriodEnd: (canceledSubscription as any).current_period_end
        ? new Date((canceledSubscription as any).current_period_end * 1000)
        : null,
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}