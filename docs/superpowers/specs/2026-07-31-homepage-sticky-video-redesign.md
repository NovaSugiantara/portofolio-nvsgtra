# Homepage Sticky Video Redesign

## Status

Approved design direction. This revision expands the spec to implementation-ready detail: exact behavior at each breakpoint and motion state, data/error matrices, token expectations, and a QA test matrix, so a build can start without re-litigating design decisions.

## Design Read

This is a full-overhaul developer portfolio homepage for recruiters, engineering managers, founders, and prospective clients. The visual language is cinematic and experimental, but the content remains direct, technical, and evidence-led. The hero sells presence and craft in five seconds; everything after the hero sells proof.

Design dials:

- `DESIGN_VARIANCE: 9`
- `MOTION_INTENSITY: 8`
- `VISUAL_DENSITY: 4`

Reading of the dials for implementation:

- High variance, low density means the page earns its drama from a small number of large, confident moves (the sticky hero, the mosaic, the typographic capability matrix) rather than many small decorative flourishes. Every section below should be checked against "does this decoration exist because the layout is bold, or because it's filling space" — cut the latter.
- High motion intensity is spent almost entirely on the hero → editorial-summary transition. Everything past that transition should feel comparatively calm (hover/focus acknowledgment only), so the one big motion moment reads as intentional rather than as a page-wide tic.

The implementation uses the existing Nuxt 4, Vue 3, Tailwind CSS v4, and semantic CSS token system. No new design system or animation dependency is required.

## Goals

1. Use `app/assets/video/hero-bg.webm` as the desktop hero background.
2. Keep the video's meaningful subject on the visitor's right side.
3. Create a full sticky hero stage on desktop with a clear transition into portfolio evidence.
4. Remove the video entirely on viewports below 768px, including avoiding the video download.
5. Make the remaining homepage feel composed rather than card-generated.
6. Preserve SSR content, Supabase data sources, SEO, route structure, and existing loading, error, and empty states.
7. Respect keyboard access, contrast, reduced motion, and mobile touch targets.

## Non-Goals

1. Redesigning public navigation, footer, WhatsApp behavior, or other routes.
2. Changing Supabase schemas, APIs, composables, or profile content contracts.
3. Adding GSAP, Motion, or another animation package.
4. Adding parallax loops, marquees, fake interfaces, decorative status indicators, or new portfolio content.
5. Rewriting profile, project, experience, or capability records stored in Supabase.

## Page Structure

The homepage keeps its current information order while changing the presentation:

1. Sticky desktop hero or static mobile hero
2. Editorial profile summary
3. Selected work mosaic
4. Experience list with sticky section heading
5. Capability matrix
6. Single closing contact statement

Loading, profile error, unpublished profile, project error, experience error, capability error, and empty states remain available in the same page.

### Section-to-data ownership

| Section                   | Data source                        | Independent loading/error?                            |
| ------------------------- | ---------------------------------- | ----------------------------------------------------- |
| Hero                      | `useProfile` (role, name, summary) | Yes — hero cannot block on projects/experience/skills |
| Editorial profile summary | `useProfile` (full summary)        | Shares profile state with hero                        |
| Selected work             | `useProjects`                      | Yes                                                   |
| Experience                | `useExperiences`                   | Yes                                                   |
| Capabilities              | `useSkills`                        | Yes                                                   |
| Closing statement         | Static copy, no fetch              | N/A                                                   |

Each section resolves its own pending/error/empty state independently so a slow or failing endpoint (e.g. projects) never blocks unrelated sections (e.g. experience) from rendering. This preserves current behavior — do not introduce a single top-level "page pending" gate that didn't exist before.

## Hero

### Desktop

The desktop hero begins at 768px.

- The outer hero stage is approximately `170dvh` tall.
- The inner hero panel is sticky below the 64px global navigation and fills the remaining dynamic viewport height. Concretely: `position: sticky; top: 64px; height: calc(100dvh - 64px);` on the inner panel, with the outer stage using `min-height: 170dvh` so there is enough scroll distance for the exit transition to play before the panel unsticks.
- The video fills the panel using `object-fit: cover`.
- `object-position` biases the crop to the right so the subject remains on the visitor's right side. Use `object-position: 80% center` as the default; adjust only if visual inspection against the actual footage shows the subject clipping.
- A directional scrim is darkest behind the left-aligned copy and becomes transparent toward the subject. Implement as a single `linear-gradient(to right, var(--color-obsidian) 0%, color-mix(in srgb, var(--color-obsidian) 55%, transparent) 45%, transparent 75%)` layered over the video, not a flat overlay — the gradient direction is what keeps the right-side subject visible while guaranteeing contrast for the left-aligned copy.
- Copy contains no more than four elements: role, name, a summary of no more than 20 words, and the CTA group.
- The primary CTA is `View projects`.
- The secondary CTA is `Download CV`.
- Location and email are removed from the hero and remain discoverable through profile and contact content.

Stacking order inside the hero panel (back to front): video → scrim gradient → copy/CTA column. The copy column sits in a max-width content column aligned to the page's existing horizontal padding/gutter, not full-bleed.

The video is decorative, muted, looping, and has no audio track exposed to the visitor. Playback begins only after the component mounts and only when reduced motion is not requested.

Video element contract:

- `muted`, `loop`, `playsinline`, no `controls`.
- `aria-hidden="true"` and `tabindex="-1"` so it is never reachable by assistive tech or keyboard.
- `preload="metadata"` (see Performance).
- No `autoplay` attribute in markup — playback is started imperatively from script after mount, after checking both the breakpoint and the reduced-motion media query, so there is one single source of truth for "should this play" rather than relying on the attribute plus a separate JS gate that can disagree with it.

### Sticky Transition

The sticky stage communicates the shift from identity to evidence.

- During the first portion, the hero copy and video are fully visible.
- During the exit portion, the copy moves slightly upward and fades.
- The video scales subtly and darkens.
- The editorial profile summary rises over the end of the hero like a curtain.
- Only `transform` and `opacity` animate.
- Native CSS scroll-driven animation is progressive enhancement. Unsupported browsers receive the complete static sticky composition.

Implementation detail:

- Use `animation-timeline: view(block)` on the copy column and on the video element, each with its own `animation-range`, rather than one shared keyframe applied to a wrapping element — copy and video move at different intensities (copy: small translate + opacity fade; video: subtle scale + darken) and coupling them into one animation makes future tuning harder.
- Suggested ranges: copy animation range roughly the middle 40% of the outer stage's scroll distance (fades out before the panel fully unsticks); video animation range slightly longer so the darken/scale reads as continuous rather than the last visible frame doing all the work.
- Suggested transform budget: copy translate no more than 24px upward, video scale no more than 1.05, so the effect reads as "settling," not as a distinct camera move.
- Feature-detect with `@supports (animation-timeline: view())`. Inside the unsupported branch, remove the animation declarations entirely rather than leaving `animation-timeline` set to an invalid value — browsers without support should simply render the first-frame static composition described in Reduced Motion, since that composition is already fully readable and accessible.
- The editorial profile summary section should have a `border-radius` only on its top edge (16px, matching the media/major-surface radius rule) so the "curtain" metaphor reads as a physical sheet rising over the hero, not as a new rectangular block appearing.

### Mobile

Below 768px, the hero is static and contains no video or portrait.

- No video source is supplied to the browser at this width.
- The sticky stage and extended scroll distance are removed.
- The hero uses the existing semantic background, foreground, and accent tokens.
- Copy and CTAs stack within normal document flow.
- The hero uses `min-height` based on `dvh`, never `h-screen`.
- The same SSR role, name, short summary, and CTA content remain available.

Breakpoint-detection strategy (this is the part most likely to be implemented incorrectly, so it gets its own subsection):

- The `<video>` element (with its `<source>`) must not exist in the DOM at all on mobile — a `display: none` media query is not sufficient, because browsers still issue the network request for a video element that's merely hidden.
- Detect the breakpoint client-side with `window.matchMedia('(min-width: 768px)')`, read once on mount and subscribed to via `change` for viewport resizes/rotation, not a resize listener doing manual width math.
- Server-side and pre-hydration, render no video element at all (the desktop-only markup mounts inside a client-only boundary, e.g. Nuxt's `<ClientOnly>`, or behind a `ref` that starts `false` and flips after the matchMedia check resolves). This means desktop users see the hero copy immediately (SSR) and the video fades/mounts in a moment later — this is intentional and matches "do not delay SSR text while waiting for video readiness."
- Reserve the full hero panel height via CSS before the video mounts (see Performance) so there is no layout shift whether or not the video ends up rendering.
- If the viewport is resized across the 768px line at runtime (e.g. rotating a tablet, or resizing a desktop window), the same matchMedia listener should mount/unmount the video element accordingly, and should re-evaluate the reduced-motion check before resuming playback.

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- The video does not autoplay.
- The outer stage returns to normal content height.
- Sticky positioning is removed.
- Scroll-linked and entry transforms are disabled.
- All hero content remains visible without requiring interaction.

Implementation detail:

- Gate every animation declaration behind `@media (prefers-reduced-motion: no-preference)` in CSS, so the reduced-motion branch is the CSS default rather than an override — this is the safer failure direction if a selector is ever missed.
- The "video does not autoplay" rule still allows the video element to exist and show its poster/first frame if desktop-width, since a static frame of the hero footage is part of the approved composition; only playback and scroll-linked scale/darken are suppressed. If a static first frame is not achievable cheaply, it is acceptable to not render the video element at all under reduced motion and rely on the semantic background token instead — either satisfies "all hero content remains visible without requiring interaction," but the static-frame option is preferred if it doesn't add complexity.
- Re-check `prefers-reduced-motion` via `matchMedia(...).addEventListener('change', ...)` rather than only at mount, since a user can toggle the OS setting while the tab is open.

## Editorial Profile Summary

The full Supabase profile summary appears immediately after the hero because the hero summary is intentionally limited to 20 words.

- Use an offset editorial composition on desktop and a single column on mobile.
- Keep line length within approximately 65 characters.
- Do not add an eyebrow, badge, status dot, location strip, or decorative metadata.
- Profile email or location may appear here only when it supports direct evaluation and does not duplicate a visible contact CTA.

Layout detail:

- "Offset" means an asymmetric two-column desktop grid (for example a narrow left column holding a short structural label such as the role title repeated at a smaller scale, and a wider right column holding the full summary paragraph) rather than a centered single block — the offset is what keeps this from reading as a generic "About" card.
- Line length is controlled with a `max-width` in `ch` units on the paragraph itself (roughly `65ch`), not a percentage-based column width, so the constraint holds regardless of the surrounding grid's actual pixel width.
- This section has no card container, border, or shadow — it sits directly on the page background, separated from neighboring sections by spacing alone, consistent with "composed rather than card-generated."

## Selected Work

Selected work becomes an asymmetric mosaic rather than an equal card grid.

- Continue showing up to four published projects.
- The first project is the dominant item and uses available cover media prominently.
- Remaining items use varied spans based on their order, not invented content.
- Every project remains understandable without hover.
- Project title, role, description, up to four technologies, and case study destination remain available.
- Missing cover media results in a typography-led tile, not a fake screenshot or decorative illustration.
- Mobile collapses to one full-width column in source order.
- The section heading may remain sticky on wide screens while the mosaic scrolls beside it.
- There is no repeated `View all projects` CTA because the hero and global navigation already provide that intent.

Mosaic grid detail (desktop, CSS grid on a 12-column base):

- Item 1 (dominant): spans the full available width beside the sticky heading, taller aspect ratio (e.g. `16 / 9` cover crop), title/role/description set at a larger type step than the other items.
- Item 2: roughly half width, standard aspect ratio.
- Item 3: roughly one-third width, paired beside item 4.
- Item 4: fills the remaining span next to item 3.
- These spans are a starting proportion, not a pixel-exact requirement — the binding rule is "varied spans based on order," so any asymmetric arrangement that avoids four equal-sized tiles satisfies the spec. Do not compute spans from content length (e.g. description word count), since that would make layout depend on editorial content rather than position.
- Technology list renders as plain inline text (or a simple wrapped list), not pill/badge components, consistent with the capability matrix's "text, not badges" rule elsewhere in this spec.
- Typography-led fallback tile (no cover media): project title at the same heading step the tile would otherwise use for a caption, set against a flat semantic surface token — no icon, no placeholder illustration, no gradient standing in for a missing image.

## Experience

Experience remains reverse chronological and evidence-led.

- Use one straightforward list with a sticky heading on wide screens.
- Use large role typography, company, date range, location when present, and up to two published contribution bullets.
- Use one divider between entries rather than enclosing each role in a card.
- Mobile uses a single column with date information before the role.
- Static copy and generated date ranges use regular hyphens, not en dashes or em dashes.

Implementation detail:

- Markup as a semantic list (`<ul>`/`<li>` or `<ol>`/`<li>` — ordered is defensible here since the sequence is chronologically meaningful, unlike the numbered-marker anti-pattern called out under Visual System) so the reverse-chronological order is conveyed to assistive tech, not only visually.
- The divider is a single `border-top` (hairline, using the existing sparse-border token) on each `<li>` except the first — do not wrap each entry in its own bordered box, which would read as a card grid again.
- Sticky heading offset should match the hero's nav-clearance logic (`top: 64px`) so stacked sticky elements don't collide as the page scrolls.
- Date range formatting: build the string in one place (a computed/helper), e.g. `2021 - 2024` or `2021 - Present`, always with a regular hyphen surrounded by single spaces, so it can't drift per-entry.

## Capabilities

Capabilities become a typographic matrix rather than three equal cards.

- Each Supabase category is a matrix group with category name and its published skills.
- Groups use asymmetric desktop spans where the item count supports it.
- Separation uses spacing and sparse borders.
- Mobile collapses to one group per row.
- Skill names remain text, not progress bars, ratings, badges, or animated chips.

Implementation detail:

- Compute each group's grid span from its skill count at render time (e.g. a category with many published skills takes a wider span than a category with two or three) rather than hard-coding spans per category name — this keeps the layout correct if Supabase content changes without a code change, and matches "based on the item count," not on which category it happens to be.
- Skills within a group render as a simple wrapped inline list (comma-, space-, or hairline-divider-separated plain text), set in the body face or the metadata mono face if the category is explicitly technical/versioned data (e.g. tool names with version numbers) — this is the one place JetBrains Mono earns its "technical metadata" role from the Visual System section.
- Separation between groups uses the sparse-border token on one edge only (e.g. a top or left hairline depending on the grid flow), never a full bordered box per group.

## Closing Statement

The final homepage section contains one focused contact intent.

- Use one short heading and one short supporting paragraph.
- Provide one `Contact Nova` link.
- Do not repeat project or blog CTAs.
- Keep the section in the active page theme rather than switching to an unrelated inverse palette.

Implementation detail:

- This section is static copy (no Supabase fetch), so it has no loading/error/empty state to design for — the only requirement is that its copy and link target stay in sync with whatever the existing contact route/action is (mailto, contact route, or WhatsApp handoff, matching current behavior, not a new one — see Non-Goals on WhatsApp behavior).
- Treat this as the natural final landmark on the page: it should not be visually heavier than the hero, or it will compete with the opening thesis.

## Visual System

The existing brand system remains authoritative:

- Heading: Outfit
- Body: Plus Jakarta Sans
- Metadata: JetBrains Mono only where technical metadata benefits from it
- Brand anchors: obsidian, steel, teal, and mint
- One accent role: semantic teal
- Radius rule: 8px controls, 16px media and major surfaces
- Shadows only where elevation is real
- Automatic light and dark themes through existing semantic CSS variables

The redesign must not add purple-blue glows, mesh gradients, glass cards, custom cursors, decorative terminal motifs, section numbering, scrolling prompts, or repeated uppercase eyebrows.

Expected existing tokens (to confirm against `main.css` before implementation, not to invent):

- Color roles: a background/foreground pair per theme, an accent (teal), and the four brand anchors (obsidian, steel, teal, mint) exposed as CSS custom properties already consumed elsewhere in the app.
- Radius roles: one control-radius token (8px) and one surface/media-radius token (16px).
- Font roles: heading, body, and mono font-family tokens.
- If any of the above do not already exist as named tokens, add them to `main.css` following the existing naming convention rather than hard-coding hex values or font stacks inline in `index.vue` — this keeps automatic light/dark theming intact and is the one case where touching `main.css` beyond animation keyframes is expected.

## Motion

Motion has three purposes:

1. Establish hero hierarchy during the initial entry.
2. Explain the transition from professional identity to project evidence.
3. Acknowledge direct hover, active, and focus interactions.

Implementation rules:

- Use native CSS entry keyframes and scroll-driven animation.
- Gate automatic animation behind `prefers-reduced-motion: no-preference`.
- Use progressive enhancement for `animation-timeline` support.
- Animate only opacity and transform.
- Do not register window scroll listeners.
- Do not add perpetual motion beyond the requested desktop background video.

Timing reference (starting values; tune by eye against actual footage/content, not a hard requirement):

| Moment                                                       | Property                      | Duration/Range                                | Easing                 |
| ------------------------------------------------------------ | ----------------------------- | --------------------------------------------- | ---------------------- |
| Hero entry (role/name/summary/CTA)                           | opacity, translateY           | ~500-700ms, small stagger per element         | ease-out               |
| Hero exit — copy                                             | opacity, translateY           | scroll-linked, mid 40% of stage range         | linear (scroll-driven) |
| Hero exit — video                                            | opacity/darken, scale         | scroll-linked, slightly wider range than copy | linear (scroll-driven) |
| Hover/focus acknowledgment (CTAs, project tiles, list items) | opacity or translateY (small) | ~150-200ms                                    | ease-out               |

Keyframe naming should be descriptive and scoped to this page (e.g. `hero-copy-enter`, `hero-copy-exit`, `hero-video-exit`) so `main.css` additions are easy to isolate and remove if the hero is ever revisited independently of the rest of the site's animation vocabulary.

## Data and SSR

- Continue using `useProfile`, `useProjects`, `useExperiences`, and `useSkills`.
- Keep all primary copy rendered by Nuxt SSR.
- Derive the hero summary from the first 20 words of the published profile summary without mutating source content.
- Render the complete profile summary in the editorial summary section.
- Preserve current computed collections and published-item limits unless layout requires a smaller presentation limit.
- Keep current canonical URL, person JSON-LD, Open Graph, and Twitter metadata behavior.

Word-truncation detail:

- Split the published summary on whitespace, take the first 20 tokens, rejoin with single spaces, and append an ellipsis only if the source summary actually has more than 20 words — do not mutate or persist a truncated copy back to Supabase; this is a display-time computed value.
- If the published summary is 20 words or fewer, the hero shows it in full and no ellipsis is appended, and the editorial section still renders the same (untruncated) text — a short summary is not an error state.

State matrix (per section, mirroring existing site conventions — implement only if these states already exist upstream, do not invent new ones):

| State             | Hero                             | Editorial summary                | Selected work          | Experience                 | Capabilities           |
| ----------------- | -------------------------------- | -------------------------------- | ---------------------- | -------------------------- | ---------------------- |
| Loading           | existing loading state           | existing loading state           | existing loading state | existing loading state     | existing loading state |
| Error             | existing error state             | existing error state             | existing error state   | existing error state       | existing error state   |
| Empty/unpublished | existing empty/unpublished state | existing empty/unpublished state | existing empty state   | existing empty state       | existing empty state   |
| Populated         | full hero as specified           | full editorial layout            | mosaic, up to 4 items  | reverse-chronological list | typographic matrix     |

The binding requirement is "existing states continue to work," not that this table introduces new UI for them — it exists so implementation checks each section against the same four possibilities rather than only against the happy path.

## Accessibility

1. Preserve a single `h1` and sequential heading levels.
2. Treat the background video as decorative and hide it from assistive technology.
3. Keep all controls at least 44px in one dimension.
4. Preserve visible focus indicators and logical keyboard order.
5. Ensure hero scrims maintain WCAG AA text and button contrast throughout the video.
6. Ensure the page remains complete when video playback fails.
7. Ensure 200 percent zoom does not create horizontal page scrolling.
8. Keep loading, error, empty, and retry states announced with their existing live-region semantics.

Concrete techniques per rule:

1. The hero name is the `h1`; every subsequent section heading (editorial summary, selected work, experience, capabilities, closing) is an `h2`, with no skipped levels inside each section's own content.
2. Covered under the Hero section's video element contract (`aria-hidden="true"`, `tabindex="-1"`, no accessible name).
3. CTAs and project/experience links get explicit `min-height`/`min-width` of 44px via padding, even where the visual/typographic box appears smaller — verify with devtools box model, not just by eye.
4. Keyboard order follows source order (nav → hero copy → CTAs → editorial summary → mosaic → experience → capabilities → closing), since no `tabindex` values other than `-1` on the video should be introduced; do not rely on scroll-timeline-driven opacity to hide focusable elements from tab order — an element with `opacity: 0` mid-transition can still be focused, so anything that must be unreachable while visually hidden needs `visibility` or `inert` handling, not opacity alone.
5. Contrast check must sample multiple frames of the actual footage (a few seconds apart, including the brightest frame) against both CTA text and CTA background, not just the first frame — the gradient scrim's darkest stop is tuned to survive the brightest frame likely to sit behind the copy column.
6. `object-fit: cover` plus the semantic background token behind the video element (as its own background-color, not only relying on the gradient) means a failed video load still shows a themed panel with fully legible copy — verify by blocking the video request in devtools.
7. Re-check at 200% zoom specifically on the hero (largest risk area given the fixed `dvh` heights) and on the mosaic (asymmetric spans are the second risk area) — both should reflow rather than force horizontal scroll.
8. No change needed if existing live-region markup is reused as-is per section; verify each section's loading/error/empty branch retains whatever `aria-live`/role attributes the current implementation already applies, since this spec does not introduce new state UI.

## Performance

1. Do not load the video source below 768px.
2. Use `preload="metadata"` rather than preloading the complete video.
3. Do not delay SSR text while waiting for video readiness.
4. Reserve the hero dimensions to avoid layout shift.
5. Keep scroll effects in CSS and off the Vue render cycle.
6. Preserve lazy loading for below-the-fold project images.

Concrete techniques per rule:

1. See Mobile breakpoint-detection strategy above — no `<source>` element exists in the DOM under 768px, not merely hidden.
2. Set `preload="metadata"` directly on the `<video>` tag; do not additionally prefetch or preload the full asset via a `<link rel="preload">`, which would defeat the point.
3. Profile/role/name/summary/CTAs are part of the SSR-rendered template unconditionally; the video element is the only piece gated behind a client-side/mount-time check, so first paint of text never waits on video, matchMedia, or hydration of the video branch.
4. The outer stage's `min-height: 170dvh` and the inner panel's `height: calc(100dvh - 64px)` are set in CSS (not computed from the video's natural dimensions after load), so the reserved box exists before the video request even starts, whether or not the video ultimately renders.
5. All scroll-linked motion is `animation-timeline: view()` in CSS; no `scroll`/`scrollend` event listeners, no `IntersectionObserver`-driven Vue state, and no per-frame `requestAnimationFrame` loop.
6. Confirm existing `loading="lazy"` (or equivalent) attributes on project cover images are preserved on the mosaic tiles exactly as they exist today — the mosaic changes layout/spans, not the image-loading strategy.

## Files in Scope

1. `app/pages/index.vue`
2. `app/assets/css/main.css`

No other source file should change unless implementation proves that a shared accessibility or asset-loading requirement cannot be met within these two files.

If a token referenced under Visual System genuinely does not exist yet, adding it to `main.css` is in scope; adding a new composable, component file, or dependency is not — surface that as a blocker instead of expanding file scope silently.

## Verification

Implementation verification must include:

1. `npm run build`
2. Desktop visual inspection in light and dark themes
3. Mobile inspection confirming no video request and no sticky hero
4. Reduced-motion inspection confirming no autoplay or transform motion
5. Keyboard navigation and focus visibility check
6. 200 percent zoom and horizontal overflow check
7. Hero contrast check over multiple video frames
8. Loading, error, empty, and populated homepage state review where local data permits
9. Static source scan for em dash and en dash characters in visible homepage copy

### QA test matrix

Cross the axes below; every cell should be checked at least once, not just the defaults (desktop / light / motion-ok):

| Axis              | Values                                       |
| ----------------- | -------------------------------------------- |
| Viewport          | ≤767px, 768-1023px, ≥1024px, 200% zoom       |
| Theme             | Light, Dark                                  |
| Motion preference | No preference, Reduced                       |
| Data state        | Loading, Error, Empty/unpublished, Populated |
| Input             | Mouse/trackpad, Keyboard-only, Touch         |

Priority cells (check first, since they combine the highest-risk axes): mobile × reduced-motion × populated; desktop × reduced-motion × populated; desktop × 200% zoom × populated; mobile × keyboard-only × populated.

## Acceptance Criteria

1. Desktop visitors see a sticky full-background hero using `hero-bg.webm` with its subject positioned on the right.
2. Mobile visitors receive no hero video element, video source, portrait, or extended sticky scroll stage.
3. Reduced-motion visitors receive a static, fully readable hero with no autoplay.
4. Hero copy remains SSR-rendered, within the agreed content limits, and readable over every video frame.
5. The first project evidence follows the hero transition without a blank or decorative filler section.
6. Projects, experience, and capabilities use distinct layout families and explicit mobile fallbacks.
7. Existing Supabase data flow, route destinations, SEO metadata, and failure states continue to work.
8. No new dependency is added.
9. No prohibited AI-slop pattern is introduced.
10. The production build passes.

## Risks and Edge Cases

- **Video fails to load or the network blocks it entirely.** The hero must still show full copy and CTAs at correct contrast against the fallback background token (see Accessibility rule 6). Verify by blocking the video request, not only by simulating slow network.
- **Profile summary shorter than 20 words.** Hero shows it in full, no ellipsis, no awkward trailing punctuation — see the Data and SSR truncation detail.
- **Fewer than 4 published projects.** The mosaic's asymmetric spans must degrade gracefully for 1-3 items (e.g. item 1's dominant treatment still works alone; do not leave an empty grid cell shaped for a 4th item that doesn't exist).
- **A capability category with only one or two published skills.** Its span should shrink accordingly rather than leaving a visually oversized, mostly-empty group — this falls out naturally if spans are computed from skill count as specified, but is worth an explicit check.
- **Very long role/name/company/date strings.** Confirm the hero copy column and experience list wrap sensibly rather than overflowing or forcing horizontal scroll, particularly at narrow desktop widths just above 768px.
- **Rotating a tablet across the 768px line, or resizing a desktop window across it.** The matchMedia-driven mount/unmount of the video must not leave the page in a state where the sticky stage height was reserved for one breakpoint's content while the other breakpoint's markup is shown.
- **`animation-timeline: view()` support gap.** Confirm the `@supports` fallback is a fully static, fully readable composition and not a broken partial-transition state (e.g. copy stuck mid-fade).
- **Toggling `prefers-reduced-motion` mid-session.** Both the CSS (media-query-gated keyframes) and the JS playback gate (matchMedia listener) must react, not just one of them, or autoplay and scroll-linked motion can silently re-enable.

## Open Assumptions

These are carried forward from the original spec's ambiguity and should be confirmed against the actual codebase before or during implementation, not treated as settled:

- Exact prop/return shape of `useProfile`, `useProjects`, `useExperiences`, and `useSkills` (this spec assumes each exposes some form of data/pending/error, matching whatever pattern the rest of the app already follows).
- Exact existing token names in `main.css` for background/foreground/accent/brand-anchor colors, the two radius roles, and the three font roles (this spec assumes they exist in some form per Visual System, but does not invent specific variable names).
- Whether the existing contact action referenced by "Contact Nova" is a `mailto:` link, an in-app contact route, or the existing WhatsApp handoff — this spec assumes it is whatever already exists today and out of scope to change.
