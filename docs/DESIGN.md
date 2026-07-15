# Design Tokens & System Specification

## Nova Sugiantara Portfolio

This document defines the comprehensive Design Token system and UI Architecture for Nova Sugiantara's professional portfolio and CV-builder web platform. It establishes a cohesive visual language utilizing the requested color palette (`#321E48`, `#43637E`, `#65DCD5`, and `#D9FFF4`), supports full Light and Dark modes, and specifies a highly modern, responsive grid-based structure.

---

## 1. Core Color System & Theme Mapping

The chosen palette establishes a striking, high-tech, yet professional tone. It shifts away from generic monochrome grays to a sophisticated interplay between **Deep Obsidian Purple** and **Luminous Mint/Aqua**.

### 1.1 The Palette

- **Deep Obsidian Purple (`#321E48`):** An ultra-dark, rich amethyst tone. Serves as the foundation for Dark Mode backgrounds and high-contrast Light Mode headings.
- **Steel Blue-Gray (`#43637E`):** A muted slate blue. Serves as secondary backgrounds, borders, card fills, and muted text.
- **Bright Teal Aurora (`#65DCD5`):** A vibrant, high-energy cyan-teal. Used as the primary action/accent color for CTAs, highlights, active states, and interactive elements.
- **Mint Cream (`#D9FFF4`):** An ultra-light, crisp mint-tinted off-white. Serves as the clean, refreshing background for Light Mode and high-contrast dark-mode elements.

### 1.2 Semantic Theme Mapping (Light vs. Dark)

To guarantee AA/AAA contrast ratios (WCAG) and visual harmony, the tokens are mapped as follows:

| Semantic Token         | Light Mode Value             | Dark Mode Value                 | Usage Description                           |
| :--------------------- | :--------------------------- | :------------------------------ | :------------------------------------------ |
| `background-page`      | `#D9FFF4` (Mint Cream)       | `#321E48` (Obsidian Purple)     | Default page-level body background          |
| `background-card`      | `#FFFFFF` (Pure White)       | `#43637E` (Steel Blue-Gray)     | Card, modal, and container background       |
| `background-muted`     | `#E8FFF9` (Light Mint Blend) | `#3C2454` (Lighter Obsidian)    | Alternating grid blocks or inline code      |
| `foreground-primary`   | `#321E48` (Obsidian Purple)  | `#D9FFF4` (Mint Cream)          | High-contrast headings and body text        |
| `foreground-secondary` | `#43637E` (Steel Blue-Gray)  | `#A3C0D9` (Lightened Steel)     | Subheadings, dates, and paragraph text      |
| `foreground-muted`     | `#668096` (Muted Steel)      | `#7998B3` (Muted Steel Light)   | Captions, disabled text, and breadcrumbs    |
| `accent-primary`       | `#2D9C96` (Darkened Teal)    | `#65DCD5` (Bright Teal)         | Key CTAs, active states, and highlights     |
| `accent-hover`         | `#1F7A75` (Deep Teal)        | `#4BBDB6` (Slightly Muted Teal) | Interactive hover states on accent elements |
| `border-subtle`        | `#CCEBE2` (Pale Mint Border) | `#43637E` (Steel Blue-Gray)     | Grid lines, card borders, and divider lines |
| `border-focus`         | `#2D9C96` (Darkened Teal)    | `#65DCD5` (Bright Teal)         | Keyboard focus ring outlines                |

---

## 2. CSS Variables Specification

Implement these design tokens inside your main stylesheet (`assets/css/main.css` or equivalent) to manage standard-compliant CSS variables:

```css
:root {
  /* Color Tokens - Light Mode Default */
  --color-obsidian: #321e48;
  --color-steel: #43637e;
  --color-teal: #65dcd5;
  --color-mint: #d9fff4;

  /* Semantic Mappings */
  --background-page: var(--color-mint);
  --background-card: #ffffff;
  --background-muted: #e8fff9;

  --foreground-primary: var(--color-obsidian);
  --foreground-secondary: var(--color-steel);
  --foreground-muted: #668096;

  --accent-primary: #2d9c96; /* Darkened for contrast on light bg */
  --accent-hover: #1f7a75;
  --accent-glow: rgba(101, 220, 213, 0.15);

  --border-subtle: #ccebe2;
  --border-focus: var(--accent-primary);

  /* Typography & Layout Scales */
  --font-heading:
    "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-body:
    "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  --shadow-sm: 0 1px 2px 0 rgba(50, 30, 72, 0.05);
  --shadow-md:
    0 4px 6px -1px rgba(50, 30, 72, 0.08), 0 2px 4px -1px rgba(50, 30, 72, 0.04);
  --shadow-lg:
    0 10px 15px -3px rgba(50, 30, 72, 0.1),
    0 4px 6px -2px rgba(50, 30, 72, 0.05);

  --transition-smooth: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.dark {
  /* Semantic Mappings - Dark Mode */
  --background-page: var(--color-obsidian);
  --background-card: var(--color-steel);
  --background-muted: #3c2454;

  --foreground-primary: var(--color-mint);
  --foreground-secondary: #a3c0d9;
  --foreground-muted: #7998b3;

  --accent-primary: var(--color-teal);
  --accent-hover: #4bbdb6;
  --accent-glow: rgba(101, 220, 213, 0.3);

  --border-subtle: rgba(101, 220, 213, 0.15);
  --border-focus: var(--color-teal);

  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
  --shadow-md: 0 4px 12px -1px rgba(0, 0, 0, 0.6);
  --shadow-lg: 0 16px 24px -3px rgba(0, 0, 0, 0.7);
}
```

---

## 3. Typography Hierarchy

Consistent, highly legible type scales supporting both UI interaction and long-form technical reading (such as resume timeline entries and technical blog articles).

### 3.1 Font Selection

- **Headings:** `Outfit` (Geometric, clean, modern, slightly wide, excellent tracking at large scales).
- **Body Copy:** `Plus Jakarta Sans` (Extremely legible, balanced, modern humanistic sans-serif designed for screens).
- **Monospace (Code & Tech Badges):** `JetBrains Mono` (High legibility, ideal for showing technical tech-stacks like Laravel, Vue.js, Docker).

### 3.2 Sizing & Weights (Tailwind-compatible)

| Token Name     | Font Size           | Line Height | Weight (Heading/Body)            | Key Use Cases                             |
| :------------- | :------------------ | :---------- | :------------------------------- | :---------------------------------------- |
| `text-display` | `48px` / `3.0rem`   | `1.1`       | `800` (ExtraBold)                | Hero main headline (Nova Sugiantara)      |
| `text-h1`      | `36px` / `2.25rem`  | `1.2`       | `700` (Bold)                     | Main page titles (e.g. Portfolio, Blog)   |
| `text-h2`      | `24px` / `1.5rem`   | `1.3`       | `700` (Bold)                     | Major section headings (e.g., Experience) |
| `text-h3`      | `18px` / `1.125rem` | `1.4`       | `600` (SemiBold)                 | Cards titles, company names               |
| `text-body`    | `16px` / `1.0rem`   | `1.6`       | `400` (Regular) / `500` (Medium) | Main readable text, paragraph content     |
| `text-sm`      | `14px` / `0.875rem` | `1.5`       | `400` / `500`                    | Subtext, timestamps, tag badges           |
| `text-xs`      | `12px` / `0.75rem`  | `1.5`       | `600` (SemiBold)                 | Micro-caps, structural metadata           |

---

## 4. UI Grid & Layout Architecture

The overall layout is built around a strict, responsive 12-column grid system, offering massive visual structure and clean alignments from mobile through large desktop displays.

### 4.1 Global Layout Containers

- **Max Width:** Limited to `1280px` (`max-w-7xl` in Tailwind) to keep long-form content readable and visually anchored on ultrawide monitors.
- **Gutter Spacing:**
  - Mobile (`sm`): `16px` (`px-4`)
  - Tablet (`md`): `24px` (`px-6`)
  - Desktop (`lg`+): `48px` (`px-12`)

### 4.2 Grid Structure Breakdown

```
+-----------------------------------------------------------------------+
|  HEADER: [Logo / Name]                           [Nav Links] [Theme]  |
+-----------------------------------------------------------------------+
|                                                                       |
|  HERO GRID:                                                           |
|  +---------------------------------+ +------------------------------+ |
|  | COLUMN 1 (58% / md:6-cols):      | | COLUMN 2 (42% / md:6-cols):  | |
|  | - Intro Badge                   | |                              | |
|  | - Title / Headline              | |         PHOTO CONTAINER      | |
|  | - Brief Summary                 | |         (Dynamic Masked      | |
|  | - Primary & Secondary CTAs      | |          Smart Canvas)       | |
|  |                                 | |                              | |
|  +---------------------------------+ +------------------------------+ |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|  BODY GRID (Example: Portofolio Projects - Responsive Grid):          |
|  +----------------+  +----------------+  +----------------+           |
|  | 1-col (Mobile) |  | 1-col (Mobile) |  | 1-col (Mobile) |           |
|  | 2-col (Tablet) |  | 2-col (Tablet) |  | 2-col (Tablet) |           |
|  | 3-col (Desktop)|  | 3-col (Desktop)|  | 3-col (Desktop)|           |
|  +----------------+  +----------------+  +----------------+           |
|                                                                       |
+-----------------------------------------------------------------------+
|  FOOTER: [Copyright Info]                        [Social Connections] |
+-----------------------------------------------------------------------+
```

---

## 5. The "Universal-Fit" Hero Photo System

To guarantee that **any** user photo (whether a professional studio portrait, a casual snapshot, or a temporary avatar placeholder) fits seamlessly into the theme without disrupting the visual design, we utilize a custom **Triple-Layer Responsive Canvas**.

### 5.1 Mechanical Rules of the Photo Container

1.  **Fixed Aspect Ratio:** Forced `1:1` square aspect ratio with safe center alignment.
2.  **Geometric Masking:** Rendered inside a soft octagon, squircle, or highly stylized thick border frame to make rough edges invisible.
3.  **Color Blending & Duotone (Optional CSS Fallback):** Overlaid with a CSS mix-blend-mode filter so that color profiles of different images harmonize with the primary brand palette.
4.  **Floating Backdrop Glow:** A blurred, glowing vector background behind the photo utilizes the Accent color (`#65DCD5`), anchoring the portrait in space.

### 5.2 HTML & Tailwind Construction for the Portrait Wrapper

```html
<!-- The Outer Container with Glow effect -->
<div
  class="relative w-full max-w-[340px] md:max-w-[400px] aspect-square mx-auto"
>
  <!-- Glowing Ambient Circle Background -->
  <div
    class="absolute inset-0 rounded-full bg-[var(--accent-primary)] opacity-20 blur-3xl transform scale-95 transition-all duration-700 hover:scale-105"
  ></div>

  <!-- Outer Styled Border Frame -->
  <div
    class="absolute inset-2 rounded-2xl border-2 border-[var(--accent-primary)] border-dashed opacity-40 animate-[spin_80s_linear_infinite]"
  ></div>

  <!-- Main Image Mask Canvas -->
  <div
    class="absolute inset-6 rounded-2xl overflow-hidden bg-[var(--background-muted)] border border-[var(--border-subtle)] shadow-xl transition-all duration-300 hover:translate-y-[-4px]"
  >
    <!-- Duotone Tint Layer (Ensures cohesive blending, toggles off on hover) -->
    <div
      class="absolute inset-0 bg-gradient-to-tr from-[var(--color-obsidian)] to-[var(--color-steel)] mix-blend-color opacity-45 z-10 transition-opacity duration-300 pointer-events-none hover:opacity-0"
    ></div>

    <!-- Image with precise object fit alignment -->
    <img
      src="/images/placeholder-portrait.jpg"
      alt="Nova Sugiantara portrait placeholder"
      class="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-500 scale-100 hover:scale-105"
    />
  </div>

  <!-- Accent Floating Design Elements (No Emojis) -->
  <div
    class="absolute bottom-4 right-4 bg-[var(--background-card)] border border-[var(--border-subtle)] text-[var(--foreground-primary)] text-xs font-mono py-1.5 px-3 rounded-lg shadow-lg z-20 flex items-center gap-1.5"
  >
    <span
      class="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-ping"
    ></span>
    <span>Available for Hire</span>
  </div>
</div>
```

---

## 6. Layout Component Guidelines

### 6.1 Persistent Header (Sticky Glassmorphic)

- **Layout:** Responsive flex-row. Left side contains the brand mark (`Nova Sugiantara` or `N.S`), right side hosts navigation links and the Light/Dark mode switcher toggle.
- **Glassmorphism Properties:**
  - Light Mode: `rgba(217, 255, 244, 0.75)` background with `backdrop-filter: blur(12px)`.
  - Dark Mode: `rgba(50, 30, 72, 0.75)` background with `backdrop-filter: blur(12px)`.
- **Active Link State:** Indicator using a bottom `2px` solid line or simple solid badge text colored with `var(--accent-primary)`.

### 6.2 Grid-Aligned Project Showcase (Portofolio)

- **Grid Structure:**
  - Mobile: `grid-cols-1`
  - Tablet: `grid-cols-2`
  - Desktop: `grid-cols-3`
  - Gap size: `24px` (`gap-6`)
- **Project Card Behaviors:**
  - Background filled with `var(--background-card)`, outlined with `1px solid var(--border-subtle)`.
  - On Hover: Shift upward by `-4px`, transition shadow from `shadow-md` to `shadow-lg`, and scale accent badge colors dynamically.
  - Technology Badges: High contrast, rendered in `font-mono` at `text-xs`, containing zero emojis.

### 6.3 Experience Timeline (Visual Structure)

- **Grid Alignment:** A 2-column layout on desktop:
  - Left column (width 30%): Dates and Company name.
  - Right column (width 70%): Role, technical achievements, and scope list.
- **Vertical Connector:** A solid track line colored `var(--border-subtle)` running vertically down the timeline, punctuated by small glowing concentric dots colored in `var(--accent-primary)`.

### 6.4 Minimalist Footer

- **Grid Alignment:** 3-column clean column structure on desktop, stacking into a single column on mobile.
  - Col 1: Branding block, short mission text, copyright statement.
  - Col 2: Technical profile tags (Laravel, Vue.js, React, Ruby on Rails, AWS).
  - Col 3: Social and contact connection links (GitHub, LinkedIn, Email, WhatsApp).
- **Divider:** A horizontal border rule (`border-t border-[var(--border-subtle)]`) running fully across the viewport width.

---

## 7. Iconographic System & Standards

To protect professional credibility and aesthetic maturity, **no graphic emojis are permitted in the visual layout**. Instead, semantic vector icons are utilized to index and clarify structural components.

### 7.1 Selected Icon Set

- **Core Library:** `Lucide Icons` (highly optimized, consistent line weights, easily styled via CSS and Tailwind classes).
- **Styling Rules:** Match surrounding text size and colored with `var(--foreground-secondary)` for static UI, and transitioning to `var(--accent-primary)` on hover or focus states.

### 7.2 Semantic Icon Mappings

| UI Scenario / Category       | Selected Lucide Icon           | CSS Styling / Context                                        |
| :--------------------------- | :----------------------------- | :----------------------------------------------------------- |
| **Email Address**            | `Mail`                         | `w-4 h-4 text-[var(--foreground-secondary)]`                 |
| **Phone / WhatsApp**         | `PhoneCall` or `MessageSquare` | Floating bottom right button uses custom SVG for official WA |
| **Physical Location**        | `MapPin`                       | Featured on hero card                                        |
| **External Link / Projects** | `ExternalLink`                 | Attached to project showcase action cards                    |
| **Source Code Repository**   | `Github`                       | Positioned in headers, cards, and footer                     |
| **Professional Network**     | `Linkedin`                     | Placed in header and contact blocks                          |
| **Experience Timeline**      | `Briefcase`                    | Bullet heads or timeline headers                             |
| **Academic / Education**     | `GraduationCap`                | Highlighted on certifications and university rows            |
| **Certifications**           | `Award`                        | Positioned adjacent to course titles                         |
| **Light Theme Active**       | `Sun`                          | Active indicator inside header toggle                        |
| **Dark Theme Active**        | `Moon`                         | Active indicator inside header toggle                        |
| **Interactive Chevron**      | `ArrowUpRight`                 | Affixed to action CTAs, conveying forward movement           |

---

## 8. Tailwind CSS Integration Configuration

This snippet details how to incorporate these exact token structures directly into your `tailwind.config.ts` or local styles file:

```typescript
import type { Config } from "tailwindcss";

export default {
  darkMode: "class", // Enables class-based dark mode toggling
  theme: {
    extend: {
      colors: {
        brand: {
          obsidian: "#321E48",
          steel: "#43637E",
          teal: "#65DCD5",
          mint: "#D9FFF4",
        },
        background: {
          page: "var(--background-page)",
          card: "var(--background-card)",
          muted: "var(--background-muted)",
        },
        foreground: {
          primary: "var(--foreground-primary)",
          secondary: "var(--foreground-secondary)",
          muted: "var(--foreground-muted)",
        },
        accent: {
          primary: "var(--accent-primary)",
          hover: "var(--accent-hover)",
        },
        border: {
          subtle: "var(--border-subtle)",
          focus: "var(--border-focus)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      transitionProperty: {
        smooth: "var(--transition-smooth)",
      },
    },
  },
  plugins: [],
} as Config;
```

---

## 9. Motion System: Animations & Parallax Effects

To elevate the interactive experience without compromising performance or causing motion sickness (respecting user `prefers-reduced-motion` settings), we establish a hardware-accelerated **Motion System**. This system governs page transition states, scroll-driven parallax backdrops, and hover-triggered micro-interactions.

### 9.1 CSS Keyframes & Custom Classes

Implement these animations inside your main stylesheet (`assets/css/main.css`). They use `will-change` properties to enforce GPU acceleration:

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) rotate(3deg);
  }
}

@keyframes pulseGlow {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.05);
  }
}

/* Custom Animation Utility Classes */
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-float-slow {
  animation: float 8s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulseGlow 10s ease-in-out infinite;
}
```

### 9.2 Scroll-Driven Parallax Backdrop (Hero Section)

To create a volumetric visual space, the Hero background features layered elements shifting at different relative scroll speeds.

#### A. Pure CSS Parallax (Perspective Architecture)

Structure the main section utilizing a 3D perspective to offload scroll calculation directly to the browser:

```css
.parallax-container {
  perspective: 2px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
}

/* Base structural layers */
.parallax-layer-back {
  transform: translateZ(-1px) scale(1.5);
  pointer-events: none;
  z-index: 1;
}

.parallax-layer-mid {
  transform: translateZ(-0.5px) scale(1.25);
  pointer-events: none;
  z-index: 2;
}

.parallax-layer-base {
  transform: translateZ(0);
  z-index: 3;
}
```

#### B. Dynamic JavaScript Parallax (Optional Tailwind Integration)

If implementing a dynamic parallax effect inside single-page Vue or static HTML layouts, bind elements to a scroll handler to adjust translation parameters smoothly:

```html
<!-- Parallax Accent Blur Circles -->
<div
  class="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-[var(--accent-primary)] opacity-15 blur-3xl pointer-events-none transition-transform duration-75 ease-out"
  id="parallax-glow-left"
></div>

<script>
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    const glow = document.getElementById("parallax-glow-left");
    if (glow) {
      // Moves at a quarter of the scroll speed
      glow.style.transform = `translateY(${scrollY * 0.25}px)`;
    }
  });
</script>
```

### 9.3 Motion Application to Components

#### 1. Page Section Scroll-Reveal

Apply `.animate-fade-in-up` to cards and text blocks as they enter the viewport using an Intersection Observer:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up");
      }
    });
  },
  { threshold: 0.1 },
);

document
  .querySelectorAll(".reveal-on-scroll")
  .forEach((el) => observer.observe(el));
```

#### 2. Hover Card Parallax (Depth Effect)

Apply a simple multi-layer parallax transition inside **Portfolio Project Cards**:

- The parent container scale-shifts on hover: `transition-all duration-300 hover:-translate-y-2 hover:shadow-lg`
- The project image scales dynamically inside its masked frame: `scale-100 hover:scale-105 transition-transform duration-500`

### 9.4 Accessibility Constraint (Respecting System Preferences)

For users who prefer minimized motion (vestibular safety), you must disable all transition scales, keyframes, and scroll translations using a media query:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-delay: -1ms !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    background-attachment: initial !important;
    scroll-behavior: auto !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }

  .parallax-layer-back,
  .parallax-layer-mid,
  #parallax-glow-left {
    transform: none !important;
  }
}
```

## 10. Accessibility (a11y) Checkpoints

1.  **Text Contrast:** Contrast must always exceed 4.5:1 ratio on standard bodies. In Light Mode, active primary buttons with background `#2D9C96` must contain white text. In Dark Mode, text resting on `#321E48` must use Mint Cream (`#D9FFF4`).
2.  **Interactive Focus Indicators:** Any active button or text link must display a visible outline focus ring (`var(--border-focus)`) on keyboard tab navigation.
3.  **Color Independence:** Do not rely on color status only. Important indicators (like validation states or timeline checkpoints) must combine explicit icons (e.g., `CheckCircle`, `AlertCircle`) alongside standard color shifts.
