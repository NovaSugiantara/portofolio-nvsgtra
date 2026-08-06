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
    headline: 'Full stack engineering from product idea to production.',
    summary: 'I build production web applications across frontend and backend, then help teams plan, review, and ship them with confidence.',
  },
  snapshot: [
    { value: '4+ years', label: 'Designing and shipping production web applications' },
    { value: 'Full stack', label: 'Frontend, backend, data, and infrastructure' },
    { value: 'Team work', label: 'Planning, code review, and mentorship' },
    { value: 'Bali UTC+8', label: 'Based in Batubulan, Indonesia' },
  ],
  projects: [
    {
      category: 'Product engineering',
      title: 'Omni Hotelier product engineering',
      role: 'Lead role',
      description: 'Led full stack product delivery from technical planning and task breakdown through code review, cross-team coordination, and production support.',
      contribution: 'Planning, delivery leadership, code review, and incident triage',
      outcome: 'Product, quality assurance, and engineering coordination',
      technologies: ['Laravel', 'React', 'Redux', 'REST APIs'],
    },
    {
      category: 'Platform delivery',
      title: 'Zisu business platform',
      role: 'Full Stack Developer',
      description: 'Built a Laravel platform with account, network, and operational workflows for a real business environment.',
      contribution: 'Application architecture and product delivery',
      outcome: 'Business workflow implementation',
      technologies: ['Laravel', 'JavaScript', 'MySQL', 'REST APIs'],
    },
    {
      category: 'Migration',
      title: 'Eurekapp.biz rebuild',
      description: 'Migrated a WordPress site to a custom stack for clearer ownership, maintainability, and delivery control.',
      outcome: 'Custom application stack',
      technologies: ['PHP', 'JavaScript', 'CSS'],
    },
    {
      category: 'Blockchain',
      title: 'NFT steganography system',
      description: 'Developed blockchain services with Ruby on Rails and PostgreSQL plus an NFT steganography system in Go.',
      outcome: 'Backend and data workflow engineering',
      technologies: ['Go', 'Ruby on Rails', 'PostgreSQL'],
    },
    {
      category: 'Streaming',
      title: 'Videolegend.tv',
      description: 'Built a PHP streaming platform and a responsive interface for broad browser support.',
      outcome: 'Full stack web delivery',
      technologies: ['PHP', 'JavaScript', 'HTML', 'CSS'],
    },
  ],
  experiences: [
    {
      company: 'PT. Omni Hotelier International',
      role: 'Product Coordinator / Lead Team Product Developer',
      period: 'May 2025 - Present',
      description: 'Own planning and delivery for a production web product while coordinating product, quality assurance, and engineering decisions.',
      contributions: [
        'Translate business requirements into engineering work',
        'Review pull requests and guide implementation quality',
        'Triage production issues by business impact',
        'Keep sprint delivery aligned across disciplines',
      ],
    },
    {
      company: 'PT. Omni Hotelier International',
      role: 'Intermediate and Junior Fullstack Developer',
      period: 'February 2023 - May 2025',
      description: 'Built integrations, improved third-party compatibility, mentored junior developers, and contributed to production applications.',
      contributions: [],
    },
    {
      company: 'Freelance, Baliola, and Bali Gatra',
      role: 'Full Stack and Backend Engineering',
      period: '2021 - Present',
      description: 'Delivered business, commerce, transportation, streaming, and blockchain products with Laravel, Rails, Go, PHP, and modern frontend tools.',
      contributions: [],
    },
  ],
  principles: [
    { title: 'Production responsibility', description: 'Prioritize data safety, failure recovery, and real user impact.' },
    { title: 'Maintainable delivery', description: 'Use reviews, clear boundaries, and incremental implementation.' },
    { title: 'Cross-team clarity', description: 'Translate constraints between product, quality assurance, and engineering.' },
    { title: 'AI with purpose', description: 'Explore language models and automation when they improve real workflows.' },
  ],
  capabilities: [
    { title: 'Backend engineering', description: 'Laravel, Ruby on Rails, Node.js, Go, PHP, APIs, and integrations.' },
    { title: 'Frontend development', description: 'Vue.js, React, Redux, JavaScript, responsive UI, HTML, and CSS.' },
    { title: 'Infrastructure and data', description: 'PostgreSQL, MySQL, AWS, Docker, CI/CD, Git, and production debugging.' },
  ],
}
