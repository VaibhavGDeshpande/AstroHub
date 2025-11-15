'use client'

import dynamic from 'next/dynamic'
// import { LenisProvider } from '@/components/provider/LenisProvider'
import ScreenSizeWarningModal from '@/components/BigScreenWarning'
import PageLoader from '@/components/Loader'
import AstronomyWidget from '@/components/AstronomyWidget'

const Home = dynamic(() => import('@/components/Home/Home'), { ssr: false })

export default function HomePage() {
  return (
    <>
      <PageLoader>
        <ScreenSizeWarningModal />
        
          <Home />
        
        <AstronomyWidget />
      </PageLoader>
    </>
  )
}
