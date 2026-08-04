import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' })
import Script from 'next/script'
import './globals.css'
import config from '@/vertical.config'
import { getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import Navbar from '@/components/Navbar'
import FooterExtras from '@/components/FooterExtras'
import ChatBot from '@/components/ChatBot'
import { getSiteFlags } from '@/lib/flags'
import Providers from '@/components/Providers'
import FeedbackWidget from '@/components/FeedbackWidget'
import BackToTop from '@/components/BackToTop'
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";
import StickyFooterCTA from "../components/StickyFooterCTA";
import SchemaOrg from '@/components/SchemaOrg'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title:        'Tutiq — AI Tutoring for 11+, GCSE & A-Level | UK Students',
  description:  'Free AI tutor for UK students. Practice 11-Plus, GCSE and A-Level questions with instant feedback. Maths, English, Sciences and more.',
  keywords:     config.keywords,
  metadataBase: new URL('https://tutiq.app'),
  alternates:   { canonical: '/' },
  openGraph: {
    title:       'Tutiq — AI Tutoring for 11+, GCSE & A-Level | UK Students',
    description: 'Free AI tutor for UK students. Practice 11-Plus, GCSE and A-Level questions with instant feedback. Maths, English, Sciences and more.',
    url:         'https://tutiq.app',
    siteName:    'Tutiq',
    type:        'website',
    locale:      'en_GB',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Tutiq — AI Tutoring for 11+, GCSE & A-Level' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tutiq — AI Tutoring for 11+, GCSE & A-Level | UK Students',
    description: 'Free AI tutor for UK students. Practice 11-Plus, GCSE and A-Level questions with instant feedback. Maths, English, Sciences and more.',
    images:      ['https://tutiq.app/og.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    'google-adsense-account': 'ca-pub-4237294630161176',
  },
}

// Derive CSS custom properties from vertical theme at build time
const colors = COLOR_MAP[config.themeColor] ?? COLOR_MAP['violet']

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const flags = await getSiteFlags('tutiq')
  return (
    <html
      lang="en"
      className="h-full"
      style={{
        '--theme-primary':   colors.primary,
        '--theme-secondary': colors.secondary,
        '--theme-base':      colors.base,
        '--scrollbar-color': getScrollbarColor(config.themeColor),
      } as React.CSSProperties}
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${jakarta.variable} min-h-full flex flex-col`}
        style={{ fontFamily: 'var(--font-body, system-ui)' }}
      >
        {/* Aurora background blobs */}
        <div className="aurora aurora-primary" aria-hidden />
        <div className="aurora aurora-secondary" aria-hidden />
        <div className="aurora aurora-third" aria-hidden />
        {/* Film grain overlay */}
        <div className="grain" aria-hidden />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <Navbar />

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>

        {flags.chatbot && <ChatBot />}
        <FeedbackWidget siteName="Tutiq" accentColor="#0284c7" accentColor2="#0369a1" position={flags.chatbot ? 'left' : 'right'} />
        <BackToTop accentColor="#0284c7" />

        <FooterExtras />
        <Footer siteName={config.name} />
      <CookieConsent />
        <StickyFooterCTA />
        {/* JSON-LD structured data — driven from siteConfig.faq */}
        <SchemaOrg />
        <Script defer data-domain="tutiq.app" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
