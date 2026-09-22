CREATE TABLE IF NOT EXISTS habitat_portrait_leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  access_id TEXT NOT NULL UNIQUE,
  access_expires_at TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE,
  first_name TEXT,
  town TEXT,
  marketing_consent INTEGER NOT NULL DEFAULT 0 CHECK (marketing_consent IN (0, 1)),
  report_slug TEXT NOT NULL DEFAULT 'habitat-portrait-45v',
  source TEXT NOT NULL DEFAULT 'website',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_downloaded_at TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(email, report_slug)
);

CREATE INDEX IF NOT EXISTS idx_habitat_portrait_leads_consent_created
ON habitat_portrait_leads(marketing_consent, created_at);

PRAGMA optimize;
