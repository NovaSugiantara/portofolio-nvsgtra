export interface HomeProject {
  category: string
  title: string
  role?: string
  description: string
  contribution?: string
  outcome: string
  technologies: readonly string[]
}

export interface HomeExperience {
  company: string
  role: string
  period: string
  description: string
  contributions: readonly string[]
}

interface HomeFallback {
  profile: {
    fullName: string
    role: string
    location: string
    timezone: string
    email: string
    linkedinUrl: string
    githubUrl: string
    websiteUrl: string
    headline: string
    summary: string
  }
  snapshot: readonly { value: string, label: string }[]
  projects: readonly HomeProject[]
  experiences: readonly HomeExperience[]
  principles: readonly { title: string, description: string }[]
  capabilities: readonly { title: string, description: string }[]
}

export const homeFallback: HomeFallback = {
  profile: {
    fullName: 'Nova Sugiantara',
    role: 'Full Stack Web Developer',
    location: 'Batubulan, Bali, Indonesia',
    timezone: 'UTC+8',
    email: 'nvsgtra425@gmail.com',
    linkedinUrl: 'https://linkedin.com/in/novasugiantara',
    githubUrl: 'https://github.com/NovaSugiantara',
    websiteUrl: 'https://novasugiantara.web.id',
    headline: 'I build web products from idea to production.',
    summary: 'I design and ship production web applications across JavaScript (React, Vue) and Ruby/PHP (Rails, Laravel), with 4+ years owning payment gateways, booking engines, and blockchain platforms end to end. I also lead teams through sprint planning, code review, and mentorship.',
  },
  snapshot: [
    { value: '4+ years', label: 'Building and shipping production web applications' },
    { value: 'Full stack', label: 'Frontend, backend, data, and infrastructure' },
    { value: 'Team lead', label: 'Sprint planning, code review, and mentorship' },
    { value: 'Bali UTC+8', label: 'Based in Batubulan, Indonesia' },
  ],
  projects: [
    {
      category: 'Product engineering',
      title: 'Booking Engine',
      role: 'Product Coordinator / Lead Developer',
      description: 'I led the Omni Hotelier booking engine from technical planning through delivery, coordinating product, QA, and engineering across sprints.',
      contribution: 'End-to-end delivery, sprint planning, and code review',
      outcome: 'Development led from planning through production support',
      technologies: ['React', 'Redux', 'Laravel', 'REST APIs'],
    },
    {
      category: 'Platform delivery',
      title: 'Zisu MLM Platform',
      role: 'Full Stack Developer',
      description: 'I built a Laravel MLM platform with account, network, and operational workflows, including user management for 10,000+ users.',
      contribution: 'Application architecture and product delivery',
      outcome: 'User management for 10,000+ users',
      technologies: ['Laravel', 'JavaScript', 'MySQL', 'REST APIs'],
    },
    {
      category: 'Booking',
      title: 'Lait Bus Booking System',
      role: 'Full Stack Developer',
      description: 'I developed a bus booking system in Ruby on Rails serving 50+ daily routes.',
      contribution: 'Full stack implementation and data workflows',
      outcome: '50+ daily routes served',
      technologies: ['Ruby on Rails', 'PostgreSQL'],
    },
    {
      category: 'Migration',
      title: 'Eurekapp.biz Migration',
      role: 'Full Stack Developer',
      description: 'I migrated Eurekapp.biz from WordPress to a custom stack, cutting page load time.',
      contribution: 'Migration planning and custom implementation',
      outcome: 'Load time improved by 70%',
      technologies: ['PHP', 'JavaScript', 'CSS'],
    },
    {
      category: 'Blockchain',
      title: 'NFT Steganography System',
      role: 'Backend Developer',
      description: 'I developed blockchain-integrated services in Ruby on Rails and PostgreSQL, plus an NFT steganography system in Go.',
      contribution: 'Backend and data workflow engineering',
      outcome: 'Blockchain services and an NFT steganography system',
      technologies: ['Go', 'Ruby on Rails', 'PostgreSQL'],
    },
  ],
  experiences: [
    {
      company: 'PT. Omni Hotelier International',
      role: 'Booking Engine Product Coordinator / Lead Team Product Developer',
      period: 'May 2025 - Present',
      description: 'I own booking engine delivery from technical planning through production support, and coordinate product, QA, and engineering decisions.',
      contributions: [
        'Lead end-to-end Booking Engine development with React/Redux and Laravel',
        'Own sprint planning and task breakdown, translating product requirements into engineering tasks',
        'Review pull requests for code quality, consistency, and best practices',
        'Triage production bugs, prioritizing by business and user impact',
        'Coordinate between product, QA, and engineering to keep delivery predictable',
      ],
    },
    {
      company: 'PT. Omni Hotelier International',
      role: 'Intermediate Fullstack Developer',
      period: 'May 2024 - May 2025',
      description: 'I integrated payment gateways, improved third-party compatibility, and mentored junior developers.',
      contributions: [
        'Integrated Midtrans, Xendit, Flywire, and other payment gateways',
        'Improved third-party plugin compatibility by 40%',
        'Mentored 3 junior developers in code review and architecture decisions',
      ],
    },
    {
      company: 'PT. Omni Hotelier International',
      role: 'Junior Full Stack Developer',
      period: 'Feb 2023 - Jun 2024',
      description: 'I built the activity booking system and the API integrations it depends on.',
      contributions: [
        'Built an activity booking system handling 5K+ monthly transactions',
        'Developed API integrations for 8+ travel partners',
        'Reduced payment processing errors by 65%',
      ],
    },
    {
      company: 'Freelance Fullstack Developer',
      role: 'Full Stack Developer',
      period: 'Jun 2021 - Present',
      description: 'I build business and booking products for clients with Laravel and Ruby on Rails.',
      contributions: [
        'Built the Zisu MLM platform managing 10K+ users',
        'Built the Lait Bus booking system serving 50+ daily routes',
        'Migrated Eurekapp.biz from WordPress to a custom stack, improving load time by 70%',
        'Built Minyak Taru Bali e-commerce with payment processing',
      ],
    },
    {
      company: 'Baliola - Denpasar, Bali',
      role: 'Backend Developer',
      period: 'Aug 2022 - Feb 2023',
      description: 'I built blockchain-integrated services and optimized backend performance.',
      contributions: [
        'Developed blockchain-integrated services with Ruby on Rails and PostgreSQL',
        'Created an NFT steganography system in Go',
        'Optimized API response times by 55%',
      ],
    },
    {
      company: 'Bali Gatra - Denpasar, Bali',
      role: 'Web Developer',
      period: 'Jul 2021 - Jul 2022',
      description: 'I built the Videolegend.tv streaming platform and its responsive interface.',
      contributions: [
        'Built the Videolegend.tv streaming platform with payment integrations',
        'Implemented responsive UI for 98% cross-browser compatibility',
      ],
    },
  ],
  principles: [
    { title: 'Production responsibility', description: 'I prioritize data safety, failure recovery, and real user impact.' },
    { title: 'Maintainable delivery', description: 'I use reviews, clear boundaries, and incremental implementation.' },
    { title: 'Cross-team clarity', description: 'I translate constraints between product, quality assurance, and engineering.' },
    { title: 'AI with purpose', description: 'I use language models and automation when they improve real workflows.' },
  ],
  capabilities: [
    { title: 'Backend engineering', description: 'Laravel, Ruby on Rails, Node.js, Go, PHP, APIs, and integrations.' },
    { title: 'Frontend development', description: 'Vue.js, React, Redux, JavaScript, responsive UI, HTML, and CSS.' },
    { title: 'Infrastructure and data', description: 'PostgreSQL, MySQL, AWS, Docker, CI/CD, Git, and production debugging.' },
  ],
}