// components/HeroSection.tsx — server component
// Static HTML that crawlers read. HeroClient mounts stagger animation on top.
import { Suspense } from 'react'
import { siteConfig } from '@/site.config'
import { getContentOverrides } from '@/lib/content'
import HeroClient from './HeroClient'
import HeroDemo from './HeroDemo'

export default async function HeroSection() {
  const isSplit    = siteConfig.layout.heroVariant === 'split'
  const isCentered = siteConfig.layout.heroVariant === 'centered'
  const overrides  = await getContentOverrides()

  return (
    <section className="relative px-4 sm:px-6 pt-6 pb-10 max-w-6xl mx-auto">
      {/* HeroClient owns the split layout internally (flex-row with ConversationDemo on desktop) */}
      <HeroClient overrides={overrides} />
    </section>
  )
}
