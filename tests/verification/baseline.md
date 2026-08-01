# Baseline verification

## Approved scope

Subtask `nova-portfolio-cv-builder-01` records the repository baseline only. This subtask creates this verification document and does not modify application source, `package.json`, dependencies, database files, or configuration.

The approved product scope remains the Nova portfolio and CV builder: public SSR pages for Home, Portofolio, Blog, and Contact; owner-only `/admin` management backed by Supabase Auth and Row Level Security (RLS); validated server APIs; CV variants; server-side PDF export; SEO; responsive WCAG AA accessibility; and complete verification.

## Existing package scripts

Source: `package.json`

- `npm run build`: `nuxt build`
- `npm run dev`: `nuxt dev`
- `npm run generate`: `nuxt generate`
- `npm run preview`: `nuxt preview`
- `npm run postinstall`: `nuxt prepare`

## Baseline command

Command: `npm run build`

Result: **Passed**. Nuxt emitted a sourcemap warning during the build; the warning did not fail the command.

## Missing verification scripts

`package.json` has no scripts for:

- Tests
- Type checking
- Linting
- Security checks
- Visual verification

## Known audit blockers

- **Loose generated database types:** `types/database.ts:5`, `types/database.ts:21`, `types/database.ts:31`, `types/database.ts:54`, `types/database.ts:81`, `types/database.ts:102`, `types/database.ts:121`, `types/database.ts:138`, and `types/database.ts:163` expose `any` rows.
- **Service-role client in admin CRUD:** `server/utils/supabaseAdmin.ts:4-19` defines the RLS-bypassing client. Admin handlers use it in `server/api/admin/projects.get.ts:5`, `server/api/admin/projects.post.ts:8`, `server/api/admin/projects/[id].get.ts:6`, `server/api/admin/projects/[id].put.ts:9`, `server/api/admin/projects/[id].delete.ts:7`, `server/api/admin/experiences.get.ts:5`, `server/api/admin/experiences.post.ts:8`, `server/api/admin/experiences/[id].get.ts:6`, `server/api/admin/experiences/[id].put.ts:9`, `server/api/admin/experiences/[id].delete.ts:7`, `server/api/admin/skills.get.ts:5`, `server/api/admin/skills.post.ts:8`, `server/api/admin/skills/[id].put.ts:9`, `server/api/admin/skills/[id].delete.ts:7`, `server/api/admin/blog-posts.get.ts:5`, `server/api/admin/blog-posts.post.ts:8`, `server/api/admin/blog-posts/[id].get.ts:6`, `server/api/admin/blog-posts/[id].put.ts:9`, `server/api/admin/blog-posts/[id].delete.ts:7`, `server/api/admin/cv-variants.get.ts:5`, `server/api/admin/cv-variants.post.ts:8`, `server/api/admin/cv-variants/[id].put.ts:9`, `server/api/admin/cv-variants/[id].delete.ts:7`, `server/api/admin/profile.get.ts:5`, and `server/api/admin/profile.put.ts:8`.
- **Contact honeypot schema conflict:** `app/pages/contact.vue:107`, `app/pages/contact.vue:118`, `server/api/contact.post.ts:5-9`, and `server/utils/zodSchemas.ts:59-63` use `hp` in the request flow, but the strict contact schema rejects that field.
- **Incomplete admin coverage:** `app/layouts/admin.vue:6-15` has no education, certification, or contact-message management links. The corresponding routes are absent at `app/pages/admin/education/`, `app/pages/admin/certifications/`, and `app/pages/admin/contact-messages/`.
- **Broken project detail transform access:** `app/pages/projects/[slug].vue:6-28` reads `project.data` after the project composable has already transformed the response.
- **PDF layout and authorization hardening:** `server/utils/buildCvPdf.ts:25-37` wraps by character count, and `server/utils/buildCvPdf.ts:49-58` advances the cursor without an overflow guard. Data selection and default or non-default owner and publication checks require hardening in `server/api/cv/generate.get.ts:18-55`.
- **Hardcoded public and footer data:** `app/components/Footer.vue:23`, `app/pages/contact.vue:87-90`, `app/pages/projects/index.vue:17-19`, and `app/pages/projects/index.vue:156` retain hardcoded or fallback contact and public-content values.
- **Incomplete SEO and UI-state coverage:** SEO metadata and canonical, Open Graph, and structured-data handling require review in `app/layouts/default.vue:13`, `app/pages/index.vue:91`, `app/pages/projects/index.vue:156`, `app/pages/projects/[slug].vue:48`, `app/pages/blog/index.vue:45`, `app/pages/blog/[slug].vue:49`, and `app/pages/contact.vue:135`. Consistent loading, empty, and error states also remain incomplete across the public pages.

## Baseline limitations

The build proves that Nuxt production compilation currently succeeds. It does not prove type safety, lint compliance, test coverage, security posture, RLS behavior, PDF correctness, or rendered visual and accessibility quality because the corresponding verification scripts are absent.
