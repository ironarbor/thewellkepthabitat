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
    title: 'Bumbles Amongst Giants',
    saleReady: true,
    fileKey: 'shop/visit-to-the-hyssop-v1.zip',
    filename: 'TWKH-Bumbles-Amongst-Giants-Digital-Edition.zip',
    priceBinding: 'STRIPE_PRICE_ID',
  },
  'gold-and-ivory': {
    title: 'Golden Everlasting',
    saleReady: true,
    fileKey: 'shop/gold-and-ivory-v1.zip',
    filename: 'TWKH-Golden-Everlasting-Digital-Edition.zip',
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
  if (!product.saleReady) return false;
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
  const expiration = new Date(order.access_expires_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  const html = `<div style="margin:0;padding:28px 12px;background:#f4f3ec;color:#182421;font-family:Arial,sans-serif"><table role="presentation" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;margin:auto;background:#fff;border:1px solid #d9ded7"><tr><td align="center" style="padding:30px 24px 12px"><img src="https://thewellkepthabitat.com/images/twkh-logo-seal-web.png" width="78" height="101" alt="The Well-Kept Habitat seal" style="display:block;width:78px;height:101px;border:0"></td></tr><tr><td style="padding:14px 38px 34px"><p style="margin:0 0 12px;text-align:center;color:#365849;font-size:11px;letter-spacing:3px">TWKH / DIGITAL EDITION</p><h1 style="margin:0 0 22px;text-align:center;color:#182421;font-family:Georgia,serif;font-size:31px;font-weight:normal;line-height:1.2">A closer look, now yours.</h1><p style="margin:0 0 18px;font-size:15px;line-height:1.65">Thank you for choosing <strong>${product.title}</strong>. Your photograph, two landscape print sizes, and field note are ready to enjoy.</p><p style="margin:28px 0;text-align:center"><a href="${link}" style="display:inline-block;padding:15px 28px;background:#365849;color:#fff;text-decoration:none;font-size:14px;font-weight:bold;letter-spacing:1px">DOWNLOAD YOUR EDITION</a></p><p style="margin:0 0 18px;font-size:13px;line-height:1.6">Your private link is available through ${expiration}. Keep the digital files for personal use; you may display a print or give a physical print as a gift.</p><p style="margin:0 0 18px;font-size:12px;line-height:1.6;color:#4a5e54">Photography guarantee: No AI was used to create this photograph.</p><p style="margin:0;font-size:12px;line-height:1.6;color:#4a5e54">Button not opening? <a href="${link}" style="color:#365849;word-break:break-all">Use this direct download link</a>. For help, reply to this email or write to <a href="mailto:admin@twkhabitat.com" style="color:#365849">admin@twkhabitat.com</a>.</p></td></tr><tr><td align="center" style="padding:22px 30px;background:#edf0ea;color:#365849;font-family:Georgia,serif;font-size:15px;line-height:1.6">Ecological by design. Elegant by intention.<br><a href="https://thewellkepthabitat.com" style="color:#365849;font-family:Arial,sans-serif;font-size:11px">thewellkepthabitat.com</a></td></tr></table></div>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `twkh-shop-${session.id}` },
    body: JSON.stringify({
      from: config.SHOP_FROM_EMAIL,
      to: [order.customer_email],
      subject: `Your artwork is ready | TWKH`,
      html,
      text: `TWKH / DIGITAL EDITION\n\nA closer look, now yours.\n\nThank you for choosing ${product.title}. Your photograph, two landscape print sizes, and field note are ready.\n\nDownload your edition: ${link}\n\nYour private link is available through ${expiration}. Keep the digital files for personal use; you may display a print or give a physical print as a gift.\n\nPhotography guarantee: No AI was used to create this photograph.\n\nFor help, reply to this email or write to admin@twkhabitat.com.\n\nEcological by design. Elegant by intention.\nthewellkepthabitat.com`,
    }),
  });
  if (!response.ok) throw new Error(`Delivery email failed (${response.status})`);
  await config.SHOP_DB!.prepare('UPDATE shop_orders SET email_sent_at = CURRENT_TIMESTAMP WHERE id = ?1')
    .bind(order.id).run();
}
