import { checkoutReady, PRIVATE_FILE_KEY, shopEnv, stripeClient } from '@/lib/shop';

export const runtime = 'edge';

export async function GET() {
  const config = shopEnv();
  if (!checkoutReady(config)) return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
  try {
    const file = await config.PRIVATE_FILES.get(PRIVATE_FILE_KEY, 'stream');
    if (!file) return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
    const price = await stripeClient(config.STRIPE_SECRET_KEY!).prices.retrieve(config.STRIPE_PRICE_ID!);
    if (!price.active || price.type !== 'one_time' || price.unit_amount === null || price.currency !== 'usd') {
      return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json({ available: true, price: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price.unit_amount / 100) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load shop product', error);
    return Response.json({ available: false }, { headers: { 'Cache-Control': 'no-store' } });
  }
}
