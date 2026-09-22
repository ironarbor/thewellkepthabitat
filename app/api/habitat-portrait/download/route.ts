import { env } from 'cloudflare:workers';

export const runtime = 'edge';

const FILE_KEY = 'reports/habitat-portrait-45v.pdf';
const TOKEN_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface AppEnv {
  LEADS_DB: D1Database;
  PRIVATE_FILES: KVNamespace;
}

interface LeadRecord {
  id: number;
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token') ?? '';

  if (!TOKEN_PATTERN.test(token)) {
    return new Response('This download link is invalid.', { status: 400 });
  }

  const { LEADS_DB, PRIVATE_FILES } = env as unknown as AppEnv;
  const now = new Date().toISOString();
  const lead = await LEADS_DB.prepare(
    `SELECT id FROM habitat_portrait_leads
     WHERE access_id = ?1 AND access_expires_at > ?2
     LIMIT 1`,
  )
    .bind(token, now)
    .first<LeadRecord>();

  if (!lead) {
    return new Response('This download link has expired. Return to the report page for a new link.', {
      status: 410,
    });
  }

  const report = await PRIVATE_FILES.get(FILE_KEY, 'arrayBuffer');
  if (!report) {
    return new Response('The report is temporarily unavailable.', { status: 503 });
  }

  await LEADS_DB.prepare(
    `UPDATE habitat_portrait_leads
     SET download_count = download_count + 1,
         last_downloaded_at = CURRENT_TIMESTAMP,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?1`,
  )
    .bind(lead.id)
    .run();

  return new Response(report, {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': 'attachment; filename="The-Habitat-Portrait-Viscount-Road.pdf"',
      'Content-Type': 'application/pdf',
      'X-Robots-Tag': 'noindex, nofollow, nosnippet',
    },
  });
}
