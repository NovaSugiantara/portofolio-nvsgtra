/**
 * Static portfolio content.
 *
 * This is the single source of truth for all public data served by the Nuxt
 * server routes (profile, projects, skills, experiences, education,
 * certifications, blog, and the generated CV). It replaces the previous
 * Supabase-backed data layer so the site is fully self-contained.
 */

export interface SeedProfile {
  id: string
  full_name: string
  headline: string
  summary: string | null
  location: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  website_url: string | null
  avatar_url: string | null
}

export interface SeedChallenge {
  platform: string
  profile_url: string
  format: 'duel' | 'brawl'
  rank: number
  entrants: number
  score: number
  submitted_at: string
}

export interface SeedProject {
  id: string
  slug: string
  kind: 'work' | 'challenge'
  title: string
  /** One sentence shown on cards. */
  summary: string
  /** Longer context for the case study page. */
  description: string | null
  /** What Nova personally did. Kept separate from team outcomes on purpose. */
  contributions: string[]
  /** Who else was involved, so team work is never presented as solo work. */
  team_note: string | null
  tech_stack: string[]
  role: string | null
  project_url: string | null
  project_url_label: string | null
  repo_url: string | null
  cover_image_url: string | null
  cover_alt: string | null
  challenge: SeedChallenge | null
  sort_order: number
}

/** Older projects that are no longer online. Listed for context only, without case study pages. */
export interface SeedEarlierWork {
  id: string
  title: string
  context: string
  period: string
  tech_stack: string[]
}

export interface SeedSkill {
  id: string
  category: string
  name: string
  sort_order: number
}

export interface SeedExperience {
  id: string
  company: string
  role: string
  location: string | null
  start_date: string
  end_date: string | null
  bullets: string[]
  sort_order: number
}

export interface SeedEducation {
  id: string
  institution: string
  degree: string
  start_date: string | null
  end_date: string | null
  is_expected: boolean
  sort_order: number
}

export interface SeedCertification {
  id: string
  name: string
  issuer: string
  issued_date: string | null
  credential_url: string | null
  sort_order: number
}

export interface SeedBlogPost {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string
  tags: string[]
  published_at: string | null
  cover_image_url: string | null
  sort_order: number
}

export const profile: SeedProfile = {
  id: 'profile-1',
  full_name: 'Nova Sugiantara',
  headline: 'Websites and web apps, built to run in production.',
  summary:
    'I am a full stack developer based in Bali. I lead booking engine development at Omni Hotelier, and I take on custom website and web app projects for businesses in Indonesia and abroad.',
  location: 'Batubulan, Bali, Indonesia',
  email: 'bussinesswithnopa@gmail.com',
  phone: null,
  linkedin_url: 'https://linkedin.com/in/novasugiantara',
  website_url: 'https://novasugiantara.web.id',
  avatar_url: null,
}

const VIBEDEV_PROFILE = 'https://www.vibedev.id/nop'

export const projects: SeedProject[] = [
  {
    id: 'proj-booking-engine',
    slug: 'omni-hotelier-booking-engine',
    kind: 'work',
    title: 'Hotel booking engine',
    summary:
      'The direct booking flow a hotel puts on its own website: room search, rates and promotions, currency switching, and checkout.',
    description:
      'Omni Hotelier builds software for hotels. The booking engine is the part a guest sees: they pick dates, compare rooms and packages, apply a promo code, and pay without leaving the hotel\'s own site. I joined the team in 2023 as a developer and now lead development of the booking engine.',
    contributions: [
      'Lead booking engine development on React, Redux, and Laravel',
      'Plan sprints and break product requirements into engineering tasks',
      'Review pull requests for correctness, consistency, and maintainability',
      'Triage production bugs by their impact on hotels and guests',
      'Integrated payment gateways including Midtrans, Xendit, and Flywire',
    ],
    team_note:
      'This is a team product. Design, QA, and several other engineers work on it with me. The screenshot shows a demo property.',
    tech_stack: ['React', 'Redux', 'Laravel', 'MySQL', 'REST APIs'],
    role: 'Lead developer, Omni Hotelier',
    project_url: 'https://swastiecocottages.reserveonline.id/book/336',
    project_url_label: 'Open the demo property',
    repo_url: null,
    cover_image_url: '/work/booking-engine.webp',
    cover_alt: 'Booking page for a demo property, with a photo gallery, room tabs, a date and guest search bar, and a reservation summary.',
    challenge: null,
    sort_order: 1,
  },
  {
    id: 'proj-bookshelf-pace',
    slug: 'reading-pace-estimator',
    kind: 'challenge',
    title: 'Reading pace estimator',
    summary:
      'Add the books you plan to read, set how many pages you read a day, and see when you will finish each one.',
    description:
      'A small single page app built for a VibeDev challenge. Every entrant gets the same brief and the entries are scored out of 100. I build these with AI coding tools, then review, test, and polish the result myself.',
    contributions: [
      'Turned the brief into a two step flow: add a book, then adjust the daily pace',
      'Designed an empty state that tells a first time visitor what to do',
      'Kept the pace control usable by keyboard as well as by dragging',
    ],
    team_note: 'Solo entry.',
    tech_stack: [],
    role: 'Solo build',
    project_url: 'https://bookshelf-reading-pace-nop-vibedev.vercel.app',
    project_url_label: 'Open the live app',
    repo_url: null,
    cover_image_url: '/work/bookshelf.webp',
    cover_alt: 'Reading Room app with a form to add a book, a daily pages slider set to 30, and an empty shelf prompt.',
    challenge: {
      platform: 'VibeDev',
      profile_url: VIBEDEV_PROFILE,
      format: 'duel',
      rank: 1,
      entrants: 2,
      score: 82,
      submitted_at: '2026-08-25',
    },
    sort_order: 2,
  },
  {
    id: 'proj-garage-sale-tags',
    slug: 'garage-sale-tag-generator',
    kind: 'challenge',
    title: 'Garage sale tag generator',
    summary:
      'Enter each item and its price, then print a sheet of tags ready to cut out.',
    description:
      'Another VibeDev challenge entry. The brief asked for a pricing tag tool; I focused on getting from an empty page to a printable sheet with as few steps as possible.',
    contributions: [
      'Split the screen into two numbered steps so the order is obvious',
      'Built a print layout separate from the on-screen layout',
      'Disabled printing until at least one tag exists, with a clear empty state',
    ],
    team_note: 'Solo entry.',
    tech_stack: [],
    role: 'Solo build',
    project_url: 'https://garage-sale-pricing-tag-nop-vibedev.vercel.app',
    project_url_label: 'Open the live app',
    repo_url: null,
    cover_image_url: '/work/garage-sale.webp',
    cover_alt: 'Garage Sale Tags app with an add item form for name, price, and condition, next to an empty print sheet.',
    challenge: {
      platform: 'VibeDev',
      profile_url: VIBEDEV_PROFILE,
      format: 'duel',
      rank: 1,
      entrants: 2,
      score: 77,
      submitted_at: '2026-08-27',
    },
    sort_order: 3,
  },
]

export const earlierWork: SeedEarlierWork[] = [
  {
    id: 'earlier-lait-bus',
    title: 'Lait bus booking system',
    context: 'Seat selection, schedules, and ticketing for a bus operator.',
    period: 'Freelance',
    tech_stack: ['Ruby on Rails', 'PostgreSQL'],
  },
  {
    id: 'earlier-zisu',
    title: 'Zisu membership platform',
    context: 'Accounts, member networks, and commission workflows.',
    period: 'Freelance',
    tech_stack: ['Laravel', 'MySQL'],
  },
  {
    id: 'earlier-eurekapp',
    title: 'Eurekapp.biz migration',
    context: 'Moved a WordPress site to a custom PHP stack.',
    period: 'Freelance',
    tech_stack: ['PHP', 'JavaScript'],
  },
  {
    id: 'earlier-minyak-taru',
    title: 'Minyak Taru Bali online store',
    context: 'Catalogue, cart, and payment for a small wellness brand.',
    period: 'Freelance',
    tech_stack: ['Laravel', 'Vue.js', 'Midtrans'],
  },
  {
    id: 'earlier-nft',
    title: 'NFT steganography service',
    context: 'Embedding and verifying ownership data inside minted images.',
    period: 'Baliola, 2022 to 2023',
    tech_stack: ['Go', 'Ruby on Rails'],
  },
  {
    id: 'earlier-videolegend',
    title: 'Videolegend.tv',
    context: 'A streaming site with paid access.',
    period: 'Bali Gatra, 2021 to 2022',
    tech_stack: ['PHP', 'JavaScript'],
  },
]

export const skills: SeedSkill[] = [
  { id: 's1', category: 'Backend engineering', name: 'Laravel', sort_order: 1 },
  { id: 's2', category: 'Backend engineering', name: 'Ruby on Rails', sort_order: 2 },
  { id: 's3', category: 'Backend engineering', name: 'Node.js', sort_order: 3 },
  { id: 's4', category: 'Backend engineering', name: 'Go', sort_order: 4 },
  { id: 's5', category: 'Backend engineering', name: 'PHP', sort_order: 5 },
  { id: 's6', category: 'Backend engineering', name: 'REST & API design', sort_order: 6 },
  { id: 's7', category: 'Frontend development', name: 'Vue.js', sort_order: 1 },
  { id: 's8', category: 'Frontend development', name: 'React', sort_order: 2 },
  { id: 's9', category: 'Frontend development', name: 'Redux', sort_order: 3 },
  { id: 's10', category: 'Frontend development', name: 'TypeScript', sort_order: 4 },
  { id: 's11', category: 'Frontend development', name: 'Tailwind CSS', sort_order: 5 },
  { id: 's12', category: 'Infrastructure & data', name: 'PostgreSQL', sort_order: 1 },
  { id: 's13', category: 'Infrastructure & data', name: 'MySQL', sort_order: 2 },
  { id: 's14', category: 'Infrastructure & data', name: 'AWS', sort_order: 3 },
  { id: 's15', category: 'Infrastructure & data', name: 'Docker', sort_order: 4 },
  { id: 's16', category: 'Infrastructure & data', name: 'CI/CD & Git', sort_order: 5 },
]

export const experiences: SeedExperience[] = [
  {
    id: 'exp-1',
    company: 'PT. Omni Hotelier International',
    role: 'Booking Engine Product Coordinator / Lead Product Developer',
    location: 'Remote',
    start_date: '2025-05-01',
    end_date: null,
    bullets: [
      'Lead end-to-end Booking Engine development with React/Redux and Laravel',
      'Own sprint planning and task breakdown, translating product requirements into engineering tasks',
      'Review pull requests for code quality, consistency, and best practices',
      'Triage production bugs, prioritising by business and user impact',
      'Coordinate between product, QA, and engineering to keep delivery predictable',
    ],
    sort_order: 1,
  },
  {
    id: 'exp-2',
    company: 'PT. Omni Hotelier International',
    role: 'Intermediate Fullstack Developer',
    location: 'Remote',
    start_date: '2024-05-01',
    end_date: '2025-05-01',
    bullets: [
      'Integrated Midtrans, Xendit, Flywire, and other payment gateways',
      'Improved third-party plugin compatibility by 40%',
      'Mentored 3 junior developers in code review and architecture decisions',
    ],
    sort_order: 2,
  },
  {
    id: 'exp-3',
    company: 'PT. Omni Hotelier International',
    role: 'Junior Full Stack Developer',
    location: 'Remote',
    start_date: '2023-02-01',
    end_date: '2024-06-01',
    bullets: [
      'Built an activity booking system handling 5K+ monthly transactions',
      'Developed API integrations for 8+ travel partners',
      'Reduced payment processing errors by 65%',
    ],
    sort_order: 3,
  },
  {
    id: 'exp-4',
    company: 'Freelance',
    role: 'Full Stack Developer',
    location: 'Bali, Indonesia',
    start_date: '2021-06-01',
    end_date: null,
    bullets: [
      'Built the Zisu MLM platform managing 10K+ users',
      'Built the Lait Bus booking system serving 50+ daily routes',
      'Migrated Eurekapp.biz from WordPress to a custom stack, improving load time by 70%',
      'Built Minyak Taru Bali e-commerce with payment processing',
    ],
    sort_order: 4,
  },
  {
    id: 'exp-5',
    company: 'Baliola',
    role: 'Backend Developer',
    location: 'Denpasar, Bali',
    start_date: '2022-08-01',
    end_date: '2023-02-01',
    bullets: [
      'Developed blockchain-integrated services with Ruby on Rails and PostgreSQL',
      'Created an NFT steganography system in Go',
      'Optimised API response times by 55%',
    ],
    sort_order: 5,
  },
  {
    id: 'exp-6',
    company: 'Bali Gatra',
    role: 'Web Developer',
    location: 'Denpasar, Bali',
    start_date: '2021-07-01',
    end_date: '2022-07-01',
    bullets: [
      'Built the Videolegend.tv streaming platform with payment integrations',
      'Implemented responsive UI for 98% cross-browser compatibility',
    ],
    sort_order: 6,
  },
]

export const education: SeedEducation[] = [
  {
    id: 'edu-1',
    institution: 'Universitas Pendidikan Ganesha',
    degree: 'B.Sc. Informatics Engineering',
    start_date: '2017-08-01',
    end_date: '2021-06-01',
    is_expected: false,
    sort_order: 1,
  },
]

export const certifications: SeedCertification[] = []

export const blogPosts: SeedBlogPost[] = [
  {
    id: 'post-booking-engine-lessons',
    slug: 'shipping-a-booking-engine-without-losing-a-night-of-sleep',
    title: 'Shipping a booking engine without losing a night of sleep',
    excerpt:
      'What actually keeps a real-time booking engine stable in production: idempotent writes, explicit failure paths, and a checkout you can reason about.',
    tags: ['booking', 'architecture', 'production'],
    published_at: '2025-11-18T09:00:00.000Z',
    cover_image_url: null,
    sort_order: 1,
    content: `A booking engine looks simple from the outside: pick a date, pay, get a confirmation. Underneath, it is one of the least forgiving systems you can build. Money moves, inventory is finite, and users retry when they are anxious.

## Make writes idempotent

The single most valuable habit is treating every booking write as something that might arrive twice. Assign an idempotency key the moment a checkout begins, and let the database — not the application — enforce that a key can only produce one reservation.

- The user double-clicks "Pay" — you charge once.
- The payment gateway retries a webhook — you record it once.
- A mobile connection drops mid-request — the retry is safe.

## Give every failure a path

Availability checks fail. Gateways time out. The question is never *if* but *what happens next*. Every failure in the checkout flow should resolve to a state the user and the operator can both understand:

1. **Pending** — we are waiting on the gateway.
2. **Confirmed** — money captured, inventory held.
3. **Released** — the hold expired and stock returned to the pool.

## Keep the checkout boring

Boring is a feature. A checkout you can read top to bottom, with explicit states and no clever shortcuts, is one you can debug at 2am. That is worth more than any micro-optimisation.

The engine that ships and stays up is almost always the one that made fewer clever choices, not more.`,
  },
  {
    id: 'post-payment-gateways',
    slug: 'integrating-payment-gateways-the-calm-way',
    title: 'Integrating payment gateways, the calm way',
    excerpt:
      'Midtrans, Xendit, Flywire — every gateway is different, but the integration shape that keeps you sane is always the same.',
    tags: ['payments', 'integration', 'laravel'],
    published_at: '2025-09-02T09:00:00.000Z',
    cover_image_url: null,
    sort_order: 2,
    content: `After integrating a handful of payment gateways, you stop seeing the differences and start seeing the pattern. Every provider is a variation on the same three moving parts.

## 1. A request you control

You build the charge request, you sign it, you send it. Keep this layer thin and provider-specific, and normalise the response into your own shape immediately.

## 2. A webhook you do not control

The webhook is the source of truth for whether money actually moved. Treat it as hostile input:

- Verify the signature before you trust a single field.
- Look the transaction up by *your* reference, not theirs.
- Make the handler idempotent — providers retry aggressively.

## 3. A reconciliation you will be glad you built

Webhooks get lost. Networks fail. A nightly reconciliation job that compares your records against the provider's ledger turns "we think we got paid" into "we know we got paid."

Wrap all three behind a single interface in your application, and swapping or adding a gateway becomes an afternoon instead of a rewrite.`,
  },
  {
    id: 'post-vue-nuxt-portfolio',
    slug: 'why-i-rebuilt-my-portfolio-in-nuxt',
    title: 'Why I rebuilt my portfolio in Nuxt',
    excerpt:
      'A personal site should be fast, accessible, and easy to update. Here is how Nuxt, a tiny design system, and server-side rendering got me there.',
    tags: ['nuxt', 'vue', 'frontend'],
    published_at: '2025-06-14T09:00:00.000Z',
    cover_image_url: null,
    sort_order: 3,
    content: `I rebuild my portfolio roughly once a year, and each time I ask the same question: what is the least amount of technology that makes this genuinely good?

## Server-side rendering, for real reasons

SSR is not about buzzwords here. It is about a first paint that is content, not a spinner, and metadata that is present the moment a link is shared. Nuxt gives me that without a build-time content pipeline to babysit.

## A design system of about ten tokens

The whole site runs on a handful of CSS variables — a couple of surfaces, two text colours, one accent, and a spacing scale. Light and dark are the same layout with a different set of values. Fewer decisions, more consistency.

## Accessibility as a default, not a pass

Skip links, focus-visible outlines, reduced-motion handling, and real semantic landmarks are cheaper to build in than to retrofit. They also happen to make the site better for everyone.

The result is a site I can update in minutes and load anywhere — which is exactly what a personal site should be.`,
  },
]
