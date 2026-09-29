import { checkoutKeyMatchesOrigin, checkoutReady, confirmStripeAccount, PRIVATE_FILE_KEY, PRODUCT_PRICE_CENTS, PRODUCT_SLUG, shopEnv, siteUrl, stripeClient } from '@/lib/shop';

export const runtime = 'edge';

export async function POST(request: Request) {
  const config = shopEnv();
  if (!checkoutReady(config) || !checkoutKeyMatchesOrigin(config, request.url)) return Response.json({ error: 'This artwork is not on sale yet.' }, { status: 503 });
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Invalid request.' }, { status: 403 });

  let input: { product?: unknown };
  try { input = await request.json() as { product?: unknown }; }
  catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  if (input.product !== PRODUCT_SLUG) return Response.json({ error: 'Unknown artwork.' }, { status: 400 });

  try {
    const file = await config.PRIVATE_FILES.get(PRIVATE_FILE_KEY, 'stream');
    if (!file) return Response.json({ error: 'This artwork is temporarily unavailable.' }, { status: 503 });
    const stripe = stripeClient(config.STRIPE_SECRET_KEY!);
    if (!await confirmStripeAccount(stripe, config)) return Response.json({ error: 'This artwork is temporarily unavailable.' }, { status: 503 });
    const price = await stripe.prices.retrieve(config.STRIPE_PRICE_ID!);
    if (!price.active || price.type !== 'one_time' || price.unit_amount !== PRODUCT_PRICE_CENTS || price.currency !== 'usd' || price.tax_behavior !== 'exclusive') {
      return Response.json({ error: 'This artwork is temporarily unavailable.' }, { status: 503 });
    }
    const letters = Array.from(crypto.getRandomValues(new Uint8Array(8)), n => String.fromCharCode(97 + n % 26)).join('');
    const shopBaseUrl = new URL(request.url).origin;
    const shopHost = new URL(shopBaseUrl).hostname;
    if (!['thewellkepthabitat.com', 'www.thewellkepthabitat.com'].includes(shopHost) && !shopHost.endsWith('.workers.dev')) {
      return Response.json({ error: 'Invalid shop address.' }, { status: 403 });
    }
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: config.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: siteUrl('/shop/thank-you?session_id={CHECKOUT_SESSION_ID}', shopBaseUrl),
      cancel_url: siteUrl('/shop', shopBaseUrl),
      metadata: { product: PRODUCT_SLUG, shop_base_url: shopBaseUrl },
      integration_identifier: `twkh-artwork-${letters}`,
    });
    if (!session.url) throw new Error('Stripe did not provide a checkout URL');
    return Response.json({ url: session.url }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to start artwork checkout', error);
    return Response.json({ error: 'Checkout is temporarily unavailable.' }, { status: 503 });
  }
}
