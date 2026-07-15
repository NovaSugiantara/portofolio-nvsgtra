# Agent Directives — Nova Sugiantara Portfolio Project

# novasugiantara.web.id

Welcome. You are my expert AI development assistant working on my personal portfolio + CV-builder web app. This file is the source of truth for architecture, constraints, and operational rules. Follow it strictly so the codebase stays consistent, secure, and high quality.

Related documents you should also read before making structural or data changes:

- `PRD.md` — product goals, features, scope
- `SRS.md` — technical spec, database schema, RLS policies, security requirements

## 0. Required Skills to Consult

Before writing any Supabase/Postgres-related code (migrations, RLS policies, queries, schema design), **read these local skills first**:

- `~/.agents/skills/supabase-postgres-best-practices`
- `~/.agents/skills/supabase`
- `~/.agents/skills/hallmark`
- `~/.agents/skills/frontend-ui-engineering`
- `~/.agents/skills/caveman`
- `~/.agents/skills/caveman-*`
- `~/.agents/skills/web-design-guidelines`

These contain project-specific conventions for schema design, migrations, and query patterns that take precedence over generic Postgres knowledge. If a rule in this file conflicts with those skills, the skills win for anything Supabase/Postgres-specific; this file wins for everything else (UI, architecture, workflow).

## 1. Project Overview & Role

- **Role:** Full-Stack Developer (Nuxt/Vue focus)
- **Tech Stack:** Nuxt 4, Vue 3 (Composition API, `<script setup>`), TypeScript, Tailwind CSS v4, shadcn-vue, Supabase (Postgres + Auth + Storage)
- **Goal:** Build and maintain a personal portfolio site for Nova Sugiantara that:
  1. Publicly showcases profile, skills, work experience, and projects (sourced from Supabase, not hardcoded).
  2. Has a protected admin area where the owner (only) can create/update/delete profile data, experience, projects, and certifications.
  3. Can generate/export a CV (PDF) dynamically from the structured data stored in Supabase, and let the owner save multiple tailored CV versions.

## 2. Core Directives & Rules

- **Global navigation:** exactly four items in the public top nav — **Home** (`/`), **Portofolio** (`/projects`), **Blog** (`/blog`), **Contact** (`/contact`). `/admin` is never added to this nav, the footer, the mobile menu, or `sitemap.xml`; it's disallowed in `robots.txt`. The owner reaches it only by typing the URL. This is a UX/discoverability choice on top of the real security boundary — Supabase Auth + RLS + server-side session checks — never a substitute for it.
- **Floating WhatsApp button:** rendered once in `layouts/default.vue` (not duplicated per-page), fixed bottom-right on every public page, with an accessible label and a tap target ≥44×44px on mobile. The phone number/greeting come from config or the `profiles` table, never hardcoded inline in the component.
- **Blog content safety:** blog post bodies are Markdown, always rendered through a sanitizing renderer server-side or at build/request time — never `v-html` on raw, unsanitized input — even though only the authenticated owner can write posts.
- **Progressive Enhancement:** Public pages (portfolio) must be server-rendered (SSR) via Nuxt so content is visible and indexable without JS. Interactive/admin features may depend on JS.
- **Responsive Design:** Every component fully responsive (mobile, tablet, desktop) using Tailwind breakpoints.
- **Accessibility:** Semantic HTML, proper `aria-*` labels on interactive elements, WCAG AA contrast, keyboard-navigable admin forms.
- **Performance:** Use `<NuxtImg>`/`@nuxt/image` for image optimization, lazy-load below-the-fold sections, keep bundle lean, avoid unnecessary client-only components on public pages.
- **SEO:** Public pages must have proper `useSeoMeta`/`useHead` (title, description, OpenGraph, canonical URL), since this is a portfolio meant to be found by recruiters.

## 3. Security-First Principles (non-negotiable)

- **Row Level Security (RLS) is mandatory on every table.** No table goes to production without RLS enabled and explicit policies — default deny, then allow narrowly.
- **Public (anon) role:** read-only access to published content only (e.g., `is_published = true`). Never grant anon `INSERT`/`UPDATE`/`DELETE`.
- **Owner/admin role:** all write access must be scoped to `auth.uid() = owner_id` (or equivalent), never a blanket "any authenticated user can write."
- **Service role key** (`SUPABASE_SERVICE_ROLE_KEY`) is **only** ever used in server-side code (Nuxt `server/api/**`), **never** in `runtimeConfig.public`, never in client-side composables, never committed to git.
- **Publishable/anon key** is the only Supabase key exposed to the browser (`runtimeConfig.public.supabaseKey`).
- **Input validation:** validate and sanitize all user input server-side with `zod` before it touches the database, even for the single-admin use case — this protects against malformed data and injected content in CV output.
- **Contact form / any public write endpoint:** must have rate limiting + honeypot/CAPTCHA to prevent spam/abuse, since it's the only public write path.
- **File uploads (avatar, project images, resume assets):** restrict file type/size, store in a Supabase Storage bucket with its own RLS/policy, never trust client-provided MIME type alone.
- **Secrets:** `.env` is git-ignored; `.env.example` only ever contains placeholder names, never real values.
- **Auth:** Admin login via Supabase Auth (email/password or magic link). No public sign-up flow — this is a single-owner app, so the admin account is provisioned manually (no open registration endpoint).

## 4. Workflow & Commands

- **Install dependencies:** `npm install`
- **Run local server:** `npm run dev`
- **Build for production:** `npm run build`
- **Static generate (if used):** `npm run generate`
- **Preview production build:** `npm run preview`
- **Supabase local/migrations:** follow the `supabase` skill's conventions for `supabase migration new`, `supabase db push`, etc.

## 5. Code Standards

- **Styling:** Tailwind CSS utility classes + shadcn-vue components. Avoid inline styles unless required for dynamic theming.
- **TypeScript:** Strict mode. No `any`. Define explicit `interface`/`type` for all props, composables' return values, and Supabase row shapes (generate types via Supabase CLI: `supabase gen types typescript`).
- **Naming Conventions:**
  - Components: `PascalCase` (e.g., `ProjectCard.vue`)
  - Composables: `camelCase` prefixed with `use` (e.g., `useProjects.ts`)
  - Server API routes: `kebab-case` (e.g., `server/api/cv/generate.post.ts`)
- **Documentation:** JSDoc on complex composables/utility functions, especially anything touching Supabase queries or PDF generation.
- **Data fetching:** use Nuxt's `useAsyncData`/`useFetch` for public data; never call the Supabase client with the service role from the browser.

## 6. Constraints

- **Never** hardcode sensitive data or API keys (Supabase URL/keys, service role, email service keys). Always use environment variables.
- **Never** modify `node_modules` or `.git` directly.
- **Never** expose the service role key to the client bundle.
- **Never** allow anon/public role to write to any table.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).

## 7. Project Architecture (Nuxt 4 `app/` directory)

```
app/
  assets/css/        # Tailwind entry, global styles
  components/         # PascalCase reusable UI (ProjectCard, ExperienceItem, etc.)
    ui/               # shadcn-vue generated components
    WhatsAppFloatButton.vue  # global fixed bottom-right WA link, mounted in layouts/default.vue
  composables/         # useProjects, useExperiences, useAuth, useCv, useBlogPosts, etc.
  layouts/             # default.vue (public — includes top nav: Home/Portofolio/Blog/Contact + WhatsAppFloatButton), admin.vue (dashboard)
  middleware/          # auth.ts (protects /admin/** routes)
  docs                 # Source Of Truth , CV,DESIGN,SRS & PRD
  pages/
    index.vue          # Home / hero
    projects/index.vue # nav label "Portofolio" — about + experience + projects + education/certs
    projects/[slug].vue
    blog/index.vue     # public blog listing (published only)
    blog/[slug].vue    # public blog post detail
    contact.vue         # contact form + email + socials (WhatsApp button is global, not just here)
    admin/
      # NOTE: nothing under /admin is ever linked from the public nav, footer, or sitemap.
      # It is reached only by typing the URL directly; still fully gated by middleware/auth.ts
      # AND server-side session checks in server/api/admin/** (nav omission is UX, not security).
      login.vue
      dashboard.vue
      projects/
      experiences/
      blog/
      cv/
  utils/
server/
  api/
    projects.get.ts        # public read
    blog.get.ts             # public read (published posts, list)
    blog/[slug].get.ts      # public read (single published post)
    admin/projects.post.ts # protected write (uses service role, checks session)
    admin/blog-posts.post.ts # protected write for blog CRUD
    cv/generate.post.ts    # server-side PDF generation
  utils/supabaseAdmin.ts   # service-role client, server-only
supabase/
  migrations/               # SQL migrations (schema + RLS policies)
content/ or data/           # (optional) static seed/fallback content only
```

## 8. Content Source of Truth

- check `docs/*.md` `{CV,Design,PRD,SRS}`
  All portfolio content (profile, skills, experience, projects, certifications, education) lives in Supabase tables, seeded initially from Nova's CV (see `PRD.md` §4 for the seed data derived from the CV). Do not hardcode this content into components — components must fetch from Supabase so the admin dashboard can update it without a redeploy.
