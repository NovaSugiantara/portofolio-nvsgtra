# Homepage Sticky Video Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Nuxt homepage into a desktop-only sticky video hero and evidence-led experimental portfolio layout without changing its data contracts or public routes.

**Architecture:** Keep `app/pages/index.vue` as the single data and composition boundary because it already owns public homepage fetching, derived data, SEO, and all state branches. Keep visual tokens and progressive-enhancement motion rules in `app/assets/css/main.css`; use `ClientOnly`, `onMounted`, and `matchMedia` so the video source is never SSR-rendered or loaded on mobile.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, Tailwind CSS v4, semantic CSS variables, native CSS keyframes, CSS scroll-driven animation.

## Global Constraints

- Change only `app/pages/index.vue` and `app/assets/css/main.css`.
- Do not add packages, shared components, data APIs, new routes, or database changes.
- Preserve `useProfile`, `useProjects`, `useExperiences`, `useSkills`, SSR copy, current SEO metadata, JSON-LD, and existing loading, error, retry, and empty states.
- Desktop video source is `~/assets/video/hero-bg.webm`; it must be absent below 768px.
- Render no hero video or portrait on mobile.
- Use a 170dvh desktop wrapper with a sticky hero panel and an ordinary mobile flow.
- Disable video, sticky layout, and all entry or scroll motion when `prefers-reduced-motion: reduce` is active.
- Use only opacity and transform animation. Do not register window scroll listeners or add GSAP or Motion.
- Keep hero copy to role, name, a maximum 20-word summary, and the existing project/CV CTA group.
- Retain one semantic teal accent and the existing theme tokens and radius scale.
- Do not add status dots, repeated uppercase eyebrows, glass panels, gradient text, card grids with equal columns, progress bars, faux screenshots, scroll prompts, en dashes, or em dashes.
- Do not commit changes unless the user explicitly requests a commit.

---

## File Structure

- `app/pages/index.vue`: Homepage SSR state handling, hero media lifecycle, concise hero summary, and the redesigned project, experience, capability, and closing layouts.
- `app/assets/css/main.css`: Shared desktop-only sticky hero, directional scrim, native entry and scroll transitions, and progressive-enhancement fallbacks.

### Task 1: Add SSR-Safe Desktop Video Lifecycle

**Files:**
- Modify: `app/pages/index.vue:226-296`

**Interfaces:**
- Consumes: `profile.value?.summary`, the local asset path `~/assets/video/hero-bg.webm`, Vue lifecycle APIs.
- Produces: `showDesktopHeroVideo: ComputedRef<boolean>`, `heroVideo: Ref<HTMLVideoElement | null>`, and `heroSummary: ComputedRef<string>` for the template.

- [ ] **Step 1: Add the Vue imports and reactive media state below the existing `formatYearRange` import**

```ts
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const heroVideo = ref<HTMLVideoElement | null>(null)
const isDesktopViewport = ref(false)
const prefersReducedMotion = ref(false)
let viewportQuery: MediaQueryList | undefined
let motionQuery: MediaQueryList | undefined

const updateHeroMediaState = () => {
  isDesktopViewport.value = viewportQuery?.matches ?? false
  prefersReducedMotion.value = motionQuery?.matches ?? false
}

const showDesktopHeroVideo = computed(() => isDesktopViewport.value && !prefersReducedMotion.value)

onMounted(() => {
  viewportQuery = window.matchMedia('(min-width: 768px)')
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  updateHeroMediaState()
  viewportQuery.addEventListener('change', updateHeroMediaState)
  motionQuery.addEventListener('change', updateHeroMediaState)
})

onBeforeUnmount(() => {
  viewportQuery?.removeEventListener('change', updateHeroMediaState)
  motionQuery?.removeEventListener('change', updateHeroMediaState)
})
```

- [ ] **Step 2: Add controlled playback immediately after the media-state lifecycle**

```ts
watch(showDesktopHeroVideo, async (shouldPlay) => {
  if (!shouldPlay) return

  await nextTick()
  await heroVideo.value?.play().catch(() => undefined)
})
```

The muted `playsinline` video remains decorative if browser autoplay is blocked. Do not show a playback error because primary page content must not depend on this media.

- [ ] **Step 3: Add the concise hero-summary derivation beside the existing computed collections**

```ts
const heroSummary = computed(() => {
  const words = profile.value?.summary?.trim().match(/\S+/g) ?? []
  return words.slice(0, 20).join(' ')
})
```

- [ ] **Step 4: Verify no browser-only API runs during SSR**

Run: `npm run build`

Expected: build succeeds with no `window is not defined` error.

### Task 2: Replace the Homepage Hero With the Desktop Sticky Video Stage

**Files:**
- Modify: `app/pages/index.vue:33-88`

**Interfaces:**
- Consumes: `profile`, `heroSummary`, `showDesktopHeroVideo`, `heroVideo` from Task 1.
- Produces: SSR-readable hero copy; client-only desktop video markup; static mobile hero without media.

- [ ] **Step 1: Replace the current `header` inside `v-else` with a named homepage hero**

Use this structure, retaining the existing optional headline and profile fallback copy:

```vue
<section class="home-hero-stage" aria-labelledby="home-title">
  <div class="home-hero-panel">
    <ClientOnly>
      <video
        v-if="showDesktopHeroVideo"
        ref="heroVideo"
        class="home-hero-video"
        muted
        loop
        playsinline
        preload="metadata"
        aria-hidden="true"
      >
        <source src="~/assets/video/hero-bg.webm" type="video/webm" />
      </video>
    </ClientOnly>
    <div class="home-hero-scrim" aria-hidden="true" />
    <div class="home-hero-content mx-auto max-w-7xl px-4 md:px-6 lg:px-12">
      <div class="max-w-3xl">
        <p v-if="profile.headline" class="home-hero-role">{{ profile.headline }}</p>
        <h1 id="home-title" class="home-hero-title">{{ profile.full_name }}</h1>
        <p v-if="heroSummary" class="home-hero-summary">{{ heroSummary }}</p>
        <p v-else class="home-hero-summary">Production web software for product teams and growing businesses.</p>
        <div class="home-hero-actions">
          <NuxtLink
            to="/projects"
            class="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--accent-primary)] px-5 text-sm font-semibold text-[var(--background-page)] transition-[background-color,transform] duration-180 hover:-translate-y-px hover:bg-[var(--accent-hover)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)] motion-reduce:transform-none motion-reduce:transition-none"
          >
            View projects
          </NuxtLink>
          <a
            href="/api/cv/generate?variant=default"
            target="_blank"
            rel="noopener"
            class="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-mint)] bg-transparent px-5 text-sm font-semibold text-[var(--color-mint)] transition-[background-color,border-color,color,transform] duration-180 hover:-translate-y-px hover:bg-[var(--color-mint)] hover:text-[var(--color-obsidian)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-obsidian)] motion-reduce:transform-none motion-reduce:transition-none"
          >
            Download CV
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

Use exact existing `NuxtLink` and PDF anchor destinations. Rename only the visible primary label to `View projects` so it fits on one line. Do not add location, email, portrait, eyebrow, status, or a new CTA.

- [ ] **Step 2: Preserve progressive enhancement and mobile behavior**

Ensure the `<ClientOnly>` branch has no fallback media. The server and initial client HTML must contain the hero copy but no video source. The video appears only after mount on desktop when reduced motion is not active.

- [ ] **Step 3: Manually verify the desktop and mobile markup behavior**

Run: `npm run dev`

Check at a width of 1280px:

1. The hero has a video request for `hero-bg.webm`.
2. The video is muted, contains no controls, and its subject stays on the right.
3. Both existing CTA destinations work.

Check at a width of 390px:

1. The DOM has no `video` element and no `source` matching `hero-bg.webm`.
2. The hero has no portrait or blank visual placeholder.
3. Name, role, summary, and both CTA actions remain visible and stack without horizontal overflow.

### Task 3: Redesign the Post-Hero Homepage Layout

**Files:**
- Modify: `app/pages/index.vue:90-223`

**Interfaces:**
- Consumes: `profile`, `visibleProjects`, `visibleExperiences`, `skillGroups` and their existing loading, error, empty, and refresh states.
- Produces: An editorial summary, asymmetric project mosaic, evidence-led experience list, capability matrix, and one contact intent.

- [ ] **Step 1: Insert the editorial profile summary directly after the new hero**

```vue
<section class="home-introduction" aria-labelledby="introduction-title">
  <div class="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:px-6 md:py-24 lg:grid-cols-12 lg:px-12">
    <h2 id="introduction-title" class="lg:col-span-4">Built for real production constraints.</h2>
    <p v-if="profile.summary" class="max-w-[65ch] text-lg leading-8 text-[var(--foreground-secondary)] lg:col-span-7 lg:col-start-6">{{ profile.summary }}</p>
    <p v-else class="max-w-[65ch] text-lg leading-8 text-[var(--foreground-muted)] lg:col-span-7 lg:col-start-6">No public biography has been added yet.</p>
  </div>
</section>
```

Do not add a category label above this heading. On mobile, this grid naturally becomes a single column.

- [ ] **Step 2: Convert the selected-work grid to a four-item asymmetric mosaic**

Keep every project state branch exactly as it is. Change only the populated `<ul>` and card layout:

```vue
<ul v-else class="home-project-mosaic" role="list">
  <li v-for="(project, projectIndex) in visibleProjects" :key="project.id" :class="`home-project-item home-project-item-${projectIndex + 1}`">
    <!-- retain the existing NuxtLink content and all conditional media/details -->
  </li>
</ul>
```

Remove the current `md:col-span-2` conditional and use the CSS item classes for desktop spans. Keep cover images real, preserve `loading="lazy"`, and use the existing typography-only project branch for projects without a cover. Remove the section-level `View all projects` link because the global nav and hero already own this intent.

- [ ] **Step 3: Replace experience cards with a sparse evidence list**

Keep loading, error, and empty branches. For populated data, retain the existing `<ol>`, date formatter, company, and up to two bullets. Remove card surfaces and use one bottom divider per item. Keep the section heading in a `lg:sticky lg:top-24 lg:self-start` column beside the list.

- [ ] **Step 4: Replace capability cards with a semantic capability matrix**

Keep loading, error, and empty branches. For populated data, use:

```vue
<ul v-else class="home-capability-matrix" role="list">
  <li v-for="([category, list], groupIndex) in skillGroups" :key="category" :class="`home-capability-group home-capability-group-${groupIndex + 1}`">
    <h3>{{ category }}</h3>
    <ul :aria-label="`${category} skills`">
      <li v-for="skill in list" :key="skill.id">{{ skill.name }}</li>
    </ul>
  </li>
</ul>
```

Do not use skill tags, cards, ratings, or progress indicators. Use text and sparse separators only.

- [ ] **Step 5: Replace the final multi-link section with one contact intent**

```vue
<section class="home-contact-cta" aria-labelledby="next-step-title">
  <div class="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-12">
    <div class="max-w-2xl">
      <h2 id="next-step-title">Need an engineer for a production problem?</h2>
      <p>Discuss a product, integration, or platform challenge directly with Nova.</p>
      <NuxtLink to="/contact">Contact Nova</NuxtLink>
    </div>
  </div>
</section>
```

Retain existing semantic focus and active styling on the link. Do not add project, blog, email, or social CTA duplicates.

- [ ] **Step 6: Verify every state still renders**

Run: `npm run build`

Expected: Type checking and template compilation complete successfully with the existing `v-if`, `v-else-if`, and `v-else` state chains intact.

### Task 4: Add Scoped Native Sticky and Motion Styles

**Files:**
- Modify: `app/assets/css/main.css:181-202`

**Interfaces:**
- Consumes: The stable class names added by Tasks 2 and 3.
- Produces: Mobile-first static hero, desktop sticky video stage, directional scrim, asymmetric mosaic, and reduced-motion fallback.

- [ ] **Step 1: Add mobile-first homepage component rules before the existing reduced-motion media query**

```css
.home-hero-stage {
  position: relative;
  min-height: min(46rem, 100dvh);
  background: var(--color-obsidian);
  color: var(--color-mint);
}

.home-hero-panel {
  position: relative;
  display: grid;
  min-height: min(46rem, 100dvh);
  overflow: clip;
  align-items: end;
}

.home-hero-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, rgb(33 22 44 / 0.96) 0%, rgb(33 22 44 / 0.84) 48%, rgb(33 22 44 / 0.46) 100%);
}

.home-hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-block: 5rem;
}

.home-hero-role,
.home-hero-summary,
.home-hero-title {
  color: inherit;
}

.home-hero-role {
  max-width: 32rem;
  font-family: var(--font-heading);
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 600;
}

.home-hero-title {
  max-width: 12ch;
  margin-top: 1rem;
  font-size: clamp(3rem, 9vw, 6rem);
  line-height: 0.98;
}

.home-hero-summary {
  max-width: 34rem;
  margin-top: 1.5rem;
  font-size: clamp(1rem, 2vw, 1.25rem);
  line-height: 1.6;
}

.home-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
}

.home-project-mosaic,
.home-capability-matrix {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.home-project-item,
.home-capability-group {
  min-width: 0;
}
```

Use page tokens rather than new hexadecimal colors except the alpha scrim. The alpha scrim is required for readable copy over arbitrary video frames.

- [ ] **Step 2: Add wide-screen hero, mosaic, and capability rules**

```css
@media (min-width: 768px) {
  .home-hero-stage {
    min-height: 170dvh;
  }

  .home-hero-panel {
    position: sticky;
    top: 4rem;
    min-height: calc(100dvh - 4rem);
  }

  .home-hero-video {
    position: absolute;
    inset: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 78% center;
  }

  .home-hero-content {
    padding-top: 6rem;
    padding-bottom: 6rem;
  }

  .home-project-mosaic {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .home-project-item-1 { grid-column: span 8 / span 8; }
  .home-project-item-2 { grid-column: span 4 / span 4; }
  .home-project-item-3 { grid-column: span 5 / span 5; }
  .home-project-item-4 { grid-column: span 7 / span 7; }

  .home-capability-matrix {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }

  .home-capability-group-1 { grid-column: span 7 / span 7; }
  .home-capability-group-2 { grid-column: span 5 / span 5; }
  .home-capability-group-3 { grid-column: span 4 / span 4; }
  .home-capability-group-4 { grid-column: span 8 / span 8; }
}
```

Add inner section styles using existing border tokens, readable text colors, and the approved 8px and 16px radius scale. Do not add equal-width project or capability cards.

- [ ] **Step 3: Add progressive entry and scroll transitions**

```css
@media (prefers-reduced-motion: no-preference) {
  .home-hero-content > div {
    animation: home-hero-enter 700ms var(--ease-out) both;
  }

  @supports (animation-timeline: view()) {
    .home-hero-panel {
      view-timeline-name: --home-hero;
      view-timeline-axis: block;
    }

    .home-hero-content > div {
      animation-name: home-hero-exit;
      animation-duration: 1ms;
      animation-timing-function: linear;
      animation-fill-mode: both;
      animation-timeline: --home-hero;
      animation-range: exit 0% exit 100%;
    }

    .home-hero-video {
      animation: home-video-exit 1ms linear both;
      animation-timeline: --home-hero;
      animation-range: exit 0% exit 100%;
    }
  }
}

@keyframes home-hero-enter {
  from { opacity: 0; transform: translateY(1rem); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes home-hero-exit {
  to { opacity: 0; transform: translateY(-2rem); }
}

@keyframes home-video-exit {
  to { opacity: 0.64; transform: scale(1.04); }
}
```

Scope scroll animation to desktop in the final CSS so mobile gets no scroll-linked effect. If a browser does not support `animation-timeline`, it retains the complete sticky scene with no exit transform.

- [ ] **Step 4: Add the reduced-motion fallback to the existing `prefers-reduced-motion: reduce` block**

```css
.home-hero-stage {
  min-height: 0;
}

.home-hero-panel {
  position: relative;
  top: auto;
  min-height: min(46rem, 100dvh);
}
```

The `showDesktopHeroVideo` computed property already removes the video. The existing global motion reset removes any remaining transition or keyframe motion.

- [ ] **Step 5: Verify CSS compiles and CSS fallbacks work**

Run: `npm run build`

Expected: Tailwind and Nuxt compile the stylesheet successfully without unsupported syntax warnings that fail the build.

### Task 5: Perform Homepage Quality Verification

**Files:**
- Modify: None unless a check identifies a defect in the two scoped files.

**Interfaces:**
- Consumes: The built homepage from Tasks 1 through 4.
- Produces: Evidence that the requested behavior works in supported and fallback modes.

- [ ] **Step 1: Run the production build**

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 2: Inspect desktop light and dark themes at 1440px**

Run: `npm run dev`

Verify:

1. Navigation remains one line and at most 80px tall.
2. The desktop video has its subject on the right, while left-side copy passes contrast over representative video frames.
3. Hero title stays within two lines and both CTA labels remain one line.
4. Hero stage sticks below the navigation for approximately one scroll transition, then yields to profile and project evidence.
5. Light and dark themes preserve hierarchy and contrast.

- [ ] **Step 3: Inspect mobile at 390px and tablet at 768px**

Verify:

1. At 390px, no hero video or portrait is in DOM or network requests.
2. At 390px, all multi-column sections collapse to one column with no horizontal page scroll.
3. At 768px, the desktop video behavior begins and crop remains right-biased.
4. All interactive controls keep visible focus and usable tap targets.

- [ ] **Step 4: Inspect reduced-motion behavior**

Enable `prefers-reduced-motion: reduce` in browser rendering emulation and verify:

1. No video element or `hero-bg.webm` request appears.
2. Hero has no sticky extended-scroll stage.
3. Copy and projects are immediately readable with no transform or opacity animation.

- [ ] **Step 5: Inspect content and static constraints**

Run: `rg -nP '\x{2014}|\x{2013}' app/pages/index.vue app/assets/css/main.css`

Expected: no matches.

Also verify:

1. Project, experience, capability, and profile loading/error/empty/retry branches are preserved.
2. No repeated portfolio CTA remains after the hero.
3. No status dots, locale strip, extra eyebrow, fake interface, progress bar, marquee, or decorative scroll cue exists.
4. Keyboard focus reaches hero actions and all subsequent links in logical order.

---

## Plan Self-Review

### Spec Coverage

- Desktop video, right-side crop, 170dvh sticky stage, and curtain exit: Tasks 1, 2, and 4.
- Mobile excludes video and portrait, without downloading the source: Tasks 1, 2, and 5.
- Reduced motion behavior: Tasks 1, 4, and 5.
- Editorial summary, mosaic projects, sparse experience, capability matrix, and one contact intent: Task 3.
- SSR, Supabase data, SEO, and state preservation: Tasks 1 through 3.
- Accessibility, contrast, performance, and no-scroll-listener constraints: Tasks 1, 2, 4, and 5.
- Build and visual verification: all tasks, with final coverage in Task 5.

### Placeholder Scan

No incomplete requirements, placeholders, speculative dependencies, or undefined interfaces remain.

### Type Consistency

`showDesktopHeroVideo`, `heroVideo`, and `heroSummary` are defined in Task 1 and consumed consistently by Task 2. CSS class names are introduced in Tasks 2 and 3 and consumed by Task 4.
