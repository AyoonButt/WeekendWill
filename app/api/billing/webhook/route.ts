import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { connectToMongoDB, User } from '@/lib/models';

// Initialize Stripe with error handling for build time
let stripe: Stripe;
let endpointSecret: string;
try {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is required');
  }
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is required');
  }
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-06-30.basil',
  });
  endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
} catch (error) {
  console.warn('Stripe webhook initialization failed:', error);
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is properly initialized
    if (!stripe || !endpointSecret) {
      return NextResponse.json(
        { error: 'Webhook service not available' },
        { status: 503 }
      );
    }

    const body = await request.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    await connectToMongoDB();

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;

    // Map Stripe price IDs to plan names
    const planMapping: Record<string, string> = {
      'price_essential_monthly': 'essential',
      'price_essential_yearly': 'essential',
      'price_unlimited_monthly': 'unlimited',
      'price_unlimited_yearly': 'unlimited',
    };

    const plan = planMapping[priceId] || 'essential';

    await User.findOneAndUpdate(
      { 'subscription.stripeCustomerId': customerId },
      {
        $set: {
          'subscription.plan': plan,
          'subscription.status': subscription.status === 'active' ? 'active' : 'inactive',
          'subscription.subscriptionId': subscription.id,
          'subscription.currentPeriodEnd': (subscription as any).current_period_end
            ? new Date((subscription as any).current_period_end * 1000)
            : null,
          'subscription.cancelAtPeriodEnd': (subscription as any).cancel_at_period_end ?? false,
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Subscription updated for customer ${customerId}: ${plan} - ${subscription.status}`);
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    const customerId = subscription.customer as string;

    await User.findOneAndUpdate(
      { 'subscription.stripeCustomerId': customerId },
      {
        $set: {
          'subscription.status': 'cancelled',
          'subscription.canceledAt': new Date(),
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Subscription cancelled for customer ${customerId}`);
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;
    const subscriptionId = typeof (invoice as any).subscription === 'string' ? (invoice as any).subscription : undefined;

    await User.findOneAndUpdate(
      { 'subscription.stripeCustomerId': customerId },
      {
        $set: {
          'subscription.status': 'active',
          'subscription.lastPaymentDate': new Date(invoice.status_transitions.paid_at! * 1000),
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Payment succeeded for customer ${customerId}, subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  try {
    const customerId = invoice.customer as string;

    await User.findOneAndUpdate(
      { 'subscription.stripeCustomerId': customerId },
      {
        $set: {
          'subscription.status': 'past_due',
          'subscription.lastFailedPayment': new Date(),
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Payment failed for customer ${customerId}`);
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handleCustomerCreated(customer: Stripe.Customer) {
  try {
    if (customer.email) {
      await User.findOneAndUpdate(
        { email: customer.email.toLowerCase() },
        {
          $set: {
            'subscription.stripeCustomerId': customer.id,
            updatedAt: new Date(),
          },
        }
      );

      console.log(`Customer created and linked: ${customer.id} - ${customer.email}`);
    }
  } catch (error) {
    console.error('Error handling customer creation:', error);
  }
}