CREATE TABLE IF NOT EXISTS shop_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_session_id TEXT NOT NULL UNIQUE,
  stripe_payment_intent_id TEXT,
  product_slug TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  amount_total INTEGER NOT NULL,
  currency TEXT NOT NULL,
  access_token TEXT NOT NULL UNIQUE,
  access_expires_at TEXT NOT NULL,
  email_sent_at TEXT,
  refunded_at TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS shop_orders_payment_intent_idx ON shop_orders(stripe_payment_intent_id);
