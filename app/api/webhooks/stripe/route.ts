import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { constructWebhookEvent } from '@/lib/stripe';
import { dbService } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = constructWebhookEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        const planName = session.metadata?.planName;

        if (userId && planName) {
          // Update user's subscription in database
          await dbService.updateSubscription(userId, {
            stripeCustomerId: session.customer,
            stripePriceId: session.metadata?.priceId,
            planName: planName,
            status: 'active',
            paymentStatus: 'paid',
            purchaseDate: new Date(),
            amount: session.amount_total,
            currency: session.currency,
          });

          console.log(`Payment completed for user ${userId}, plan: ${planName}`);
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          // Update payment status
          await dbService.updateUser(userId, {
            lastPaymentDate: new Date(),
            paymentStatus: 'paid',
          });

          console.log(`Payment succeeded for user ${userId}`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const userId = paymentIntent.metadata?.userId;

        if (userId) {
          // Update payment status
          await dbService.updateUser(userId, {
            paymentStatus: 'failed',
          });

          console.log(`Payment failed for user ${userId}`);
        }
        break;
      }

      case 'customer.created': {
        const customer = event.data.object;
        const userId = customer.metadata?.userId;

        if (userId) {
          // Update user with Stripe customer ID
          await dbService.updateUser(userId, {
            stripeCustomerId: customer.id,
          });

          console.log(`Stripe customer created for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}