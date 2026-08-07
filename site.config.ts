// site.config.ts — THE ONLY FILE TO EDIT to rebrand or reconfigure this site
// All sections, copy, FAQ, pricing, and layout variants are driven from here.

export type HeroVariant = 'split' | 'centered' | 'minimal'

export interface SiteConfig {
  siteName: string
  domain: string
  themeColor: string
  heroBadge: string
  headline: string[]
  subheadline: string
  ctaPrimary: { text: string; href: string }
  ctaSecondary: { text: string; href: string }
  freeTier: {
    pills: string[]
    gateHeadline: string
    gateSubtext: string
    gateCtaText: string
    gateCtaHref: string
    gateSecondaryText: string
  }
  socialProof: {
    marqueeItems: string[]
    stat?: string
  }
  howItWorks: Array<{ step: number; icon: string; title: string; desc: string }>
  features: Array<{ icon: string; title: string; desc: string; size?: 'large' | 'wide' | 'medium' }>
  pricing: {
    free: { name: string; price: string; period: string; features: Array<{ text: string; included: boolean }>; cta: { text: string; href: string } }
    pro:  { name: string; price: string; period: string; badge?: string; features: Array<{ text: string; included: boolean }>; cta: { text: string; href: string } }
  }
  faq: Array<{ q: string; a: string }>
  finalCta: { headline: string; subtext: string; ctaText: string; ctaHref: string }
  layout: { heroVariant: HeroVariant; sectionOrder: string[]; hideSections: string[] }
  seo: { title: string; description: string; ogImage: string; llmsDescription: string }
  nav: Array<{ label: string; href: string }>
  chatbot: { welcomeMessage: string; botName: string; placeholder: string; suggestedQuestions?: string[] }
}

export const siteConfig: SiteConfig = {
  siteName:   'Tutiq',
  domain:     'tutiq.app',
  themeColor: 'emerald',

  heroBadge:    'tutiq · AI tutor · free to start',
  headline:     ['Your AI Tutor for 11+,', 'GCSE and A-Level — That Actually Explains'],
  subheadline:  'Ask it anything. It teaches, tests, and adapts to your exam board — no worksheets, no waiting, no expensive tutors.',
  ctaPrimary:   { text: '🎓 Start Learning Free →', href: '/onboard' },
  ctaSecondary: { text: '📚 See All Subjects',       href: '/#features' },

  freeTier: {
    pills:             ['✅ No account needed', '📚 All subjects', '📱 Any device'],
    gateHeadline:      "You've used your 3 free sessions!",
    gateSubtext:       "You're making great progress. Unlock unlimited sessions to keep going.",
    gateCtaText:       'Upgrade to Pro — $8/mo',
    gateCtaHref:       '/pricing',
    gateSecondaryText: 'Come back free tomorrow',
  },

  socialProof: {
    marqueeItems: [
      '📐 Maths', '🔬 Science', '✍️ English', '📜 History',
      '💻 Coding', '🌍 Geography', '🧪 Chemistry', '📊 Statistics',
      '💼 Interview Prep', '🎓 GCSE', '⭐ 11+ Prep', '🌐 Languages',
    ],
  },

  howItWorks: [
    { step: 1, icon: '🤔', title: 'Tell us where you\'re stuck', desc: 'Pick a subject or describe your problem in plain English — no forms, no setup.' },
    { step: 2, icon: '🗺️', title: 'AI builds your learning path', desc: 'Tutiq creates a personalised step-by-step plan — only the topics you actually need.' },
    { step: 3, icon: '🏆', title: 'Learn, quiz, earn badges', desc: 'Clear explanations, then a quick quiz to cement knowledge. Celebrate every win.' },
  ],

  features: [
    { icon: '🧠', title: 'Adapts to your level',  desc: 'AI adjusts language and depth to match your age, subject level, and pace — never too easy, never overwhelming.', size: 'large'  },
    { icon: '🗺️', title: 'Learning paths',         desc: 'Structured topic-by-topic progression so you never wonder what to study next.',                               size: 'medium' },
    { icon: '⚡', title: 'Instant explanations',  desc: 'Get a clear, personalised answer in seconds — any topic, any time.',                                           size: 'medium' },
    { icon: '🎯', title: 'Quiz after every topic', desc: 'A 5-question micro-quiz after each lesson locks in what you just learned.',                                    size: 'wide'   },
    { icon: '🔁', title: 'Spaced repetition',     desc: 'Tutiq brings back topics you found tricky at the right moment — proven memory technique.',                     size: 'medium' },
  ],

  pricing: {
    free: {
      name: 'Free', price: '$0', period: 'forever',
      features: [
        { text: '3 sessions per day',        included: true  },
        { text: '3 subjects available',       included: true  },
        { text: 'Step-by-step explanations',  included: true  },
        { text: 'Quiz after each topic',      included: true  },
        { text: 'Progress tracking',          included: false },
        { text: 'No ads',                     included: false },
      ],
      cta: { text: 'Start Free', href: '/onboard' },
    },
    pro: {
      name: 'Pro', price: '$8', period: '/month', badge: 'Popular',
      features: [
        { text: 'Unlimited sessions',         included: true },
        { text: 'All subjects unlocked',      included: true },
        { text: 'Progress tracking',          included: true },
        { text: 'PDF study guides',           included: true },
        { text: 'Mock exam mode',             included: true },
        { text: 'Priority AI responses',      included: true },
      ],
      cta: { text: 'Upgrade to Pro', href: '/pricing' },
    },
  },

  faq: [
    { q: 'Is Tutiq free to use?',
      a: 'Yes — Tutiq is free to start. You get 3 tutoring sessions every day with no credit card or account required.' },
    { q: 'How does Tutiq adapt to my level?',
      a: 'Tutiq uses AI to adjust its explanations based on your age, subject level, and learning pace. Younger learners get simpler language; advanced students get deeper explanations with more nuance.' },
    { q: 'What subjects does Tutiq cover?',
      a: 'Tutiq covers GCSE core subjects (Maths, English, Combined or Triple Science, History, Geography, Computer Science, French, Spanish), 11+ Prep (verbal reasoning, non-verbal reasoning, maths and comprehension), interview preparation (tech, general job interviews, NHS/clinical, and law), plus adult learning topics like coding, personal finance, and functional English and maths.' },
    { q: 'Does Tutiq follow my exam board?',
      a: 'Yes — for GCSE subjects, Tutiq uses exam-board specific language (AQA, Edexcel, or OCR) and explains command words like describe, explain, analyse and evaluate, with worked examples written in mark-scheme style so you can see exactly what earns marks.' },
    { q: 'Can Tutiq help with 11+ preparation?',
      a: 'Yes — Tutiq gives 9-11 year olds short, encouraging practice on verbal reasoning, non-verbal reasoning, maths and comprehension, with an explanation and a quick practice question after each concept, building speed and confidence for the exam.' },
    { q: 'Does Tutiq do mock interviews?',
      a: 'Yes — for tech interviews Tutiq covers data structures, algorithms and system design; for general job interviews it uses the STAR method with real example answers; it also covers NHS/clinical values-based interviews and law training-contract interviews, including common mistakes to avoid.' },
    { q: 'Does Tutiq work on phones and tablets?',
      a: 'Yes — Tutiq works on any device with a browser. No download or app required.' },
    { q: 'What does Pro include?',
      a: 'Pro unlocks unlimited sessions, all subjects, progress tracking, PDF study guides, mock exam mode, and priority AI responses for $8/month.' },
  ],

  finalCta: {
    headline: 'Ready for your first lesson?',
    subtext:  'Start free. No account. Adapts to you.',
    ctaText:  '🎓 Start Learning Free →',
    ctaHref:  '/onboard',
  },

  layout: {
    heroVariant:  'split',
    sectionOrder: ['hero', 'marquee', 'howItWorks', 'features', 'pricing', 'faq', 'finalCta'],
    hideSections: [],
  },

  seo: {
    title:          'Tutiq — AI Tutoring for 11+, GCSE & A-Level | UK Students',
    description:    'Free AI tutor for UK students. Practice 11-Plus, GCSE and A-Level questions with instant feedback. Maths, English, Sciences and more.',
    ogImage:        '/og.png',
    llmsDescription: 'Tutiq is a free AI-powered personal tutor at tutiq.app focused on UK exams — 11+, GCSE, and A-Level. It generates personalised step-by-step explanations and exam-style practice questions for Maths, English, Sciences, History, Geography and more. Adapts language and difficulty to the learner\'s exam level and board (AQA/Edexcel/OCR). Free tier: 3 sessions per day, no account required. Pro: unlimited sessions, all subjects, progress tracking, PDF study guides, mock exam mode.',
  },

  nav: [
    { label: 'Home',         href: '/' },
    { label: 'Features',     href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing',      href: '/#pricing' },
    { label: 'About',        href: '/about' },
  ],

  chatbot: {
    welcomeMessage: '👋 Hi! Which exam are you preparing for — 11+, GCSE, or A-Level? Tell me your subject and I\'ll start teaching you right now.',
    botName:        'Tutiq AI',
    placeholder:    'e.g. "GCSE Maths quadratic equations"…',
    suggestedQuestions: [
      'Help me with GCSE Maths quadratics',
      'Explain A-Level Biology cell division',
      '11+ verbal reasoning practice',
      'GCSE English literature essay tips',
      'A-Level Chemistry bonding',
    ],
  },
}

export default siteConfig
