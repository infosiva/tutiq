import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-display' })
import Script from 'next/script'
import './globals.css'
import config from '@/vertical.config'
import { getMeshStyle, getScrollbarColor, COLOR_MAP } from '@/lib/themeColors'
import PageTracker from '@/components/PageTracker'
import Navbar from '@/components/Navbar'
import FooterExtras from '@/components/FooterExtras'
import ChatBot from '@/components/ChatBot'
import Providers from '@/components/Providers'
import FeedbackWidget from '@/components/FeedbackWidget'
import BackToTop from '@/components/BackToTop'
import CookieConsent from "../components/CookieConsent";
import Footer from "../components/Footer";
import StickyFooterCTA from "../components/StickyFooterCTA";
import SchemaOrg from '@/components/SchemaOrg'

const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title:        'Tutiq — Your AI Tutor That Adapts to You',
  description:  'Personalised AI tutoring for every subject and age. Step-by-step explanations, instant answers, quiz after every topic. Free to start.',
  keywords:     config.keywords,
  metadataBase: new URL('https://tutiq.app'),
  alternates:   { canonical: '/' },
  openGraph: {
    title:       'Tutiq — Your AI Tutor That Adapts to You',
    description: 'Personalised AI tutoring for every subject and age. Step-by-step explanations, instant answers, quiz after every topic. Free to start.',
    url:         'https://tutiq.app',
    siteName:    'Tutiq',
    type:        'website',
    locale:      'en_GB',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Tutiq — Your AI Tutor That Adapts to You' }],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Tutiq — Your AI Tutor That Adapts to You',
    description: 'Personalised AI tutoring for every subject and age. Step-by-step explanations, instant answers, quiz after every topic. Free to start.',
    images:      ['https://tutiq.app/og.png'],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

// Derive CSS custom properties from vertical theme at build time
const colors   = COLOR_MAP[config.themeColor] ?? COLOR_MAP['violet']
const meshStyle = getMeshStyle(config.themeColor)

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <body className={`${inter.variable} ${jakarta.variable} min-h-full flex flex-col text-white`}
        style={{ background: colors.base, fontFamily: 'var(--font-body, system-ui)' }}
      >
        {/* Dynamic mesh gradient bg — changes per vertical */}
        <div style={meshStyle} />
        {/* Animated blob overlays */}
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="mesh-blob1" style={{ position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}55 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob2" style={{ position: 'absolute', top: '30%', right: '-15%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${colors.secondary}44 0%, transparent 65%)`, filter: 'blur(60px)' }} />
          <div className="mesh-blob3" style={{ position: 'absolute', bottom: '-15%', left: '40%', width: 550, height: 550, borderRadius: '50%', background: `radial-gradient(circle, ${colors.primary}38 0%, transparent 65%)`, filter: 'blur(50px)' }} />
        </div>

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4237294630161176"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        <PageTracker site='nudge' />
        <Navbar />

        <Providers>
          <main className="flex-1">
            {children}
          </main>
        </Providers>

        <ChatBot />
        <FeedbackWidget siteName="Tutiq" accentColor="#10b981" accentColor2="#34d399" />
        <BackToTop accentColor="#10b981" />

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
