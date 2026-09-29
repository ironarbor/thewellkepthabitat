import { PRIVATE_FILE_KEY, shopEnv } from '@/lib/shop';

export const runtime = 'edge';

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? '';
  if (!/^[0-9a-f-]{36}$/i.test(token)) return new Response('Invalid download link.', { status: 400 });
  const config = shopEnv();
  const order = await config.LEADS_DB.prepare(
    'SELECT id FROM shop_orders WHERE access_token = ?1 AND refunded_at IS NULL AND access_expires_at > ?2',
  ).bind(token, new Date().toISOString()).first<{ id: number }>();
  if (!order) return new Response('This link has expired or is unavailable. Please contact TWKH with your order receipt.', { status: 410 });
  const file = await config.PRIVATE_FILES.get(PRIVATE_FILE_KEY, 'stream');
  if (!file) return new Response('The file is temporarily unavailable. Please try again shortly.', { status: 503 });
  await config.LEADS_DB.prepare('UPDATE shop_orders SET download_count = download_count + 1 WHERE id = ?1').bind(order.id).run();
  return new Response(file, { headers: {
    'Content-Type': 'application/zip',
    'Content-Disposition': 'attachment; filename="TWKH-A-Visit-to-the-Hyssop.zip"',
    'Cache-Control': 'private, no-store',
    'X-Robots-Tag': 'noindex, nofollow, nosnippet',
  } });
}
