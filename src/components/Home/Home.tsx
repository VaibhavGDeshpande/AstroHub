'use client'

import Header from '@/components/Home/Header';
import HeroSection from '@/components/Home/HeroSection';
import Cards from '@/components/Cards';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <Header />
      <HeroSection />
      <Cards />
    </div>
  );
}
