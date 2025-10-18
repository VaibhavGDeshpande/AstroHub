// app/solar-system/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar System Explorer | Interactive Planetary Tour',
  description: 'Explore our solar system with interactive 3D models of planets, moons, and celestial bodies. Learn about planetary characteristics and orbital mechanics.',
  keywords: ['solar system', 'planets', 'moons', '3D solar system', 'planetary exploration', 'celestial bodies', 'orbital mechanics'],
  authors: [{ name: 'AstroHub Solar System Team' }],
  openGraph: {
    title: 'Solar System Explorer | Interactive Planetary Tour',
    description: 'Explore our solar system with interactive 3D models of planets and celestial bodies.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.png',
        width: 1200,
        height: 630,
        alt: 'Solar System Explorer Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar System Explorer',
    description: 'Explore our solar system with interactive 3D models.',
  },
  robots: {
    index: true,
    follow: true,
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function SolarSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="solar-system-layout">
      {children}
    </div>
  )
}
