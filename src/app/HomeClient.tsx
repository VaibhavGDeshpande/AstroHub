'use client'

import dynamic from 'next/dynamic'
import PageLoader from '@/components/Loader'
import AstronomyWidget from '@/components/AstronomyWidget'

const Home = dynamic(() => import('@/components/Home/Home'), { ssr: false })
const OnboardingTour = dynamic(() => import('@/components/OnboardingTour'), { ssr: false })

export default function HomeClient() {
  return (
    <PageLoader>
      <Home />

      <AstronomyWidget />
      <OnboardingTour />
    </PageLoader>
  )
}
