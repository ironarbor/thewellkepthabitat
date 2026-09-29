import { shopEnv } from '@/lib/shop';

export const runtime = 'edge';

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session_id') ?? '';
  if (!/^cs_(test_|live_)[A-Za-z0-9]+$/.test(sessionId)) return Response.json({ status: 'pending' }, { headers: { 'Cache-Control': 'no-store' } });
  const order = await shopEnv().LEADS_DB.prepare(
    'SELECT access_token FROM shop_orders WHERE stripe_session_id = ?1 AND refunded_at IS NULL AND access_expires_at > ?2',
  ).bind(sessionId, new Date().toISOString()).first<{ access_token: string }>();
  return Response.json(order ? { status: 'ready', downloadUrl: `/api/shop/download?token=${encodeURIComponent(order.access_token)}` } : { status: 'pending' }, { headers: { 'Cache-Control': 'no-store' } });
}
