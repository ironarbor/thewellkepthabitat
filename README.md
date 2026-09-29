# The Well-Kept Habitat website

This repository powers **thewellkepthabitat.com**. It is a React site with file-based pages, built with vinext/Vite and deployed to the existing Cloudflare Worker named `wellkepthabitat`. The repository name and Worker name serve different purposes; changing the Worker name in `wrangler.jsonc` creates a different deployment target.

## Where to edit website text

Each `app/.../page.tsx` file controls the page at the matching URL. Open a file on GitHub, click the pencil, make the edit, and commit it to `main`. Check the new production build in Cloudflare before assuming the change is live.

| Website page | File |
| --- | --- |
| Home `/` | [`app/page.tsx`](app/page.tsx) |
| About `/about` | [`app/about/page.tsx`](app/about/page.tsx) |
| Founder background `/about/founder-background` | [`app/about/founder-background/page.tsx`](app/about/founder-background/page.tsx) |
| Editorial `/editorial` | [`app/editorial/page.tsx`](app/editorial/page.tsx) |
| Editorial preview `/editorial/issues-or-articles` | [`app/editorial/issues-or-articles/page.tsx`](app/editorial/issues-or-articles/page.tsx) |
| Services `/services` | [`app/services/page.tsx`](app/services/page.tsx) |
| Consultations `/services/consultations` | [`app/services/consultations/page.tsx`](app/services/consultations/page.tsx) |
| The Habitat Portrait `/services/habitat-assessments` | [`app/services/habitat-assessments/page.tsx`](app/services/habitat-assessments/page.tsx) |
| Shop `/shop` | [`app/shop/page.tsx`](app/shop/page.tsx) |
| Learn `/learn` | [`app/learn/page.tsx`](app/learn/page.tsx) |
| Sample report `/learn/habitat-portrait` | [`app/learn/habitat-portrait/page.tsx`](app/learn/habitat-portrait/page.tsx) |

## Shared parts

| Change | File |
| --- | --- |
| Menu, header, footer, social and email links, reusable page hero | [`components/site-shell.tsx`](components/site-shell.tsx) |
| Colors, fonts, spacing, page layouts, mobile styling | [`app/globals.css`](app/globals.css) |
| Browser title, search description, social sharing image, canonical metadata base | [`app/layout.tsx`](app/layout.tsx) |
| Editorial cover | [`components/editorial-cover.tsx`](components/editorial-cover.tsx) |
| Sample report signup form | [`components/habitat-portrait-form.tsx`](components/habitat-portrait-form.tsx) |
| Photos, logo, favicon, social preview | [`public/`](public/) |

An image referenced as `/images/twkh-garden-hero.jpg` lives at `public/images/twkh-garden-hero.jpg`. Changing a photo without changing the code works if the replacement retains the same filename.

## Behind the pages

- `app/api/habitat-portrait/` handles sample report access and downloads. `migrations/` defines its lead database table.
- `wrangler.jsonc` names the existing Cloudflare Worker and its database and private-file bindings. The Worker name must remain `wellkepthabitat` unless the deployment and domain connections are deliberately migrated together.
- `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `vite.config.ts`, `next.config.ts`, and `tsconfig.json` support the build. They are not website copy.
- The older standalone root `index.html` was removed; the home page is `app/page.tsx`.

The redirects from `twkhabitat.com` and `wellkepthabitat.com` are configured in each domain's Cloudflare Redirect Rules, outside this repository. The planned `admin@twkhabitat.com` mailbox is configured separately from the website.

## Digital artwork shop

The shop catalog has three photographs, each in digital and physical-print formats. **All three digital editions are priced at $4.00 USD each before tax.** Each digital edition has its own private ZIP, live Stripe Price, order record, and download email. Checkout accepts one digital edition at a time. All physical prints remain placeholders until paper, size, production, prices, and shipping charges are decided.

The first photograph depicts a female worker common eastern bumblebee (*Bombus impatiens*) visiting purple giant hyssop (*Agastache scrophulariifolia*), as confirmed by the owner. The other two photographs use descriptive working titles, and their field notes avoid unverified species claims. Public images are previews. Private KV keys are `shop/visit-to-the-hyssop-v1.zip`, `shop/lavender-spires-v1.zip`, and `shop/gold-and-ivory-v1.zip`; never commit purchased files or Stripe credentials to this public repository.

Checkout remains closed until every part of fulfillment is ready. Configure these Worker secrets/variables in a Stripe sandbox first:

| Setting | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | TWKH account test key during sandbox testing; use a fresh restricted key with Account read, Price read, and Checkout Session write permissions. Rotate the previously shared test secret. Store as a Cloudflare Worker Secret. |
| `STRIPE_PRICE_ID` | First digital edition's one-time USD $4.00 tax-exclusive Price. Live: `price_1UL4452fAALQO8uDUDRrPRW5`; isolated sandbox: `price_1UKicEKHupIKb8DuwiaNdCwf`. |
| `STRIPE_PRICE_ID_AGASTACHE` | Agastache live one-time $4 Price: `price_1UL52e2fAALQO8uDKFyr4Fkz`. |
| `STRIPE_PRICE_ID_GOLD_IVORY` | Gold & Ivory live one-time $4 Price: `price_1UL52S2fAALQO8uDTJ1uMudW`. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the webhook at `/api/shop/webhook` |
| `RESEND_API_KEY` | Transactional delivery email |
| `SHOP_FROM_EMAIL` | Verified sender address for delivery email; proposed `admin@twkhabitat.com` after sending-domain verification |
| `SHOP_ENABLED` | Set to `1` only after all checks below pass |

Create a separate production D1 database `twkh-shop-orders`, bind it to the Worker as `SHOP_DB`, and apply `shop-migrations/0001_create_shop_orders.sql` there. Keep the existing `LEADS_DB` for habitat leads. The preview `SHOP_DB` binding uses `twkh-shop-test`, where the order table already exists. The live Stripe webhook `we_1UL45h2fAALQO8uDphRZYxx1` sends `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `charge.refunded` to `/api/shop/webhook`. The handler verifies signatures, requires `payment_status=paid`, stores one order per Checkout Session, and retries email delivery idempotently. The success page reads only fulfilled orders; a private KV file is served only with an unexpired paid-order token. New download links last 30 days; previously issued 90-day links retain their original expiration.

Before enabling sales:

1. The TWKH account is connected in live and test mode. Its isolated sandbox is `acct_1UKfjzKHupIKb8Du`, separate from the live account `acct_1UKfgM2fAALQO8uD`. A live secret saved in Cloudflare must not be used for test transactions; use a separate sandbox secret during validation. Do not paste keys into chat or commit them.
2. Upload the final ZIP to private KV; check `/api/shop/product` reports the intended price and `available: true` after configuration. Do not set `SHOP_ENABLED=1` until the file, price, and email sender are ready.
3. Configure the verified sender and webhook endpoint. Apply the D1 migration. Test a successful sandbox payment, the delivery email, download, duplicate webhook delivery, and a failed or delayed payment. Confirm unpaid sessions never gain access.
4. Massachusetts DOR Directive 11-4 says a photographer's pictures transferred solely as a digital file via the Internet are not subject to Massachusetts sales tax. This product delivers only a digital ZIP, so pending Massachusetts sales tax registration is not a launch blocker for this edition. The integration does **not** set `automatic_tax`; review obligations in other jurisdictions as sales expand, and revisit tax treatment for any physical prints. A Stripe receipt does not replace the separate artwork delivery email.
5. Recheck the live Stripe account, live price, live webhook secret, Worker bindings, private ZIP, and live email sender independently before switching from sandbox to live sales.

Each ZIP contains 4 × 6 and 5 × 7 inch landscape JPEGs, a one-page field note, and personal-use instructions. The two additional supplied JPEGs are 2048 × 1365; their NEF originals are retained outside the public repo. Larger print sizes need appropriately exported originals. Physical print checkout must include a verified shipping address, explicit shipping option/cost shown before payment, fulfillment method, and refund/return policy. No shipping or physical-product charge is active.

## Preview build

Worker Previews are enabled for this draft branch. Checkout remains disabled during setup.
