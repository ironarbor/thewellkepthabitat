import { checkoutReady, confirmStripeAccount, PRIVATE_FILE_KEY, PRODUCT_PRICE_CENTS, shopEnv, stripeClient } from '@/lib/shop';

export const runtime = 'edge';

export async function GET() {
  const config = shopEnv();
  if (!checkoutReady(config)) return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
  try {
    const file = await config.PRIVATE_FILES.get(PRIVATE_FILE_KEY, 'stream');
    if (!file) return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
    const stripe = stripeClient(config.STRIPE_SECRET_KEY!);
    if (!await confirmStripeAccount(stripe, config)) return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
    const price = await stripe.prices.retrieve(config.STRIPE_PRICE_ID!);
    if (!price.active || price.type !== 'one_time' || price.unit_amount !== PRODUCT_PRICE_CENTS || price.currency !== 'usd' || price.tax_behavior !== 'exclusive') {
      return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json({ available: true, price: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price.unit_amount / 100) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load shop product', error);
    return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
