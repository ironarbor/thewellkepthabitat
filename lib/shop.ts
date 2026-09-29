import Stripe from 'stripe';
import { env } from 'cloudflare:workers';

export const PRODUCT_SLUG = 'visit-to-the-hyssop';
export const PRODUCT_PRICE_CENTS = 400;
export const TWKH_STRIPE_ACCOUNT_IDS = new Set([
  'acct_1UKfgM2fAALQO8uD', // TWKH live account and shared test mode
  'acct_1UKfjzKHupIKb8Du', // Isolated TWKH sandbox
]);
export const SHOP_PRODUCTS = {
  'visit-to-the-hyssop': {
    title: 'Bumbles Amongst the Giants',
    fileKey: 'shop/visit-to-the-hyssop-v1.zip',
    filename: 'TWKH-Bumbles-Amongst-the-Giants-Digital-Edition.zip',
    priceBinding: 'STRIPE_PRICE_ID',
  },
  'lavender-spires': {
    title: 'Agastache',
    fileKey: 'shop/lavender-spires-v1.zip',
    filename: 'TWKH-Agastache-Digital-Edition.zip',
    priceBinding: 'STRIPE_PRICE_ID_AGASTACHE',
  },
  'gold-and-ivory': {
    title: 'Gold & Ivory',
    fileKey: 'shop/gold-and-ivory-v1.zip',
    filename: 'TWKH-Gold-and-Ivory-Digital-Edition.zip',
    priceBinding: 'STRIPE_PRICE_ID_GOLD_IVORY',
  },
} as const;
export type ShopProductSlug = keyof typeof SHOP_PRODUCTS;
export function shopProduct(slug: string) {
  return Object.prototype.hasOwnProperty.call(SHOP_PRODUCTS, slug) ? SHOP_PRODUCTS[slug as ShopProductSlug] : null;
}
const SITE_URL = 'https://thewellkepthabitat.com';

export interface ShopEnv {
  SHOP_DB?: D1Database;
  PRIVATE_FILES: KVNamespace;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID?: string;
  STRIPE_PRICE_ID_AGASTACHE?: string;
  STRIPE_PRICE_ID_GOLD_IVORY?: string;
  STRIPE_ACCOUNT_ID?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  RESEND_API_KEY?: string;
  SHOP_FROM_EMAIL?: string;
  SHOP_ENABLED?: string;
}

export function shopEnv() {
  return env as unknown as ShopEnv;
}

export function stripeClient(key: string) {
  return new Stripe(key, {
    apiVersion: '2026-08-26.dahlia',
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export async function confirmStripeAccount(stripe: Stripe, config: ShopEnv) {
  const account = await stripe.accounts.retrieveCurrent();
  return TWKH_STRIPE_ACCOUNT_IDS.has(account.id) && account.id === config.STRIPE_ACCOUNT_ID;
}

export function checkoutReady(config: ShopEnv) {
  return config.SHOP_ENABLED === '1' && Boolean(config.SHOP_DB) && Boolean(
    config.STRIPE_SECRET_KEY && config.STRIPE_PRICE_ID && config.STRIPE_ACCOUNT_ID &&
    config.STRIPE_WEBHOOK_SECRET && config.RESEND_API_KEY && config.SHOP_FROM_EMAIL,
  );
}

export function productPriceId(config: ShopEnv, slug: ShopProductSlug) {
  return config[SHOP_PRODUCTS[slug].priceBinding];
}

export async function availableProduct(stripe: Stripe, config: ShopEnv, slug: ShopProductSlug) {
  const product = SHOP_PRODUCTS[slug];
  const priceId = productPriceId(config, slug);
  if (!priceId || !await config.PRIVATE_FILES.get(product.fileKey, 'stream')) return false;
  const price = await stripe.prices.retrieve(priceId);
  return price.active && price.type === 'one_time' && price.unit_amount === PRODUCT_PRICE_CENTS &&
    price.currency === 'usd' && price.tax_behavior === 'exclusive';
}

export function checkoutKeyMatchesOrigin(config: ShopEnv, requestUrl: string) {
  const host = new URL(requestUrl).hostname;
  const isLiveSite = host === 'thewellkepthabitat.com' || host === 'www.thewellkepthabitat.com';
  const key = config.STRIPE_SECRET_KEY ?? '';
  if (isLiveSite) {
    return config.STRIPE_ACCOUNT_ID === 'acct_1UKfgM2fAALQO8uD' &&
      /^(sk|rk)_live_/.test(key);
  }
  return /^(sk|rk)_test_/.test(key);
}

export function siteUrl(path: string, base = SITE_URL) {
  return new URL(path, base).toString();
}

export function downloadUrl(token: string, base?: string) {
  return siteUrl(`/api/shop/download?token=${encodeURIComponent(token)}`, base);
}

export interface ShopOrder {
  id: number;
  access_token: string;
  access_expires_at: string;
  customer_email: string;
  email_sent_at: string | null;
}

export async function fulfillPaidSession(session: Stripe.Checkout.Session, config: ShopEnv) {
  const slug = session.metadata?.product ?? '';
  const product = shopProduct(slug);
  if (session.mode !== 'payment' || session.payment_status !== 'paid' ||
    !product || !session.customer_details?.email) return;

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  await config.SHOP_DB!.prepare(
    `INSERT OR IGNORE INTO shop_orders
      (stripe_session_id, stripe_payment_intent_id, product_slug, customer_email, amount_total, currency, access_token, access_expires_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
  ).bind(
    session.id,
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
    slug, session.customer_details.email, session.amount_total ?? 0,
    session.currency ?? 'usd', token, expires,
  ).run();

  const order = await config.SHOP_DB!.prepare(
    'SELECT id, access_token, access_expires_at, customer_email, email_sent_at FROM shop_orders WHERE stripe_session_id = ?1',
  ).bind(session.id).first<ShopOrder>();
  if (!order || order.email_sent_at) return;
  if (!config.RESEND_API_KEY || !config.SHOP_FROM_EMAIL) throw new Error('Shop delivery email is not configured');

  const link = downloadUrl(order.access_token, session.metadata?.shop_base_url);
  const html = `<div style="margin:0;padding:32px 16px;background:#f4f3ec;font-family:Arial,sans-serif;color:#182421"><div style="max-width:560px;margin:auto;background:#fff;border:1px solid #d9ded7"><div style="padding:18px 28px;background:#365849;color:#fff;letter-spacing:2px;font-size:13px;font-weight:bold">TWKH &nbsp;|&nbsp; THE WELL-KEPT HABITAT</div><div style="padding:32px 28px"><p style="margin:0 0 8px;color:#365849;font-size:12px;letter-spacing:2px;text-transform:uppercase">Your digital edition</p><h1 style="margin:0 0 20px;font-family:Georgia,serif;font-size:28px;font-weight:normal">${product.title}</h1><p style="line-height:1.6">Thank you for supporting The Well-Kept Habitat. Your artwork, two print sizes, and field note are ready.</p><p style="margin:28px 0"><a href="${link}" style="display:inline-block;padding:14px 22px;background:#365849;color:#fff;text-decoration:none;font-weight:bold">Download your artwork</a></p><p style="font-size:14px;line-height:1.6">This link is valid for 30 days. Your files are for personal use; you may print a copy for personal display or give a physical print as a gift.</p><p style="font-size:14px">If the button does not work, copy this address into your browser:<br><a href="${link}" style="color:#365849;word-break:break-all">${link}</a></p></div><div style="padding:18px 28px;border-top:1px solid #d9ded7;color:#365849;font-size:12px">Ecological by design. Elegant by intention.<br><a href="https://thewellkepthabitat.com" style="color:#365849">thewellkepthabitat.com</a></div></div></div>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `twkh-shop-${session.id}` },
    body: JSON.stringify({
      from: config.SHOP_FROM_EMAIL,
      to: [order.customer_email],
      subject: `Your TWKH download: ${product.title}`,
      html,
      text: `Thank you for purchasing ${product.title} from The Well-Kept Habitat. Download your artwork and field note: ${link}\n\nThis link is valid for 30 days. The digital files are for personal use; you may print a copy for personal display or give a physical print as a gift.\n\nThe Well-Kept Habitat | thewellkepthabitat.com`,
    }),
  });
  if (!response.ok) throw new Error(`Delivery email failed (${response.status})`);
  await config.SHOP_DB!.prepare('UPDATE shop_orders SET email_sent_at = CURRENT_TIMESTAMP WHERE id = ?1')
    .bind(order.id).run();
}
