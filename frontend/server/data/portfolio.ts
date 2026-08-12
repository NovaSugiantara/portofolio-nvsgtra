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

export interface SeedProject {
  id: string
  slug: string
  title: string
  description: string | null
  tech_stack: string[]
  role: string | null
  project_url: string | null
  repo_url: string | null
  cover_image_url: string | null
  sort_order: number
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
  headline: 'Full Stack Web Developer building products from idea to production.',
  summary:
    'I design and ship production web applications across JavaScript (React, Vue) and Ruby/PHP (Rails, Laravel), with 4+ years owning payment gateways, booking engines, and blockchain platforms end to end. I also lead teams through sprint planning, code review, and mentorship.',
  location: 'Batubulan, Bali, Indonesia',
  email: 'nvsgtra425@gmail.com',
  phone: null,
  linkedin_url: 'https://linkedin.com/in/novasugiantara',
  website_url: 'https://novasugiantara.web.id',
  avatar_url: null,
}

export const projects: SeedProject[] = [
  {
    id: 'proj-booking-engine',
    slug: 'omni-hotelier-booking-engine',
    title: 'Omni Hotelier Booking Engine',
    description:
      'Led the Omni Hotelier booking engine from technical planning through delivery — coordinating product, QA, and engineering across sprints. The engine powers real-time availability, multi-currency pricing, and a checkout flow wired to several payment gateways.',
    tech_stack: ['React', 'Redux', 'Laravel', 'REST APIs', 'MySQL'],
    role: 'Product Coordinator / Lead Developer',
    project_url: null,
    repo_url: null,
    cover_image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1280&q=80',
    sort_order: 1,
  },
  {
    id: 'proj-zisu-mlm',
    slug: 'zisu-mlm-platform',
    title: 'Zisu MLM Platform',
    description:
      'Built a Laravel multi-level-marketing platform with account, network, and operational workflows, including user management for 10,000+ users, commission calculation, and an operational admin dashboard.',
    tech_stack: ['Laravel', 'JavaScript', 'MySQL', 'REST APIs'],
    role: 'Full Stack Developer',
    project_url: null,
    repo_url: null,
    cover_image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1280&q=80',
    sort_order: 2,
  },
  {
    id: 'proj-lait-bus',
    slug: 'lait-bus-booking-system',
    title: 'Lait Bus Booking System',
    description:
      'Developed a bus booking system in Ruby on Rails serving 50+ daily routes, including seat selection, schedule management, and ticketing with e-receipts.',
    tech_stack: ['Ruby on Rails', 'PostgreSQL', 'Stimulus'],
    role: 'Full Stack Developer',
    project_url: null,
    repo_url: null,
    cover_image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1280&q=80',
    sort_order: 3,
  },
  {
    id: 'proj-eurekapp',
    slug: 'eurekapp-migration',
    title: 'Eurekapp.biz Migration',
    description:
      'Migrated Eurekapp.biz from WordPress to a custom stack, cutting page load time by roughly 70% through server-side rendering, image optimisation, and a leaner asset pipeline.',
    tech_stack: ['PHP', 'JavaScript', 'CSS'],
    role: 'Full Stack Developer',
    project_url: null,
    repo_url: null,
    cover_image_url: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1280&q=80',
    sort_order: 4,
  },
  {
    id: 'proj-nft-steg',
    slug: 'nft-steganography-system',
    title: 'NFT Steganography System',
    description:
      'Developed blockchain-integrated services in Ruby on Rails and PostgreSQL, plus an NFT steganography system in Go that embeds and verifies hidden ownership metadata inside minted assets.',
    tech_stack: ['Go', 'Ruby on Rails', 'PostgreSQL', 'Web3'],
    role: 'Backend Developer',
    project_url: null,
    repo_url: null,
    cover_image_url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1280&q=80',
    sort_order: 5,
  },
  {
    id: 'proj-minyak-taru',
    slug: 'minyak-taru-bali-ecommerce',
    title: 'Minyak Taru Bali E-commerce',
    description:
      'Built a Balinese wellness e-commerce store with a catalogue, cart, and payment processing, plus an order and inventory dashboard for the shop owner.',
    tech_stack: ['Laravel', 'Vue.js', 'Midtrans', 'MySQL'],
    role: 'Full Stack Developer',
    project_url: null,
    repo_url: null,
    cover_image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1280&q=80',
    sort_order: 6,
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
    cover_image_url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1200&q=80',
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
    cover_image_url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80',
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
    cover_image_url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
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
