import Stripe from 'stripe';

// Initialize Stripe
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Pricing plans configuration
export const PRICING_PLANS = {
  essential: {
    name: 'Essential Will Package',
    description: 'Perfect for individuals with straightforward estate planning needs',
    price: '$39',
    priceId: process.env.STRIPE_ESSENTIAL_PRICE_ID || 'price_essential_one_time',
    stripePriceId: process.env.STRIPE_ESSENTIAL_PRICE_ID || 'price_essential_one_time',
    features: [
      'Comprehensive last will and testament',
      'Executor and guardian selection',
      'Asset distribution planning',
      'Digital asset management',
      'State-compliant legal documents',
      'Secure document storage',
      'Email support',
      '1 year of access',
    ],
    legalCompliance: [
      'Valid in all 50 states',
      'Attorney-reviewed templates',
      'Meets state legal requirements',
    ],
    highlighted: false,
    type: 'one-time' as const,
  },
  unlimited: {
    name: 'Unlimited Will Package',
    description: 'For families who want comprehensive estate planning with ongoing support',
    price: '$89',
    priceId: process.env.STRIPE_UNLIMITED_PRICE_ID || 'price_unlimited_one_time',
    stripePriceId: process.env.STRIPE_UNLIMITED_PRICE_ID || 'price_unlimited_one_time',
    features: [
      'Everything in Essential Package',
      'Unlimited will updates',
      'Advanced trust planning',
      'Power of attorney documents',
      'Healthcare directives',
      'Family protection guide',
      'Priority phone support',
      'Lifetime access',
      'Beneficiary notifications',
      'Document change tracking',
    ],
    legalCompliance: [
      'Valid in all 50 states',
      'Attorney-reviewed templates',
      'Meets state legal requirements',
      'Regular legal updates included',
    ],
    highlighted: true,
    type: 'one-time' as const,
  },
} as const;

export type PlanKey = keyof typeof PRICING_PLANS;

// Utility functions
export const getPricingPlan = (planKey: PlanKey) => {
  return PRICING_PLANS[planKey];
};

export const getAllPricingPlans = () => {
  return Object.values(PRICING_PLANS);
};

export const getPriceIdForPlan = (planKey: PlanKey): string => {
  return PRICING_PLANS[planKey].priceId;
};

// Customer utilities
export const createOrRetrieveCustomer = async (
  email: string,
  name: string,
  userId: string
): Promise<string> => {
  try {
    // First, try to find existing customer by email
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      return existingCustomers.data[0].id;
    }

    // Create new customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        userId,
      },
    });

    return customer.id;
  } catch (error) {
    console.error('Error creating/retrieving customer:', error);
    throw error;
  }
};

// Subscription utilities
export const getSubscriptionStatus = async (subscriptionId: string) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return {
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      priceId: subscription.items.data[0]?.price.id,
    };
  } catch (error) {
    console.error('Error retrieving subscription:', error);
    throw error;
  }
};

// Checkout utilities
export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string,
  metadata: Record<string, string> = {}
) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment for will creation
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      tax_id_collection: {
        enabled: true,
      },
      automatic_tax: {
        enabled: true,
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
      payment_intent_data: {
        metadata,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Portal utilities
export const createPortalSession = async (
  customerId: string,
  returnUrl: string
) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
};

// Webhook utilities
export const constructWebhookEvent = (
  payload: string,
  signature: string,
  secret: string
) => {
  try {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error('Error constructing webhook event:', error);
    throw error;
  }
};

// Invoice utilities
export const retrieveInvoice = async (invoiceId: string) => {
  try {
    return await stripe.invoices.retrieve(invoiceId);
  } catch (error) {
    console.error('Error retrieving invoice:', error);
    throw error;
  }
};

// Payment method utilities
export const getPaymentMethods = async (customerId: string) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  } catch (error) {
    console.error('Error retrieving payment methods:', error);
    throw error;
  }
};

// Price utilities
export const getPrice = async (priceId: string) => {
  try {
    return await stripe.prices.retrieve(priceId);
  } catch (error) {
    console.error('Error retrieving price:', error);
    throw error;
  }
};

// Format currency utility
export const formatCurrency = (amount: number, currency = 'usd') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Stripe amounts are in cents
};

// Validate webhook signature
export const validateWebhookSignature = (
  payload: string,
  signature: string,
  secret: string
): boolean => {
  try {
    stripe.webhooks.constructEvent(payload, signature, secret);
    return true;
  } catch {
    return false;
  }
};