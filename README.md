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

The shop supports one downloadable artwork, **A Visit to the Hyssop**, at **$4.00 USD before tax**. The photograph is identified as a female worker common eastern bumble bee (*Bombus impatiens*) visiting anise hyssop / Blue Fortune hyssop (*Agastache* ‘Blue Fortune’). The public image is a reduced preview; the ZIP sold to customers must be uploaded to the existing private `PRIVATE_FILES` KV namespace under `shop/visit-to-the-hyssop-v1.zip`. Never commit the purchased files or Stripe credentials to this public repository.

Checkout remains closed until every part of fulfillment is ready. Configure these Worker secrets/variables in a Stripe sandbox first:

| Setting | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Rotated, restricted Stripe API key with Checkout Session and Price read permissions |
| `STRIPE_PRICE_ID` | One-time USD price for the digital edition, from the same Stripe account as the key. Sandbox: `price_1UKgiKGzbaYKBAS2595JuE1F` ($4.00, tax exclusive). Use a separate live Price ID for launch. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the webhook at `/api/shop/webhook` |
| `RESEND_API_KEY` | Transactional delivery email |
| `SHOP_FROM_EMAIL` | Verified sender address for delivery email |
| `SHOP_ENABLED` | Set to `1` only after all checks below pass |

Apply `migrations/0002_create_shop_orders.sql` to the existing `LEADS_DB` D1 database. Register the Stripe webhook for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, and `charge.refunded`. The handler verifies signatures, requires `payment_status=paid`, stores one order per Checkout Session, and retries email delivery idempotently. The success page reads only fulfilled orders; a private KV file is served only with an unexpired paid-order token. The download link lasts 90 days.

Before enabling sales:

1. Confirm the price and account; the connected ChatGPT Stripe sandbox and any separately supplied API key must reference the same account. Replace any key pasted into chat with a fresh restricted key stored in Worker secrets.
2. Upload the final ZIP to private KV; check `/api/shop/product` reports the intended price and `available: true` after configuration. Do not set `SHOP_ENABLED=1` until the file, price, and email sender are ready.
3. Configure the verified sender and webhook endpoint. Apply the D1 migration. Test a successful sandbox payment, the delivery email, download, duplicate webhook delivery, and a failed or delayed payment. Confirm unpaid sessions never gain access.
4. Confirm tax registrations and the appropriate digital-art product tax code before enabling Stripe automatic tax. The $4.00 Price is tax exclusive, but that alone does not calculate or collect tax. This integration currently does **not** set `automatic_tax`, and the connected sandbox Tax settings remain pending. A Stripe receipt does not replace the separate artwork delivery email.
5. Recheck the live Stripe account, live price, live webhook secret, Worker bindings, private ZIP, and live email sender independently before switching from sandbox to live sales.

The first ZIP contains 4 × 6 and 5 × 7 inch landscape JPEGs, a one-page field note, and personal-use instructions. Larger sizes need the original 6000 × 4000 photograph, since the supplied working image is 2048 × 1365 pixels. Physical prints are only editorial copy for now; no shipping or physical-product charge is active.
