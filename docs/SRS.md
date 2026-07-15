# SRS — Nova Sugiantara Portfolio & CV Builder

Companion to `PRD.md`. This document specifies the technical implementation: architecture, database schema, security model, and APIs.

> Before implementing anything in this document, read the local skills `~/.agents/skills/supabase-postgres-best-practices` and `~/.agents/skills/supabase` — they take precedence on migration/query conventions.

## 1. System Architecture

```
Browser
  │
  ├── Public pages (SSR via Nuxt) ──► Nuxt server ──► Supabase (anon key, RLS-restricted read)
  │
  ├── Admin dashboard (client, behind auth middleware)
  │        │
  │        └──► Nuxt server/api/admin/** ──► Supabase (session-scoped, RLS-restricted write)
  │
  └── CV download ──► Nuxt server/api/cv/generate ──► Supabase (service role, read) + PDF renderer ──► PDF stream
```

- **Frontend:** Nuxt 4 (Vue 3, SSR mode), Tailwind CSS v4, shadcn-vue.
- **Backend:** Nuxt server routes (`server/api/**`) acting as the only place the service role key is used.
- **Database/Auth/Storage:** Supabase (Postgres + Row Level Security, Supabase Auth, Supabase Storage for images/avatar).
- **PDF generation:** server-side rendering of an HTML CV template to PDF (e.g., via a headless-rendering approach invoked from a Nuxt server route). Chosen over client-side generation so output is consistent regardless of browser and so the service role can pull complete data without exposing it to the client.

## 2. Environments & Secrets

| Variable                             | Scope           | Notes                                                               |
| ------------------------------------ | --------------- | ------------------------------------------------------------------- |
| `SUPABASE_URL`                       | public          | project URL, safe to expose                                         |
| `SUPABASE_PUBLISHABLE_KEY` (anon)    | public          | RLS-restricted, safe to expose                                      |
| `SUPABASE_SERVICE_ROLE_KEY`          | **server-only** | never in `runtimeConfig.public`, never sent to client, never logged |
| `SESSION/JWT secret (if any custom)` | server-only     |                                                                     |

`.env` is git-ignored; `.env.example` lists variable names only.

## 3. Database Schema

All tables live in the `public` schema unless noted. `owner_id uuid references auth.users(id)` is used on every content table so ownership is explicit and policies are simple (single-owner app today, but this also makes the schema safely extensible later).

```sql
-- profile: singleton row per owner
create table profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  headline text not null,
  summary text,
  location text,
  email text,
  phone text,
  linkedin_url text,
  website_url text,
  avatar_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  category text not null,        -- e.g. 'Frontend', 'Backend', 'Databases', 'DevOps', 'Tools'
  name text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table experiences (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  company text not null,
  role text not null,
  location text,
  start_date date not null,
  end_date date,               -- null = present
  bullets text[] not null default '{}',
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  tech_stack text[] not null default '{}',
  role text,
  project_url text,
  repo_url text,
  cover_image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table education (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  institution text not null,
  degree text not null,
  start_date date,
  end_date date,               -- null if expected/ongoing
  is_expected boolean not null default false,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table certifications (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  issuer text not null,
  issued_date date,
  credential_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table cv_variants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                   -- e.g. 'Backend-focused'
  is_default boolean not null default false,
  included_experience_ids uuid[] not null default '{}',
  included_project_ids uuid[] not null default '{}',
  included_skill_ids uuid[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,          -- Markdown source, rendered client/server-side on read
  cover_image_url text,
  tags text[] not null default '{}',
  published_at timestamptz,       -- set when first published; null while draft
  is_published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);
```

Indexes: add btree indexes on `owner_id`, `is_published`, and `sort_order` per table as query patterns require (follow the Postgres best-practices skill for naming/migration conventions).

## 4. Row Level Security (RLS)

**RLS is enabled on every table above, no exceptions.** Default posture: deny all, then allow narrowly.

```sql
alter table profiles enable row level security;
alter table skills enable row level security;
alter table experiences enable row level security;
alter table projects enable row level security;
alter table education enable row level security;
alter table certifications enable row level security;
alter table cv_variants enable row level security;
alter table blog_posts enable row level security;
alter table contact_messages enable row level security;

-- Public read: anon can SELECT only published rows
create policy "public read published profile"
  on profiles for select
  to anon
  using (is_published = true);

create policy "public read published skills"
  on skills for select to anon using (is_published = true);

create policy "public read published experiences"
  on experiences for select to anon using (is_published = true);

create policy "public read published projects"
  on projects for select to anon using (is_published = true);

create policy "public read published education"
  on education for select to anon using (is_published = true);

create policy "public read published certifications"
  on certifications for select to anon using (is_published = true);

create policy "public read published blog posts"
  on blog_posts for select to anon using (is_published = true);

-- Owner full access (authenticated, matches owner_id) on all content tables
create policy "owner manage profile"
  on profiles for all
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- (repeat the same "owner manage X" pattern for skills, experiences, projects,
--  education, certifications, cv_variants, blog_posts)

-- contact_messages: anyone (anon) can INSERT, nobody can SELECT except owner
create policy "public can submit contact message"
  on contact_messages for insert
  to anon
  with check (true);   -- validation/rate limiting handled at the server route, not RLS

create policy "owner reads contact messages"
  on contact_messages for select
  to authenticated
  using (auth.uid() in (select owner_id from profiles limit 1));
```

Rules to enforce during implementation:

- No policy ever grants `anon` `insert`/`update`/`delete` on content tables (profiles, skills, experiences, projects, education, certifications, cv_variants, blog_posts).
- `contact_messages` is the one exception (public insert only), and even that goes through server-side validation + rate limiting before hitting the DB, not just RLS.
- `cv_variants` is never publicly readable directly — CV data is served through a server route (`/api/cv/generate`) that assembles the PDF and enforces which variant is "public/default", rather than exposing the raw table to anon.

## 5. Public Navigation & Routing

- Public layout (`layouts/default.vue`) renders one persistent top-level nav across all public pages: **Home** (`/`), **Portofolio** (`/projects`), **Blog** (`/blog`), **Contact** (`/contact`).
- `/admin/**` routes are deliberately excluded from this nav (no header/footer/mobile-menu link), from `sitemap.xml`, and disallowed in `robots.txt`. Reaching `/admin` requires typing the URL directly. This is UX obscurity only — it does not replace the actual security boundary (Supabase Auth session check in `middleware/auth.ts` + server-side re-validation in every `server/api/admin/**` route, per §6 below and §8 item 3).
- A global `WhatsAppFloatButton.vue` component is mounted once in `layouts/default.vue` (not per-page), fixed-position bottom-right, `z-index` high enough to stay above page content but below any modal/dialog layer. Links to `https://wa.me/<number>` with a prefilled greeting; number/greeting text sourced from `runtimeConfig.public` (not hardcoded) or the `profiles` table so it stays editable without a redeploy. No PII beyond the already-public WhatsApp number is exposed.

## 6. Authentication

- Supabase Auth, email/password (or magic link) for a single admin account.
- No public sign-up route/UI. Admin user provisioned manually via Supabase dashboard/CLI.
- Nuxt route middleware (`middleware/auth.ts`) protects all `/admin/**` pages: checks Supabase session, redirects to `/admin/login` if absent.
- Server API routes under `server/api/admin/**` re-validate the session server-side (never trust the client-side redirect alone) before performing any write.

## 7. API Surface (Nuxt server routes)

| Route                    | Method          | Auth                                             | Purpose                  |
| ------------------------ | --------------- | ------------------------------------------------ | ------------------------ |
| `/api/profile`           | GET             | public                                           | published profile        |
| `/api/experiences`       | GET             | public                                           | published experiences    |
| `/api/projects`          | GET             | public                                           | published projects       |
| `/api/skills`            | GET             | public                                           | published skills         |
| `/api/blog`              | GET             | public                                           | published blog posts (list) |
| `/api/blog/[slug]`       | GET             | public                                           | single published post    |
| `/api/contact`           | POST            | public (rate-limited)                            | submit contact message   |
| `/api/admin/profile`     | PUT             | session required                                 | update profile           |
| `/api/admin/experiences` | POST/PUT/DELETE | session required                                 | CRUD experience          |
| `/api/admin/projects`    | POST/PUT/DELETE | session required                                 | CRUD project             |
| `/api/admin/skills`      | POST/PUT/DELETE | session required                                 | CRUD skill               |
| `/api/admin/blog-posts`  | POST/PUT/DELETE | session required                                 | CRUD blog post           |
| `/api/admin/cv-variants` | POST/PUT/DELETE | session required                                 | manage CV variants       |
| `/api/cv/generate`       | GET/POST        | public (default variant) / session (any variant) | generate & stream PDF    |

All `POST`/`PUT`/`DELETE` request bodies validated with `zod` schemas before touching Supabase.

## 8. Security Requirements Summary

1. RLS enabled + tested on every table (see §4). Add automated tests (e.g., via `pgTAP` or integration tests hitting the anon client) that assert anon **cannot** write to any content table.
2. Service role key confined to server routes only; verified by grep/lint rule that `SUPABASE_SERVICE_ROLE_KEY` never appears in any file under `app/`.
3. All admin server routes re-check `auth.uid()`/session server-side — client-side route guards are UX only, not security boundaries.
4. Input validation (`zod`) on every write endpoint; reject unknown fields.
5. Rate limiting + honeypot on `/api/contact` (the only public write endpoint).
6. File uploads (avatar, project cover images) restricted by MIME type and size at both client and server, stored in a dedicated Supabase Storage bucket with its own access policy (public read for published assets only, owner-only write).
7. No sensitive data (email, phone) exposed beyond what's in the published profile intentionally shown on the public site.
8. HTTPS enforced in production (handled by hosting platform); no mixed content.
9. Dependency hygiene: keep `@supabase/supabase-js`, Nuxt, and PDF-generation deps patched; avoid unmaintained third-party packages for PDF rendering.
10. `/admin/**` is never linked from public nav/sitemap and is disallowed in `robots.txt` (see §5) — but this is a UX/discoverability measure only; the real boundary is Supabase Auth + RLS + server-side session re-validation (item 3 above), so `/admin` must remain fully protected even if its URL becomes known.
11. Blog post `content` (Markdown) is rendered with a sanitizing Markdown renderer to prevent stored-XSS via raw HTML/script injection in post bodies, even though only the owner can write posts (defense in depth).

## 9. Non-Functional Requirements

- **Performance:** Public pages should achieve good Core Web Vitals (SSR, optimized images via `@nuxt/image`, minimal client JS on first paint).
- **Accessibility:** WCAG AA on all public-facing pages.
- **SEO:** Per-page meta tags, OpenGraph image, sitemap, `robots.txt` (already present) allowing indexing.
- **Reliability:** CV generation endpoint should degrade gracefully (clear error message) if PDF rendering fails, without leaking stack traces to the client.
- **Maintainability:** Content changes require zero code deploys — all done via the admin dashboard.

## 10. Out of Scope (v1)

- Multi-admin roles/permissions.
- Public commenting/likes on projects or blog posts.
- Blog comments, RSS feed, related-posts/reading-time widgets.
- i18n (multi-language) — may be phase 2.
