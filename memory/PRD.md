# Nova Sugiantara — Personal Portfolio (portofolio-nova)

## Original problem statement
User (Indonesian): "improve website pribadi saya ini. sekiranya yang kurang kembangkan"
→ Improve my personal website; develop/build out what is lacking. User skipped clarifying
questions, so the agent proceeded with best judgment.

## What the project is
A Nuxt 4 personal portfolio website for **Nova Sugiantara**, Full Stack Web Developer (Bali, Indonesia).
Public pages: Home, Portfolio (projects list + detail), Blog (list + article), Contact.
Includes a light/dark theme, downloadable generated CV (PDF), and a working contact form.

## Architecture (adapted to the Emergent environment)
The repo was originally Supabase-backed with no credentials available here. Adapted as follows:
- **Frontend**: Nuxt 4 app relocated to `/app/frontend`, runs on port 3000 via supervisor (`yarn start` → `nuxt dev`).
- **Backend**: FastAPI on port 8001 (`/app/backend/server.py`):
  - Owns `POST /api/contact` (validates + stores messages in MongoDB `contact_messages`) and `GET /api/contact-messages`.
  - Reverse-proxies every other `/api/*` request to the Nuxt server on `:3000` (required because ingress routes `/api` → 8001, everything else → 3000).
- **Data**: Public read data is served from a static seed module `/app/frontend/server/data/portfolio.ts`
  (profile, projects, skills, experiences, education, blog posts). No external DB for reads.
- **CV**: Generated on the fly from seed data via `server/utils/cvPdfRoute.ts` + `buildCvPdf.ts` (pdf-lib).

## Tech stack
Nuxt 4 / Vue 3, TypeScript, custom CSS design-token system (light/dark), FastAPI, MongoDB (contact only), pdf-lib.

## Implemented (2026-08-12)
- Made the whole site runnable in this environment (was not runnable: wrong dirs + missing DB creds).
- Converted public data layer from Supabase → static seed data with real portfolio content
  (6 projects with cover images, 6 experience entries, skills, education, 3 blog articles).
- Added blog list route content; blog detail renders sanitized markdown → HTML.
- Wired contact form to FastAPI + MongoDB (validation, honeypot, rate limiting, persistence).
- CV PDF generation working from seed data.
- Verified via testing agent: backend 100% (14/14), frontend all pages/flows pass.

## Notes / known limitations
- `/admin/*` pages still reference Supabase and are intentionally non-functional (not linked publicly, out of scope).
- WhatsApp float button is hidden until a number is set in `/app/frontend/.env` (`WHATSAPP_NUMBER`).
- Contact rate limit is in-memory per-process (fine for single worker / low traffic).

## Backlog / next
- P1: Add a real avatar image + richer hero visual on the right column of Home.
- P1: Simple admin/inbox view for contact messages (currently only via GET /api/contact-messages).
- P2: Re-enable Supabase-backed admin if the user provides credentials, or migrate admin to Mongo.
- P2: Add SEO/OG images per page and sitemap.
- P2: Populate real project/repo URLs and certifications when the user provides them.
