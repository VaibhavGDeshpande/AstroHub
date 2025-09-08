'use client'
import dynamic from 'next/dynamic'
import { LenisProvider } from '@/components/provider/LenisProvider'

const Home = dynamic(() => import('@/components/Home/Home'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center p-8">
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full mx-auto mb-6 animate-spin" />
        <h2 className="text-2xl font-bold text-white mb-2">Loading NASA Explorer...</h2>
        <p className="text-slate-400">Preparing Data</p>
      </div>
    </div>
  )
})

export default function HomePage() {
  return (
    <LenisProvider>
      <Home />
    </LenisProvider>
  )
}
