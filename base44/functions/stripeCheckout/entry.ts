import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';
import Stripe from 'npm:stripe@14.21.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
    const body = await req.json();
    const { action, items, total, currency = 'sar', successUrl, cancelUrl, planId, planName, planPrice, storeData } = body;

    // ─── Checkout for shoppers ───────────────────────────────────────────────
    if (action === 'create_checkout') {
      const lineItems = items.map(item => ({
        price_data: {
          currency,
          product_data: {
            name: typeof item.product_name === 'object'
              ? (item.product_name?.ar || item.product_name?.en || 'منتج')
              : (item.product_name || 'منتج'),
            images: item.product_image ? [item.product_image] : [],
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: successUrl || `${req.headers.get('origin')}/orders?payment=success`,
        cancel_url: cancelUrl || `${req.headers.get('origin')}/checkout?payment=cancelled`,
        customer_email: user.email,
        metadata: {
          user_email: user.email,
          type: 'shopper_order',
        },
      });

      return Response.json({ url: session.url, session_id: session.id });
    }

    // ─── Subscription payment for sellers ────────────────────────────────────
    if (action === 'create_subscription_checkout') {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency,
            product_data: {
              name: `اشتراك باقة ${planName} - R Souq`,
              description: `فتح متجر على منصة R Souq - باقة ${planName}`,
            },
            unit_amount: Math.round(planPrice * 100),
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: successUrl || `${req.headers.get('origin')}/seller/dashboard?payment=success&plan=${planId}`,
        cancel_url: cancelUrl || `${req.headers.get('origin')}/seller/register?payment=cancelled`,
        customer_email: user.email,
        metadata: {
          user_email: user.email,
          plan_id: planId,
          plan_name: planName,
          plan_price: String(planPrice),
          store_name: storeData?.store_name || '',
          type: 'seller_subscription',
        },
      });

      return Response.json({ url: session.url, session_id: session.id });
    }

    // ─── Verify payment session ───────────────────────────────────────────────
    if (action === 'verify_session') {
      const { session_id } = body;
      const session = await stripe.checkout.sessions.retrieve(session_id);
      return Response.json({
        status: session.payment_status,
        metadata: session.metadata,
        amount_total: session.amount_total,
        currency: session.currency,
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});