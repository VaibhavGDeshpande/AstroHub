// app/stellarium/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stellarium | Virtual Planetarium & Sky Simulation',
  description: 'Experience a virtual planetarium with Stellarium. Explore the night sky, identify constellations, and simulate astronomical events from any location on Earth.',
  keywords: ['stellarium', 'virtual planetarium', 'sky simulation', 'constellation identification', 'astronomical events', 'night sky', 'planetarium software'],
  authors: [{ name: 'AstroHub Stellarium Team' }],
  openGraph: {
    title: 'Stellarium | Virtual Planetarium & Sky Simulation',
    description: 'Experience a virtual planetarium with sky simulation and constellation identification.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.avif',
        width: 1200,
        height: 630,
        alt: 'Stellarium Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stellarium',
    description: 'Experience a virtual planetarium with sky simulation.',
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

export default function StellariumLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="stellarium-layout">
      {children}
    </div>
  )
}

