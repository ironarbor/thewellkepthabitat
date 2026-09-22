import { env } from 'cloudflare:workers';

export const runtime = 'edge';

const REPORT_SLUG = 'habitat-portrait-45v';
const ACCESS_WINDOW_MS = 15 * 60 * 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface AppEnv {
  LEADS_DB: D1Database;
}

interface AccessRequest {
  email?: unknown;
  firstName?: unknown;
  town?: unknown;
  marketingConsent?: unknown;
  website?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
}

function textValue(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export async function POST(request: Request) {
  let input: AccessRequest;

  try {
    input = (await request.json()) as AccessRequest;
  } catch {
    return Response.json({ error: 'Please submit the form again.' }, { status: 400 });
  }

  if (textValue(input.website, 120)) {
    return Response.json({ error: 'Please submit the form again.' }, { status: 400 });
  }

  const email = textValue(input.email, 254).toLowerCase();
  const firstName = textValue(input.firstName, 80);
  const town = textValue(input.town, 100);
  const marketingConsent = input.marketingConsent === true ? 1 : 0;
  const utmSource = textValue(input.utmSource, 100);
  const utmMedium = textValue(input.utmMedium, 100);
  const utmCampaign = textValue(input.utmCampaign, 100);

  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 400 });
  }

  const accessId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + ACCESS_WINDOW_MS).toISOString();
  const { LEADS_DB } = env as unknown as AppEnv;

  try {
    await LEADS_DB.prepare(
      `INSERT INTO habitat_portrait_leads (
        access_id, access_expires_at, email, first_name, town,
        marketing_consent, report_slug, source, utm_source, utm_medium, utm_campaign
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'website', ?8, ?9, ?10)
      ON CONFLICT(email, report_slug) DO UPDATE SET
        access_id = excluded.access_id,
        access_expires_at = excluded.access_expires_at,
        first_name = CASE WHEN excluded.first_name <> '' THEN excluded.first_name ELSE habitat_portrait_leads.first_name END,
        town = CASE WHEN excluded.town <> '' THEN excluded.town ELSE habitat_portrait_leads.town END,
        marketing_consent = CASE WHEN excluded.marketing_consent = 1 THEN 1 ELSE habitat_portrait_leads.marketing_consent END,
        utm_source = CASE WHEN excluded.utm_source <> '' THEN excluded.utm_source ELSE habitat_portrait_leads.utm_source END,
        utm_medium = CASE WHEN excluded.utm_medium <> '' THEN excluded.utm_medium ELSE habitat_portrait_leads.utm_medium END,
        utm_campaign = CASE WHEN excluded.utm_campaign <> '' THEN excluded.utm_campaign ELSE habitat_portrait_leads.utm_campaign END,
        updated_at = CURRENT_TIMESTAMP`,
    )
      .bind(
        accessId,
        expiresAt,
        email,
        firstName,
        town,
        marketingConsent,
        REPORT_SLUG,
        utmSource,
        utmMedium,
        utmCampaign,
      )
      .run();
  } catch (error) {
    console.error('Unable to save Habitat Portrait request', error);
    return Response.json(
      { error: 'The report is temporarily unavailable. Please try again shortly.' },
      { status: 500 },
    );
  }

  return Response.json(
    { downloadUrl: `/api/habitat-portrait/download?token=${encodeURIComponent(accessId)}` },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
