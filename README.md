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
