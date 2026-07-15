# PRD — Nova Sugiantara Portfolio & CV Builder

## 1. Overview

**Product name:** Nova Sugiantara Portfolio (novasugiantara.my.id)
**Owner:** Nova Sugiantara — Full Stack Web Developer (Laravel, Vue.js, React, AWS, Ruby on Rails)
**Type:** Personal portfolio website with an admin-managed CMS and a dynamic CV generator.

### 1.1 Problem Statement

Nova needs a professional, always-up-to-date portfolio site that recruiters and clients can browse, and a way to generate a polished, downloadable CV directly from the same structured data — instead of manually editing a CV file every time a role, project, or skill changes.

### 1.2 Goals

1. Present a credible, modern portfolio (experience, projects, skills, certifications) to recruiters/clients.
2. Let Nova manage all content himself through a simple admin dashboard — no code changes needed to update experience/projects.
3. Generate an up-to-date, downloadable PDF CV directly from the same data, with support for multiple saved CV variants (e.g., "Backend-focused", "Fullstack-focused").
4. Keep the data secure — only Nova can write; the public can only read published content.

### 1.3 Non-Goals (v1)

- Multi-user/multi-tenant portfolio platform (this is single-owner only).
- Public user accounts, comments, or social features.
- Real-time collaboration features.
- Multi-language / i18n (may be a future phase).

> Note: a **Blog** is now in scope for v1 (see §3.2 and navigation below) — it was previously deferred, but is now part of the public site's core navigation.

## 2. Target Users

| User                         | Needs                                                                        |
| ---------------------------- | ---------------------------------------------------------------------------- |
| Recruiters / hiring managers | Quickly see skills, experience, projects; download CV                        |
| Clients (freelance)          | See relevant project case studies, contact Nova                              |
| Nova (owner/admin)           | Update experience/projects/skills without redeploying; generate tailored CVs |

## 3. Key Features

### 3.0 Global Navigation

Public site uses a single top-level nav, present on every public page (via the `default` layout):

| Label      | Route                                | Notes                                                                              |
| ---------- | ------------------------------------ | ---------------------------------------------------------------------------------- |
| Home       | `/`                                  | Hero/landing                                                                       |
| Portofolio | `/projects` (nav label "Portofolio") | Combines About + Experience + Projects/Certifications/Education content (see §3.1) |
| Blog       | `/blog`, `/blog/[slug]`              | New in v1 — see §3.2                                                               |
| Contact    | `/contact`                           | Contact form + email + social links (see §3.1)                                     |

- **Admin is intentionally NOT part of this nav.** There is no visible link to `/admin` anywhere on the public site (header, footer, mobile menu, or sitemap). The owner reaches it only by typing the URL directly (`novasugiantara.web.id/admin`). This is a deliberate obscurity-plus-auth layer on top of the real security boundary, which remains Supabase Auth + RLS (see §7 in `SRS.md`) — omitting the nav link is not itself a security control, so `/admin/**` must still be fully protected by `middleware/auth.ts` and server-side session checks regardless of whether it's linked anywhere.
- `/admin` should also be excluded from `sitemap.xml` and disallowed in `robots.txt` so it isn't indexed or discoverable via search engines.
- A **floating WhatsApp button** (fixed bottom-right corner, all public pages) is part of the global layout, not just the Contact page — see §3.1 "Contact" below.

### 3.1 Public Portfolio Site

- **Hero/Home:** Name, title ("Full Stack Web Developer | Laravel | Vue.js | React | AWS | Ruby on Rails"), short summary, location (Batubulan, Bali, Indonesia), CTA to download CV / go to Contact.
- **Portofolio (nav label):** combines several content sections on one route (or sub-tabs within it):
  - **About:** Professional summary, technical skills grouped by category (Frontend, Backend, Databases, DevOps, Tools).
  - **Experience timeline:** Reverse-chronological list of roles, each with company, title, dates, bullet achievements — sourced from `experiences` table.
  - **Projects showcase:** Cards/grid of projects (e.g., Booking Engine, Zisu MLM Platform, Lait Bus, Eurekapp.biz migration, Minyak Taru Bali e-commerce, Videolegend.tv, NFT steganography system) with description, role, tech stack, links if available.
  - **Certifications & Education:** Universitas Terbuka (BIT, expected 2026), SMK TI Bali Global Denpasar (Software Engineering, 2021), Dicoding Back-End Development for Beginners.
- **Contact:**
  - A `/contact` page with a message form (rate-limited, spam-protected via honeypot/CAPTCHA), plus a visible **email address** (mailto: link) and other socials (LinkedIn).
  - A **floating WhatsApp button**: fixed-position circular button, bottom-right corner of the viewport, present on every public page (not only `/contact`). Tapping it opens `https://wa.me/<number>?text=<prefilled greeting>` in a new tab. Must have an accessible label (e.g. `aria-label="Chat on WhatsApp"`), sufficient tap target size (≥44×44px) for mobile, and must not obstruct core content or overlap other fixed UI (e.g., cookie banners) on small screens.
- **Download CV button:** Generates/downloads the latest published CV as PDF (available from Home and/or Portofolio).

### 3.2 Blog (new in v1)

- Public, SSR blog listing at `/blog` (reverse-chronological, published posts only) and a detail page at `/blog/[slug]`.
- Each post: title, slug, excerpt, cover image, body content (Markdown or rich text), tags, published date.
- Content authored/edited from the admin dashboard (Markdown editor is acceptable for v1; a WYSIWYG can come later).
- Draft vs. published via `is_published`, same pattern as other content tables.
- SEO: each post needs its own `useSeoMeta` (title, description, OG image), and should appear in the sitemap when published.
- Out of scope for v1: comments, likes, reading-time/related-posts widgets, RSS feed (nice-to-have, not required).

### 3.3 Admin Dashboard (auth-protected, owner-only)

- Login (Supabase Auth) at `/admin/login` — reachable only by direct URL, never linked from public nav (see §3.0).
- CRUD for: profile info, skills, experience entries, projects, certifications, education, **and blog posts**.
- Toggle `is_published` per item (draft vs. live on public site).
- Reorder items (e.g., drag-to-reorder experience/projects) — nice-to-have, can be manual `sort_order` field in v1.
- View submitted contact messages.

### 3.4 CV Generator

- Compose a CV document from live data (profile + selected experiences + selected skills + selected projects + education + certifications).
- Support **CV variants**: save a named selection/config (e.g., "Backend Role CV" vs "Fullstack Role CV") that picks which experience bullets/skills to emphasize or include.
- Export as PDF, downloadable from both admin dashboard and public site (public always gets the variant marked "default/published").
- Regenerating CV should not require manual document editing — it's always derived from current structured data.

## 4. Seed Content (derived from current CV)

Used to pre-populate the database on first migration:

- **Profile:** Nova Sugiantara, Full Stack Web Developer, Batubulan Bali Indonesia, novasugiantara325@gmail.com, +62 881-0802-90643, linkedin.com/in/novasugiantara, novasugiantara.my.id
- **Summary:** 4+ years building scalable web apps; specialization in JS (React, Vue), PHP (Laravel), Ruby on Rails; expertise in payment integrations, booking systems, blockchain solutions.
- **Skills:**
  - Frontend: Vue.js, React, Redux.js, JavaScript, HTML5, CSS3
  - Backend: Laravel, Ruby on Rails, Node.js, Go, PHP
  - Databases: PostgreSQL, MySQL
  - DevOps: AWS, Docker, CI/CD
  - Tools: Git, RESTful APIs, Payment Gateways (Midtrans, PayPal), Blockchain Integration
- **Experience:**
  1. PT. Omni Hotelier International — Intermediate Fullstack Developer (May 2025–Present)
  2. PT. Omni Hotelier International — Junior Full Stack Developer (Feb 2023–Jun 2025)
  3. Freelance Fullstack Developer (Jun 2021–Present)
  4. Baliola — Backend Developer (Aug 2022–Feb 2023)
  5. Bali Gatra — Web Developer (Jul 2021–Jul 2022)
     (each with its bullet achievements from the CV)
- **Projects:** Booking Engine, Activity Booking System, Zisu MLM Platform, Lait Bus Booking System, Eurekapp.biz migration, Minyak Taru Bali e-commerce, NFT Steganography System, Videolegend.tv
- **Education:** Universitas Terbuka (BIT, expected 2026); SMK TI Bali Global Denpasar (Software Engineering Diploma, 2021)
- **Certifications:** Back-End Development for Beginners (Dicoding)

## 5. Success Metrics

- Portfolio loads and is fully readable with JS disabled (SSR).
- Admin can add/edit an experience entry and see it live on the public site within seconds, without a deploy.
- CV PDF generated from data matches source-of-truth content (no manual copy-paste drift).
- Zero public write access to the database (verified via RLS policy tests).

## 6. Phased Rollout

| Phase | Scope                                                                                                                                                              |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1     | DB schema + RLS (incl. `blog_posts`), public read-only portfolio pages rendering seeded data, global nav (Home/Portofolio/Blog/Contact) + floating WhatsApp button |
| 2     | Admin auth + CRUD dashboard for all content types, including blog posts                                                                                            |
| 3     | CV generator (single default variant → PDF)                                                                                                                        |
| 4     | Multiple CV variants + contact form + Blog polish (SEO per post, sitemap inclusion) + general polish (animations, analytics)                                       |

## 7. Open Questions / Assumptions

- Assuming single owner/admin only — no multi-user roles needed (confirmed by "sesuaikan dengan CV saya").
- Assuming PDF CV generation happens server-side (Nuxt server route) rather than client-side, for consistent rendering — see `SRS.md` for rationale.
- Deployment target not specified; SRS assumes a Node-capable host (e.g., Vercel/Node server) since server routes + PDF generation need a server runtime, not pure static hosting.
