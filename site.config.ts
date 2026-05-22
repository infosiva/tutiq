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
  chatbot: { welcomeMessage: string; botName: string; placeholder: string }
}

export const siteConfig: SiteConfig = {
  siteName:   'Tutiq',
  domain:     'tutiq.app',
  themeColor: 'emerald',

  heroBadge:    'tutiq · AI tutor · free to start',
  headline:     ['Your AI tutor', 'that adapts to you.'],
  subheadline:  'Personalised tutoring for every subject and age — start in seconds, no account needed.',
  ctaPrimary:   { text: '🎓 Start Learning Free →', href: '/onboard' },
  ctaSecondary: { text: '📚 See All Subjects',       href: '/#features' },

  freeTier: {
    pills:             ['🎓 3 sessions free', '📚 All subjects', '📱 Any device'],
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
    { step: 1, icon: '👤', title: 'Pick your subject', desc: 'Choose from 10+ subjects or type any topic. Tell us your age and level.' },
    { step: 2, icon: '🗺️', title: 'AI builds your path', desc: 'Tutiq creates a personalised step-by-step plan tailored to you in seconds.' },
    { step: 3, icon: '✅', title: 'Learn and quiz',      desc: 'Clear explanations followed by a quick quiz after each topic to cement knowledge.' },
  ],

  features: [
    { icon: '🧠', title: 'Adaptive Explanations', desc: 'AI adjusts language and depth to match your age, level, and learning pace — always at your speed.', size: 'large'  },
    { icon: '📚', title: 'All Subjects',           desc: 'Maths, Science, English, History, Coding, Interview Prep and more.',                               size: 'medium' },
    { icon: '⚡', title: 'Instant Answers',        desc: 'No waiting — get a clear, personalised explanation in seconds, any time.',                         size: 'medium' },
    { icon: '📱', title: 'Any Device',             desc: 'Works on phones, tablets and laptops — no download needed.',                                        size: 'medium' },
    { icon: '🎯', title: 'Quiz After Every Topic', desc: 'Quick quiz after each lesson to make sure the knowledge sticks.',                                   size: 'wide'   },
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
      a: 'Tutiq covers Maths, Science, English, History, Geography, Coding, Languages, Interview Prep, and more. If you can name a topic, Tutiq can teach it.' },
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
    title:          'Tutiq — Your AI Tutor That Adapts to You',
    description:    'Personalised AI tutoring for every subject and age. Step-by-step explanations, instant answers, quiz after every topic. Free to start.',
    ogImage:        '/og.png',
    llmsDescription: 'Tutiq is a free AI-powered personal tutor at tutiq.app. It generates personalised step-by-step explanations for any subject — Maths, Science, English, Coding, Interview Prep and more — adapting language and difficulty to the learner\'s age and level. Free tier: 3 sessions per day, no account required. Pro: unlimited sessions, all subjects, progress tracking, PDF study guides, mock exam mode.',
  },

  nav: [
    { label: 'Home',         href: '/' },
    { label: 'Features',     href: '/#features' },
    { label: 'How it works', href: '/#how-it-works' },
    { label: 'Pricing',      href: '/#pricing' },
    { label: 'About',        href: '/about' },
  ],

  chatbot: {
    welcomeMessage: 'Hi! What subject would you like help with today?',
    botName:        'Tutiq AI',
    placeholder:    'Ask me anything…',
  },
}

export default siteConfig
