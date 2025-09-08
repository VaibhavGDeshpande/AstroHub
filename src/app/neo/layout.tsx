// app/neo/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NASA NEO Explorer | Near Earth Objects Tracker',
  description: 'Track asteroids and comets that approach Earth. Explore NASA\'s Near Earth Objects database with detailed orbital information, size estimates, and hazard assessments.',
  keywords: 'NASA, NEO, Near Earth Objects, asteroids, comets, space tracking, orbital data, potentially hazardous asteroids, space safety',
  authors: [{ name: 'NASA NEO Explorer' }],
  openGraph: {
    title: 'NASA NEO Explorer - Track Near Earth Objects',
    description: 'Discover and track asteroids and comets approaching Earth with detailed NASA data including size, velocity, and closest approach information.',
    type: 'website',
    images: [
      {
        url: '/neo-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'NASA NEO Explorer Preview - Asteroid Tracking'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NASA NEO Explorer',
    description: 'Track potentially hazardous asteroids and near Earth objects with real NASA data.',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function NEOLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="neo-layout">
      {children}
    </div>
  )
}
