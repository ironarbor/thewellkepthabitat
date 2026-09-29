import { availableProduct, checkoutKeyMatchesOrigin, checkoutReady, confirmStripeAccount, SHOP_PRODUCTS, shopEnv, stripeClient, type ShopProductSlug } from '@/lib/shop';

export const runtime = 'edge';

export async function GET(request: Request) {
  const config = shopEnv();
  const unavailable = () => Response.json({ available: false, products: {} }, { headers: { 'Cache-Control': 'no-store' } });
  if (!checkoutReady(config) || !checkoutKeyMatchesOrigin(config, request.url)) return unavailable();
  try {
    const stripe = stripeClient(config.STRIPE_SECRET_KEY!);
    if (!await confirmStripeAccount(stripe, config)) return unavailable();
    const products = Object.fromEntries(await Promise.all(
      (Object.keys(SHOP_PRODUCTS) as ShopProductSlug[]).map(async slug => {
        try { return [slug, { available: await availableProduct(stripe, config, slug), price: '$4.00' }] as const; }
        catch (error) { console.error(`Unable to load ${slug}`, error); return [slug, { available: false }] as const; }
      }),
    ));
    return Response.json({ available: products['visit-to-the-hyssop'].available, price: '$4.00', products }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Unable to load shop product', error);
    return unavailable();
  }
}
