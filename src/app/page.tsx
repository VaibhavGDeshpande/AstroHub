'use client'

import dynamic from 'next/dynamic'
import PageLoader from '@/components/Loader'
import AstronomyWidget from '@/components/AstronomyWidget'
import Header from '@/components/Home/Header'
// import { LenisProvider } from '@/components/provider/LenisProvider'
// import ScreenSizeWarningModal from '@/components/BigScreenWarning'


const Home = dynamic(() => import('@/components/Home/Home'), { ssr: false })

export default function HomePage() {
  return (
    <>
      <Header />
      <PageLoader>
        {/* <ScreenSizeWarningModal /> */}
        <Home />

        <AstronomyWidget />
      </PageLoader>
    </>
  )
}
