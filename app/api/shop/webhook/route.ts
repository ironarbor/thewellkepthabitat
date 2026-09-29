import Stripe from 'stripe';
import { fulfillPaidSession, shopEnv, stripeClient } from '@/lib/shop';

export const runtime = 'edge';

export async function POST(request: Request) {
  const config = shopEnv();
  const signature = request.headers.get('stripe-signature');
  if (!signature || !config.STRIPE_WEBHOOK_SECRET || !config.STRIPE_SECRET_KEY || !config.SHOP_DB) {
    return new Response('Webhook unavailable', { status: 503 });
  }

  let event: Stripe.Event;
  try {
    event = await stripeClient(config.STRIPE_SECRET_KEY).webhooks.constructEventAsync(
      await request.text(), signature, config.STRIPE_WEBHOOK_SECRET, undefined,
      Stripe.createSubtleCryptoProvider(),
    );
  } catch {
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      await fulfillPaidSession(event.data.object as Stripe.Checkout.Session, config);
    } else if (event.type === 'checkout.session.async_payment_failed') {
      // A failed delayed payment never creates a paid order or grants access.
      console.info('Artwork checkout payment failed');
    } else if (event.type === 'charge.refunded') {
      const charge = event.data.object as Stripe.Charge;
      const intent = typeof charge.payment_intent === 'string' ? charge.payment_intent : charge.payment_intent?.id;
      if (intent) await config.SHOP_DB.prepare(
        'UPDATE shop_orders SET refunded_at = CURRENT_TIMESTAMP WHERE stripe_payment_intent_id = ?1',
      ).bind(intent).run();
    }
    return new Response('ok');
  } catch (error) {
    console.error('Unable to fulfill shop order', error);
    return new Response('Fulfillment unavailable', { status: 500 });
  }
}
