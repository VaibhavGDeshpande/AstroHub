'use client'

import dynamic from 'next/dynamic'
import PageLoader from '@/components/Loader'
import AstronomyWidget from '@/components/AstronomyWidget'
// import { LenisProvider } from '@/components/provider/LenisProvider'
// import ScreenSizeWarningModal from '@/components/BigScreenWarning'

const Home = dynamic(() => import('@/components/Home/Home'), { ssr: false })
const OnboardingTour = dynamic(() => import('@/components/OnboardingTour'), { ssr: false })

export default function HomePage() {
  return (
    <>
      <PageLoader>
        {/* <ScreenSizeWarningModal /> */}
        <Home />

        <AstronomyWidget />
        <OnboardingTour />
      </PageLoader>
    </>
  )
}
