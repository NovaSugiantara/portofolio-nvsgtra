# Homepage Sample Parity and Resilient Fallback

## Status

Approved design direction. This specification replaces the previous sticky-video-only presentation with a sample-led homepage composition and section-level fallback behavior. This revision expands the spec to implementation-ready detail and defines exactly what "matches `sample-page/index.html`" means at the level of DOM structure, copy, interaction, and token mapping — so a build can proceed without re-deriving intent from the static file by hand.

## Goal

Make the Nuxt homepage visually and structurally match `sample-page/index.html` while preserving live Supabase content, SSR, public routes, SEO, accessibility, and a desktop-only `hero-bg.webm` enhancement.

## Design Principles

- `sample-page/index.html` is the primary visual and structural reference. Preserve its strongest composition decisions while correcting accessibility, responsive, content, and implementation weaknesses.
- `docs/DESIGN.md` remains authoritative for tokens, accessibility, responsive behavior, and content-first hierarchy.
- Safe live profile and skill data wins independently per section. Projects and experience use reviewed CV copy so unrestricted database content cannot reintroduce sensitive metrics.
- Fallback content must come only from the sample page or verified content in `docs/CV.md`.
- The video is decorative enhancement, never a requirement for readable content.
- Use the smallest change that preserves the current Nuxt architecture. Replace the two previous self-hosted sans-serif font packages with Inter without increasing the dependency count or redesigning unrelated routes.
- **"Matches" means the compiled visual structure, not the file or literal copy.** The sample ships a `<script src="cdn.tailwindcss.com">`, an inline Tailwind config, an inline dark-mode script, and CDN `<script>` tags for `lucide` and `@motionone/dom`. None of those delivery mechanisms are ported. Preserve the section order, proportions, grid rhythm, responsive behavior, and interaction intent. Rewrite visible copy from `docs/CV.md` and the content restrictions in this specification.

## Content privacy override

This section overrides any older copy examples elsewhere in this document.

- Do not publish transaction counts, booking counts, payment volume, financial totals, or operational scale metrics
- Do not emphasize booking or payment systems in hero, project, metric, or experience copy
- General descriptions of hospitality, reservation, integration, and production responsibilities are allowed when they contain no sensitive scale or financial claims
- Use only factual profile, experience, project, education, certification, skill, and contact information supported by `docs/CV.md`
- Prefer professional responsibilities and technical judgment over numerical proof
- Live profile free text is not reviewed for these restrictions. The homepage may use `full_name`, `location`, `email`, `linkedin_url`, `website_url`, and `avatar_url`; role, headline, summary, projects, and experience use reviewed fallback copy.

## Relationship to the Prior Sticky-Video Specification

This spec supersedes the earlier "Homepage Sticky Video Redesign" spec's _hero content model and full-bleed sticky treatment_. It does **not** supersede that spec's accessibility, performance, or reduced-motion rules for the video itself — those carry forward unchanged. Specifically:

| Prior spec said                                                         | This spec says                                                                                                                                                                 | Resolution                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero copy is at most 4 elements: role, name, 20-word summary, CTA group | Hero follows the sample: availability badge, location/timezone meta, role eyebrow, full headline sentence, body paragraph, two CTAs, plus a separate profile-focus aside panel | Sample structure wins. See Hero Section below for the exact element list.                                                                                                                                                                                                                                                                                                                                                           |
| Primary CTA "View projects", secondary CTA "Download CV"                | Sample's CTAs are "View selected work" (→ `#projects`) and "Contact me" (→ `mailto:`)                                                                                          | Sample copy and destinations win. There is no CV-download CTA in this version.                                                                                                                                                                                                                                                                                                                                                      |
| Outer hero stage ~170dvh, full-bleed sticky panel with scrim over video | Sample hero is a two-column `grid` (copy column + aside panel) with a small decorative pattern occupying the right half at large widths, not a full-bleed video background     | Sample layout wins. The video becomes a decorative layer inside the sample's existing right-side decorative slot — see Hero Video Lifecycle.                                                                                                                                                                                                                                                                                        |
| Visual System: heading Outfit, body Plus Jakarta Sans                   | Sample uses Inter for both heading and body                                                                                                                                    | This spec's Inter direction wins per its own explicit "align typography with the sample's Inter... direction" instruction. **Flag for confirmation**: this is a font change from a previously-approved system, not an oversight — confirm with whoever owns `docs/DESIGN.md` before merging, since it affects every page that shares tokens, not just the homepage.                                                                 |
| Motion: no scroll listeners; scroll-driven work happens in CSS          | Sample uses `IntersectionObserver` for entrance reveals and for active-nav-link tracking                                                                                       | Not a conflict. An `IntersectionObserver` is not a `scroll`/`scrollend` event listener and does not run per-frame; it is the correct tool for one-time "has this section entered the viewport" checks. The "no scroll listeners, CSS-only scroll-driven motion" rule still governs the hero's own entry/exit choreography specifically (see Hero Video Lifecycle); it does not forbid `IntersectionObserver` elsewhere on the page. |
| Do not add GSAP, Motion, or another animation package                   | Sample loads `@motionone/dom` from a CDN                                                                                                                                       | Do not port this. Reading the sample's own inline `<script>`, `@motionone/dom` is loaded but never called — every animated effect on the page (`.reveal`, hover states, nav underline) is done with plain CSS transitions plus the `IntersectionObserver` toggling a class. Treat the Motion One `<script>` tag as dead weight in the reference file, not a requirement, and do not add the package.                                |

## Content and Data Flow

Profile and skill sections resolve their own display data:

```text
safe live section data when populated
        ↓ otherwise
verified local fallback section data
```

Sections:

| Section      | Live source         | Fallback source                 | Failure behavior                                        |
| ------------ | ------------------- | ------------------------------- | ------------------------------------------------------- |
| Hero/profile | Safe identity and contact fields from `useProfile` | sample page and `docs/CV.md` | Render reviewed role, headline, summary, and fallback identity |
| Snapshot     | N/A                 | verified CV profile facts       | Always render non-sensitive professional facts          |
| Projects     | N/A on the homepage | sample page and CV project work | Always render reviewed, non-sensitive project summaries |
| Experience   | N/A on the homepage | sample page and CV experience   | Always render reviewed, non-sensitive role summaries    |
| Capabilities | `useSkills`         | CV technical skills             | Render fallback groups when live data is empty or fails |
| Contact      | Static/profile data | CV contact details              | Render the existing safe contact route and links        |

Fallback records will live in `app/data/homeFallback.ts` so content is not duplicated across template branches. The module will export typed readonly values and contain no API or browser side effects.

Safe live profile and skill data replaces fallback data per section, not for the entire page. Projects and experience remain curated homepage summaries; their dedicated routes can continue using published Supabase records.

`homeFallback.ts` contains reviewed sample and CV content. Every factual claim must be traceable to `sample-page/index.html` or `docs/CV.md`. The Structural Parity Map defines the intended hierarchy, but the content privacy override permits factual rewrites that remove sensitive or unsupported claims.

## Homepage Composition

The Nuxt page will follow the sample's order:

1. Sticky global header from the existing layout.
2. Hero with role, name, concise summary, two CTAs, and a professional focus panel.
3. Professional snapshot using non-sensitive CV facts.
4. Selected projects with one dominant project and varied supporting tiles.
5. Experience with a sticky section heading and sparse role entries.
6. Engineering approach and capabilities.
7. One focused contact CTA.
8. Existing footer and global WhatsApp button.

The implementation keeps semantic HTML, one `h1`, sequential headings, existing route destinations, and independent loading/error semantics. Project cards remain understandable without hover, and technology labels stay secondary to contribution and outcome.

Note on item 2's wording: the sample's hero content column does not itself repeat the person's literal name — the name lives in the persistent sticky header (visible for the entire scroll), the document `<title>`, and SEO metadata (meta description, JSON-LD). "Name" in this list is satisfied by that persistent header/metadata, not by adding a name string inside the hero copy column that the sample doesn't have — adding one would break 1:1 parity.

## Structural Parity Map

This section is the section-by-section transcription of `sample-page/index.html` into an implementation blueprint. Where the sample's copy is used as fallback content, it is quoted here as the literal string to store in `homeFallback.ts` (subject to the one correction noted under Typography and Copy Voice). Class names below describe _what the sample does visually_, to be re-expressed with the project's existing token/utility system — they are not a literal port of the sample's Tailwind classes.

### Skip Link

- A visually-hidden-until-focused link, first focusable element in the DOM, targeting `#main`, text "Skip to content".

### Header / Navigation

- `position: sticky; top: 0`, translucent/blurred background, bottom hairline border, height ~80px (`h-20`), full-bleed.
- Brand block (links to `#home`, `aria-label="Nova Sugiantara home"`): a small square monogram badge "NS", plus a two-line name/title stack ("Nova Sugiantara" / "Full Stack Developer") hidden below `sm`.
- Primary nav (hidden below `md`, i.e. inside the mobile menu instead): five links — Home (`#home`), Projects (`#projects`), Experience (`#experience`), About (`#about`), Contact (`#contact`). The currently-active section's link carries `aria-current="page"` and a small accent underline; this is JS-driven (see Interactive Behavior Parity), not a static default beyond `Home` at initial load.
- Theme toggle button: `aria-label="Switch color theme"`, shows a moon icon in light mode and a sun icon in dark mode (icons swap via the `dark` class, not via separate JS state).
- "Start a conversation" CTA: `mailto:` link, visible from `sm` up, hidden on the smallest widths where the mobile menu button takes its place.
- Mobile menu toggle button: visible below `md` only, `aria-expanded` (`true`/`false`), `aria-controls="mobile-menu"`, `aria-label` toggling between "Open navigation menu" / "Close navigation menu", icon-only (`menu` icon).
- Mobile menu panel (`#mobile-menu`): hidden by default, toggled by the button above; contains the same five links stacked vertically, full-width tap targets; selecting any link closes the menu and resets the toggle button's `aria-expanded`/label.

### Hero Section (`#home`)

Two-column layout at `lg` and above (content column ~1.35fr, aside panel ~0.65fr), single column below that. A subtle dot-pattern decorative texture occupies the right half of the section, `aria-hidden`, visible only at `lg` and above in the sample — see Hero Video Lifecycle for how this slot is reconciled with the 768px video breakpoint used elsewhere in this spec.

**Content column**, top to bottom:

1. Profile pill: "Full Stack Web Developer". Do not imply current availability unless the live profile provides it explicitly.
2. A secondary meta line: "Batubulan, Bali, Indonesia · UTC+8".
3. Eyebrow, role: "FULL STACK WEB DEVELOPER" — live-backed (profile role, upper-cased for display), fallback is this string.
4. `h1` headline: "Full stack engineering from product idea to production." This is a concise interpretation of the CV's end-to-end product work.
5. Body paragraph: "I design and ship web applications with React, Vue, Laravel, Ruby on Rails, Go, and AWS. I also lead planning, code review, mentorship, and production problem solving."
6. CTA group, two buttons:
   - Primary: "View selected work", anchor to `#projects`, trailing `arrow-down-right` icon.
   - Secondary: "Contact me", `mailto:` link, trailing `mail` icon.

**Aside panel** (`aria-label="Professional profile summary"`), top to bottom:

1. Header row: eyebrow "CURRENT FOCUS", `h2` "Product-minded engineering", and a small icon badge (`workflow` icon) — this heading text is fallback copy; if live data ever supplies a "current focus" field, it replaces this pair without changing the panel's layout.
2. A `dl` of four fields, each `dt`/`dd` pair:
   - "Primary stack" → "Laravel, Vue, React, PostgreSQL"
   - "Product work" → "Web platforms, integrations, and internal workflows"
   - "Team contribution" → "Planning, reviews, mentoring, incident response"
   - "Exploring now" → "AI-assisted product workflows and agents"
3. Footer row: two external links, "GitHub" (`https://github.com/NovaSugiantara`) and "LinkedIn" (`https://linkedin.com/in/novasugiantara`), both `target="_blank" rel="noreferrer"`, each with a trailing `external-link` icon and an accessible indication that they open in a new tab.

### Professional snapshot section

- `aria-label="Professional snapshot"`, full-bleed background using the alternate surface token, bordered container.
- A 2-column grid on mobile, 4-column from `sm` up, cells separated by hairline dividers (`divide-x divide-y`), not individual cards.
- Four cells preserve the sample's compact proof-strip composition without exposing sensitive operational metrics:

| Value      | Label                                      |
| ---------- | ------------------------------------------ |
| 4+ years   | Designing and shipping production web apps |
| Full stack | Frontend, backend, data, and infrastructure |
| Team work  | Planning, code review, and mentorship       |
| Bali UTC+8 | Based in Batubulan, Indonesia               |

### Selected Work Section (`#projects`)

- Header row: eyebrow "SELECTED PROJECTS", `h2` "Evidence over adjectives.", supporting paragraph "A curated set of systems where my contribution can be explained through responsibility, decisions, and measurable outcomes.", and a secondary link "Explore GitHub" (→ `https://github.com/NovaSugiantara`, new tab) with a trailing `arrow-up-right` icon.
- A 12-column grid on `lg` and above, single column below. Five tiles in this order, spans as shown — this is the canonical shape for however many projects are actually available; when live project count is not exactly 5, keep the same dominant-first ordering and degrade span proportions per project count, per the original spec's "compute spans from order/count, not from content length" rule, rather than forcing a 5-slot layout with empty cells.

**Tile 1 — dominant (7 of 12 columns):**

- Eyebrow "PRODUCT ENGINEERING", small tag "Lead role".
- `h3` "Omni Hotelier product engineering".
- Description: "Led full stack product delivery from technical planning and task breakdown through code review, cross-team coordination, and production support."
- A `dl` pair: "Contribution" → "Planning, delivery leadership, code review, incident triage"; "Collaboration" → "Product, quality assurance, and engineering coordination".
- Technology tags: Laravel, React, Redux, REST APIs.

**Tile 2 — inverse/highlight (5 of 12 columns), dark surface regardless of page theme:**

- Eyebrow "PLATFORM DELIVERY".
- `h3` "Zisu business platform".
- Description: "Built a Laravel platform with account, network, and operational workflows for a real business environment."
- A contribution callout: label "Role", value "Full Stack Developer", caption "Application architecture and product delivery".
- Technology list: "Laravel · JavaScript · MySQL · REST APIs".

**Tiles 3–5 — standard (4 of 12 columns each):**

| Eyebrow    | Title                    | Description                                                                                              | Outcome line                          |
| ---------- | ------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| MIGRATION  | Eurekapp.biz rebuild     | Migrated a WordPress site to a custom stack for clearer ownership, maintainability, and delivery control. | Custom application stack              |
| BLOCKCHAIN | NFT steganography system | Developed blockchain services with Ruby on Rails and PostgreSQL plus an NFT steganography system in Go.  | Backend and data workflow engineering |
| STREAMING  | Videolegend.tv           | Built a PHP streaming platform and a responsive interface for broad browser support.                     | Full stack web delivery               |

- Missing cover media/imagery is not a concern here — the sample's project tiles are entirely typography-led already (no screenshots), which already matches the "typography-led tile, not a fake screenshot" rule from the prior spec.

### Experience Section (`#experience`)

- Full-bleed alternate-surface background, bordered top and bottom.
- Two-column layout at `lg` and up (sticky heading column ~0.65fr, sticky at `top: 112px` in the sample to clear the 80px header plus spacing; entries column ~1.35fr), single column below `lg`.
- Sticky column: eyebrow "EXPERIENCE", `h2` "Growing from builder to technical coordinator.", paragraph "My progression reflects increasing ownership across architecture, delivery, team quality, and production reliability."
- Entries column, reverse-chronological list, one hairline-bordered card-free... **correction**: the sample actually renders each entry inside its own bordered/surfaced card (`rounded-2xl border ... bg-surface`), not the single-divider-between-entries treatment described in the prior spec. Since this spec's job is 1:1 parity with the sample, the card-per-entry treatment from the sample wins here; the prior spec's "one divider, no per-entry card" rule is superseded for this section specifically.

Three entries:

1. **PT. Omni Hotelier International** — "Product Coordinator / Lead Team Product Developer" — May 2025 to Present. Description: "Own planning and delivery for a production web product while coordinating product, quality assurance, and engineering decisions." Four contribution bullets: "Translate business requirements into engineering work", "Review pull requests and guide implementation quality", "Triage production issues by business impact", "Keep sprint delivery aligned across disciplines".
2. **PT. Omni Hotelier International** — "Intermediate Fullstack Developer" — May 2024 to May 2025. Description only: "Built integrations, improved third-party compatibility, mentored junior developers, and contributed to production applications."
3. **Freelance · Baliola · Bali Gatra** — "Full Stack and Backend Engineering" — 2021 to Present. Description only: "Delivered commerce, transportation, streaming, blockchain, and business platforms using Laravel, Rails, Go, and modern frontend tools."

Date-range formatting note: see Typography and Copy Voice — the sample renders these ranges with an em dash; this spec corrects that to a regular hyphen in the actual implementation.

### About / Approach Section (`#about`)

Two parts, both under the `about` id.

**Part one** — two-column at `lg` (text left, cards right), single column below:

- Left: eyebrow "ENGINEERING APPROACH", `h2` "Practical architecture, clear ownership, calm execution.", paragraph "I work best where product decisions and technical constraints meet. I prefer small, reversible changes, explicit contracts, observable failure paths, and code that another engineer can safely continue."
- Right: a 2×2 grid of small bordered cards, each with an icon, a title, and one supporting sentence:

| Icon               | Title                     | Description                                                       |
| ------------------ | ------------------------- | ----------------------------------------------------------------- |
| `shield-check`     | Production responsibility | Prioritize data safety, failure recovery, and real user impact.   |
| `git-pull-request` | Maintainable delivery     | Use reviews, clear boundaries, and incremental implementation.    |
| `users`            | Cross-team clarity        | Translate constraints between product, QA, and engineering.       |
| `sparkles`         | AI with purpose           | Explore agents and LLM features when they improve real workflows. |

**Part two** — three capability-group cards on a muted surface, 1 column on mobile, 2 on `md`, 3 on `lg`:

| Title                   | Description                                                               |
| ----------------------- | ------------------------------------------------------------------------- |
| Backend engineering     | Laravel, Ruby on Rails, Node.js, Go, APIs, and integrations.              |
| Frontend development    | Vue.js, React, Redux, responsive UI, accessible interaction patterns.     |
| Infrastructure and data | PostgreSQL, MySQL, AWS, Docker, CI/CD, production debugging.              |

This maps to the "Capabilities" section from the prior spec's data model (`useSkills`, category groups). Where live skills data exists, each Supabase category becomes one of these cards (or more, if there are more than three published categories); the description line becomes the comma-joined list of published skill names in that category rather than the fixed sentence shown above, which is fallback-only copy.

### Contact Section (`#contact`)

- Full-bleed section using the inverse/dark brand surface regardless of page theme (this is an intentional exception to "keep the section in the active page theme," carried over from the sample as the canonical closing-section treatment for this spec).
- Two-column at `lg` (message ~1.1fr, info panel ~0.9fr), single column below.
- Left: eyebrow "LET'S BUILD SOMETHING RELIABLE", `h2` "Need an engineer who can connect product intent with production reality?", paragraph "I am open to full stack, backend, product engineering, and selected freelance opportunities where ownership and technical judgment matter.", and one primary CTA: the email address itself as the link text, `nvsgtra425@gmail.com`, `mailto:` link, trailing `arrow-up-right` icon.
- Right: a bordered translucent panel containing a `dl` of three fields —

| Field             | Value                      |
| ----------------- | -------------------------- |
| Location          | Batubulan, Bali, Indonesia |
| Preferred contact | Email or LinkedIn          |
| Typical response  | Within two business days   |

— followed by a hairline-divided row of two links, "LinkedIn" and "GitHub", same URLs as the hero aside panel.

This satisfies the prior spec's "one focused contact CTA, do not repeat project or blog CTAs" — the LinkedIn/GitHub links are professional profile links, not project or blog CTAs, so they don't violate that rule.

### Footer

- Full-bleed, same inverse/dark surface as the contact section.
- Left: "© {current year} Nova Sugiantara. Built with semantic HTML and progressive enhancement." — the year is computed at runtime, not hard-coded.
- Right: "Back to top" link, anchor to `#home`, trailing `arrow-up` icon.

### Floating WhatsApp Button

- Fixed position, bottom-right, circular, `message-circle` icon, `aria-label="Chat with Nova on WhatsApp"`.
- `href="https://wa.me/62881080290643?text=Hi%20Nova%2C%20I%20would%20like%20to%20discuss%20a%20project."`, `target="_blank" rel="noreferrer"`.
- This is explicitly out of scope to redesign per the prior spec's non-goals ("Redesigning... WhatsApp behavior"); reproduce it as-is, including the prefilled message text and phone number, unless a more current value already exists in the live layout component the site currently uses (in which case the live layout's existing button wins over this markup — do not maintain two WhatsApp buttons).

## Interactive Behavior Parity

Each JS behavior in the sample is re-expressed with Vue/Nuxt idioms rather than the vanilla DOM calls shown in the reference:

| Behavior                    | Sample implementation                                                                                                                                                                                                                             | Nuxt implementation note                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dark mode FOUC prevention   | Blocking inline `<script>` in `<head>` reading `localStorage` + `prefers-color-scheme` before paint                                                                                                                                               | Reproduce the same before-paint check via an inline script registered through `useHead`/`app.vue` (or the project's existing color-mode mechanism if one is already installed) so there is no flash of the wrong theme on load. Do not add a new color-mode package if one isn't already a dependency — a small inline script matching the sample's logic is sufficient and is what the sample itself does.                                                                                                                                                          |
| Theme toggle                | Click handler toggling `.dark` class on `<html>`, persisting to `localStorage['nova-theme']`, and syncing `<meta name="theme-color">`                                                                                                             | A small composable (`useTheme` or similar) wrapping the same three responsibilities: toggle class, persist choice, sync `theme-color`. Keep the `aria-label="Switch color theme"` and the moon/sun icon swap driven by the `dark` class (CSS `dark:hidden` / `dark:block` equivalents), not by separate reactive icon state, to avoid a hydration mismatch between server-rendered icon and client theme.                                                                                                                                                            |
| Mobile menu                 | Click handler toggling `hidden` class, `aria-expanded`, and `aria-label`; auto-closes on link click                                                                                                                                               | A `ref<boolean>` bound to the panel's visibility and to `aria-expanded`; closing on link click is a `@click` handler on each link, not a global document listener.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Section reveal on scroll    | `IntersectionObserver` adding `.is-visible` once per element, threshold `0.12`, `rootMargin: '0px 0px -40px 0px'`; skipped entirely (all marked visible immediately) if `prefers-reduced-motion: reduce` or `IntersectionObserver` is unsupported | A small directive/composable doing the same observe-once-then-unobserve pattern, gated behind the same reduced-motion check. This is section-entrance motion, distinct from the hero's own CSS `animation-timeline` choreography specified in the prior spec — the two mechanisms are allowed to coexist since neither is a continuous scroll-event listener.                                                                                                                                                                                                        |
| Active nav-link tracking    | A second `IntersectionObserver` over `main section[id]`, `rootMargin: '-35% 0px -55% 0px'`, toggling `aria-current` on the matching nav link                                                                                                      | Same pattern, implemented as a composable keyed off the same five section ids, updating a single reactive "active section id" that both the desktop nav and (optionally) the mobile menu read from.                                                                                                                                                                                                                                                                                                                                                                  |
| Footer year                 | `new Date().getFullYear()` set on mount                                                                                                                                                                                                           | Compute at render time in the template/script (`const year = new Date().getFullYear()`); safe to compute during SSR since it doesn't depend on client-only APIs.                                                                                                                                                                                                                                                                                                                                                                                                     |
| Icon rendering              | `lucide.createIcons()` from a CDN UMD build                                                                                                                                                                                                       | The project has no matching local icon set. Use clear text labels and existing typographic arrows instead of adding a CDN script or icon dependency. Preserve accessible names and minimum target sizes. |
| `@motionone/dom` script tag | Loaded, never invoked                                                                                                                                                                                                                             | Do not port. See Relationship to the Prior Specification.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

## Hero Video Lifecycle

- The hero copy is SSR-rendered without waiting for media or client hydration.
- The video element and source are mounted only after `onMounted()` confirms `(min-width: 768px)` and no reduced-motion preference.
- The video uses `muted`, `loop`, `playsinline`, and `preload="metadata"`; playback is attempted imperatively and autoplay failure is ignored safely.
- `matchMedia` change listeners handle viewport and reduced-motion changes and are removed on unmount.
- Below 768px, no video element or source exists, so the browser cannot request the asset.
- With reduced motion enabled, the hero remains static and readable; no sticky stage, scroll-linked transform, or autoplay is required.
- The semantic background and scrim preserve contrast if the asset fails to load.

**Reconciling the video's slot with the sample's markup:** the sample's hero has one decorative element on the right side — the `noise` dot-pattern `<div>`, `absolute inset-y-0 right-0 hidden w-1/2 opacity-50 lg:block`, visible only at `lg` (1024px) and up. The video enhancement replaces this element's content at the same position (right half, absolute, `aria-hidden`) rather than introducing a new full-bleed background layer, so the hero's two-column grid, copy column, and aside panel keep their sample proportions with the video sitting behind/beside them exactly where the dot pattern sits today.

**Breakpoint discrepancy to resolve, not silently pick:** this spec's own video lifecycle rules (and the prior spec's) gate the video at 768px (`md`), while the sample's dot-pattern slot only activates at 1024px (`lg`), leaving the 768–1023px range with a bare background in the reference file. Recommended resolution: extend the decorative slot's breakpoint down to 768px so it's consistent with the documented video breakpoint everywhere in this spec — i.e., treat the sample's `lg:block` as a stand-in that should become `md:block`-equivalent once the video is wired in, and keep the plain dot-pattern texture as the non-video fallback (video fails to load, or renders before the video mounts) at that same 768px breakpoint. Confirm this reading with design before implementing if a hard `lg`-only cutoff was actually intended.

## Typography and Copy Voice

This section exists because 1:1 structural parity and "not AI slop" pull in the same direction almost everywhere in this reference file — the sample's own copy is already declarative, specific, and evidence-led — except for one recurring character-level pattern that needs a deliberate fix, and a couple of soft notes worth keeping in mind for anything not directly lifted from the file.

### Known deviation: em dash in the reference markup

The reference file uses an em dash (—) in four places:

- The document `<title>`: "Nova Sugiantara — Full Stack Web Developer"
- Three experience date ranges: "May 2025 — Present", "May 2024 — May 2025", "2021 — Present"

Long dashes standing in for a hyphen in date ranges (and in title-style headlines) are one of the most recognizable tells of AI-generated text, and this spec's own governing rules (docs/DESIGN.md content-first hierarchy, and the prior spec's explicit "regular hyphens, not en dashes or em dashes" rule and its verification step scanning for exactly this) prohibit them. **This is the one intentional, flagged deviation from otherwise-exact reproduction of the reference file:** render all four of the above with a plain hyphen surrounded by single spaces — "Nova Sugiantara - Full Stack Web Developer", "May 2025 - Present", "May 2024 - May 2025", "2021 - Present" — in both the fallback data module and the SSR/live-data-rendered output, including anywhere date ranges are computed programmatically from live experience records.

### Rules for any newly-authored string

Nearly everything visible on this page is either lifted verbatim from the reference file (as fallback copy) or is live Supabase content the person themselves wrote. The only genuinely _new_ strings this implementation introduces are things like `aria-label`s, alt text, the corrected date-hyphen formatting above, and — if a section's live data is empty in a way the fallback doesn't cover — any loading/error/empty microcopy inherited from the existing state components. For any of these, and for anyone maintaining this page later:

- No fabricated marketing copy. This spec already prohibits inventing fallback records to fill a slot; the same restraint applies to incidental strings — an `aria-label` describes what the control does, it doesn't sell it.
- Avoid stock intensifiers and vague upgrades: "seamless", "effortless", "cutting-edge", "state-of-the-art", "revolutionary", "game-changing", "unparalleled", "world-class", "next-level", "robust" or "powerful" used as filler rather than describing something specific.
- Avoid empty throat-clearing openers: "In today's fast-paced world...", "In the ever-evolving landscape of...", "When it comes to...".
- Prefer plain verbs over padded ones: "use" over "leverage" or "utilize", "improve" over "elevate", "help" over "empower" or "unlock", "explain" over "dive into" or "delve into".
- Avoid unearned abstractions: "tapestry", "testament to", "boasts", "showcases" without a concrete, checkable referent right next to them.
- Don't stack adjectives as a substitute for a fact — the reference file's own instinct ("Evidence over adjectives.") is the standing rule: a claim pairs with a number, a named technology, or a named outcome, not three more adjectives.
- No em dash or en dash anywhere in visible copy or generated strings — plain hyphens only, per the correction above. This is now a repeat of the prior spec's rule, restated here because it's the specific pattern this reference file needed corrected.
- The reference file's one rhetorical-question heading ("Need an engineer who can connect product intent with production reality?") is fine to keep as-is — it's specific to the actual offer, not a generic hook like "Ready to get started?" — but it should not be treated as a template to reuse elsewhere on the page; the other section headings are all declarative statements, and that mix (mostly declarative, one specific question at the very end) is the intended voice, not an invitation to add more questions.
- "LET'S BUILD SOMETHING RELIABLE" (contact eyebrow) sits close to a cliché pattern ("let's build something [adjective] together") that shows up constantly in generated portfolio copy. It's kept here because "reliable" ties directly to the page's actual recurring claim (dependable systems, production responsibility, evidence-led work) rather than a generic filler adjective — but this is the copy in the file to watch if it's ever revised: any future edit to this line should keep the adjective tied to something the page actually demonstrates, not swap in something generic like "amazing" or "great".

## Visual System / Token Mapping

- Preserve the existing semantic color tokens from `main.css`.
- Align typography with the sample's `Inter` and `JetBrains Mono` direction where compatible with the project token system; do not introduce inline font declarations.
- Use the sample's restrained border, surface, and spacing language.
- Avoid generic equal-card grids, decorative gradients, glow effects, fake screenshots, progress bars, invented metrics, and hover-only content.
- Keep mobile-first layouts at 320px, 375px, 414px, and 768px with no horizontal overflow.
- Preserve visible focus states and minimum 44px interaction targets.

Token translation table — the sample's CDN-config values and inline CSS custom properties, mapped to what belongs in the project's real `main.css`:

| Sample token/value                                                                                                                                                                              | Role                                      | Action                                                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `brand.ink` `#321E48`, `brand.slate` `#43637E`, `brand.mint` `#65DCD5`, `brand.mist` `#D9FFF4`, `brand.teal` `#1F7A75`, `brand.tealDark` `#185F5B`                                              | Brand anchor palette                      | Add as named color tokens in `main.css` if equivalents don't already exist there; do not hard-code these hex values inside `index.vue`.                                                                         |
| `--bg`, `--bg-alt`, `--surface`, `--surface-muted`, `--text`, `--text-secondary`, `--muted`, `--accent`, `--accent-hover`, `--accent-soft`, `--border`, `--border-strong` (light and dark sets) | Semantic surface/text/border/accent roles | Map each to the project's existing equivalent semantic token name; only add a new custom property if no existing token already covers that role — confirm against the current `main.css` before assuming a gap. |
| `fontFamily.sans = Inter`, `fontFamily.mono = JetBrains Mono`                                                                                                                                   | Type roles                                | Update the project's heading/body font tokens to Inter (see the flagged font-direction change above) and keep the existing mono token pointed at JetBrains Mono if it already is.                               |
| `boxShadow.soft`                                                                                                                                                                                | Elevation                                 | Map to the project's existing "real elevation" shadow token per the prior spec's "shadows only where elevation is real" rule; the sample uses it sparingly (hero aside panel only), keep that restraint.        |
| `radius: rounded-lg` (control-scale), `rounded-xl`/`rounded-2xl` (card/media-scale)                                                                                                             | Radius roles                              | Map to the project's existing 8px control-radius / 16px surface-radius tokens rather than introducing a third radius scale.                                                                                     |
| Google Fonts `<link>` tags                                                                                                                                                                      | Font loading                              | Do not add a runtime Google Fonts request if the project already self-hosts or otherwise loads Inter/JetBrains Mono; confirm the existing font-loading strategy before adding a new network request.            |

## Error, Empty, and Loading Behavior

- Profile API failure must not render `Profile unavailable` as the whole homepage.
- Empty or failed profile and skill requests resolve to verified fallback content.
- Projects and experience always use reviewed homepage summaries from `homeFallback.ts`.
- Loading placeholders remain only while their section is genuinely pending and must not hide unrelated sections.
- Video failure has no user-facing error state because it is optional decorative media.
- No fallback record is fabricated merely to fill a visual slot.

## Files in Scope

- `app/pages/index.vue`
- `app/assets/css/main.css`
- `app/data/homeFallback.ts`
- `app/app.vue`
- `app/components/NavBar.vue`
- `app/components/Footer.vue`
- `package.json`
- `package-lock.json`

No routes, API contracts, database schema, or unrelated pages will change. Shared navigation, footer, theme initialization, and font packages may change only as required for sample parity.

## Verification

1. Run `npm run build`.
2. Run `git diff --check`.
3. Verify populated and API-failure fallback paths in the homepage source and local runtime.
4. Inspect 320px, 375px, 414px, 768px, 1024px, and 1440px layouts.
5. Confirm no video element/source/request below 768px.
6. Confirm reduced-motion mode disables video playback and sticky/scroll motion.
7. Check keyboard focus order, 200% zoom, contrast, and horizontal overflow.
8. Run the Impeccable detector against changed UI files.
9. Review the final diff for unrelated changes and unsupported content.
10. Side-by-side visual comparison against `sample-page/index.html` at each breakpoint in the list above, in both themes, confirming section order, spacing rhythm, and copy match — not a pixel-diff tool requirement, a manual check.
11. Static source scan for em dash (`—`, U+2014) and en dash (`–`, U+2013) characters in visible homepage copy and in `app/data/homeFallback.ts`, confirming the four corrected instances (title and three date ranges) render with a plain hyphen.
12. Confirm no CDN `<script>` tags (Tailwind, lucide, motion-one) and no net dependency increase were introduced anywhere in the diff.

## Acceptance Criteria

- The homepage remains complete when Supabase is empty, unavailable, or partially failing.
- The rendered Nuxt homepage matches the sample's hierarchy, metrics, project mosaic, experience structure, approach/capability content, contact CTA, and footer treatment.
- Desktop visitors receive the right-biased background video without delaying SSR content.
- Mobile visitors do not receive the video element, source, or request.
- Existing SEO, navigation, Supabase composables, and security boundaries remain intact.
- The two previous sans-serif font packages are replaced by Inter, the total dependency count decreases, and the production build passes.
- Every factual claim in `app/data/homeFallback.ts` traces back to `docs/CV.md`, with no fabricated copy.
- The rendered homepage contains no transaction count, booking count, payment metric, financial total, or sensitive operational statistic.
- No em dash or en dash characters appear anywhere in rendered homepage copy, including computed date ranges.
- No CDN-loaded script tags (Tailwind CDN, lucide UMD, `@motionone/dom`) exist in the shipped page.

## Risks and Edge Cases

- **Font-direction change (Outfit/Plus Jakarta Sans → Inter).** This is a token-level change that could visually affect other pages sharing `main.css`, not just the homepage. Confirm scope before merging; if it must stay homepage-only, that requires a homepage-scoped font override, which is a larger change than "Files in Scope" currently allows — surface this as a blocker rather than quietly scoping the font change to `index.vue` alone.
- **Video breakpoint (768px) vs. sample's decorative-slot breakpoint (1024px).** See Hero Video Lifecycle — implementing without resolving this leaves either a dead zone (768–1023px with neither dot pattern nor video) or an unreviewed breakpoint change from the reference file.
- **Experience section's per-entry cards vs. the prior spec's single-divider rule.** Flagged and resolved in favor of the sample above; make sure whoever reviews the diff knows this is an intentional supersession of the earlier spec, not a missed instruction.
- **Project count other than 5.** The sample's five-tile arrangement (dominant, highlight, three standard) is the fallback shape; live data with a different count needs a defined degrade path (see Structural Parity Map, Selected Work) rather than leaving empty grid cells or silently dropping the highlight tile's distinct treatment.
- **Icon set gaps.** If the project's existing icon system doesn't already cover all fifteen icons listed in Interactive Behavior Parity, that's a blocker to flag, not a reason to add the `lucide` package fresh (which would violate "no new dependency").
- **FOUC on theme.** Reproducing the sample's blocking inline dark-mode script inside Nuxt's SSR head needs care — done wrong, it either flashes the wrong theme or triggers a hydration mismatch warning; test explicitly with system dark mode on, system light mode on, and an explicit saved preference in `localStorage` that disagrees with the system setting.
- **Contact section's inverse theme.** The sample's contact/footer pairing intentionally stays dark regardless of site theme — confirm this reads correctly in both the light and dark builds of the rest of the page, since an "inverse-always" section can look like a bug if reviewers aren't expecting it.

## Open Assumptions

- Whether `lucide-vue-next` (or an equivalent covering the same icon names) is already a project dependency — assumed yes; if not, this is a blocker per Files in Scope and Risks above.
- Exact prop/return shape of `useProfile`, `useProjects`, `useExperiences`, and `useSkills`, and whether a "profile headline" field distinct from "summary" exists to back the hero `h1` — assumed to exist in some form; confirm against the actual composables.
- Whether the site already has a color-mode mechanism (a Nuxt module or hand-rolled composable) that the theme toggle should hook into, versus needing the small custom composable described in Interactive Behavior Parity.
- Whether the live layout's existing WhatsApp button already matches the phone number and prefilled message shown in the reference file, or whether that button is defined elsewhere and this page should simply not duplicate it.
