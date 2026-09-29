import Stripe from 'stripe';
import { env } from 'cloudflare:workers';

export const PRODUCT_SLUG = 'visit-to-the-hyssop';
export const PRODUCT_PRICE_CENTS = 400;
export const TWKH_STRIPE_ACCOUNT_IDS = new Set([
  'acct_1UKfgM2fAALQO8uD', // TWKH live account and shared test mode
  'acct_1UKfjzKHupIKb8Du', // Isolated TWKH sandbox
]);
export const PRIVATE_FILE_KEY = 'shop/visit-to-the-hyssop-v1.zip';
const SITE_URL = 'https://thewellkepthabitat.com';

export interface ShopEnv {
  LEADS_DB: D1Database;
  PRIVATE_FILES: KVNamespace;
  STRIPE_SECRET_KEY?: string;
  STRIPE_PRICE_ID?: string;
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
  return config.SHOP_ENABLED === '1' && Boolean(
    config.STRIPE_SECRET_KEY && config.STRIPE_PRICE_ID && config.STRIPE_ACCOUNT_ID &&
    config.STRIPE_WEBHOOK_SECRET && config.RESEND_API_KEY && config.SHOP_FROM_EMAIL,
  );
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
  if (session.mode !== 'payment' || session.payment_status !== 'paid' ||
    session.metadata?.product !== PRODUCT_SLUG || !session.customer_details?.email) return;

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();
  await config.LEADS_DB.prepare(
    `INSERT OR IGNORE INTO shop_orders
      (stripe_session_id, stripe_payment_intent_id, product_slug, customer_email, amount_total, currency, access_token, access_expires_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)`,
  ).bind(
    session.id,
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
    PRODUCT_SLUG, session.customer_details.email, session.amount_total ?? 0,
    session.currency ?? 'usd', token, expires,
  ).run();

  const order = await config.LEADS_DB.prepare(
    'SELECT id, access_token, access_expires_at, customer_email, email_sent_at FROM shop_orders WHERE stripe_session_id = ?1',
  ).bind(session.id).first<ShopOrder>();
  if (!order || order.email_sent_at) return;
  if (!config.RESEND_API_KEY || !config.SHOP_FROM_EMAIL) throw new Error('Shop delivery email is not configured');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `twkh-shop-${session.id}` },
    body: JSON.stringify({
      from: config.SHOP_FROM_EMAIL,
      to: [order.customer_email],
      subject: 'Your TWKH artwork download',
      html: `<p>Thank you for purchasing <strong>Bumbles Amongst the Giants</strong>.</p><p><a href="${downloadUrl(order.access_token, session.metadata?.shop_base_url)}">Download your artwork and field note</a></p><p>Your personal download link is available for 90 days. Please keep the digital file for your own use; you may print a copy for personal display or give a physical print as a gift.</p><p>The Well-Kept Habitat</p>`,
    }),
  });
  if (!response.ok) throw new Error(`Delivery email failed (${response.status})`);
  await config.LEADS_DB.prepare('UPDATE shop_orders SET email_sent_at = CURRENT_TIMESTAMP WHERE id = ?1')
    .bind(order.id).run();
}
