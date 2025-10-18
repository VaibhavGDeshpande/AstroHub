// app/sky-charts/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sky Charts | Professional Astronomy Tools',
  description: 'Generate professional sky charts and star maps for any location and time. Perfect for amateur astronomers and stargazing enthusiasts.',
  keywords: ['sky charts', 'star maps', 'astronomy tools', 'stargazing', 'constellation maps', 'night sky', 'astronomical charts'],
  authors: [{ name: 'AstroHub Astronomy Team' }],
  openGraph: {
    title: 'Sky Charts | Professional Astronomy Tools',
    description: 'Generate professional sky charts and star maps for any location and time.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.png',
        width: 1200,
        height: 630,
        alt: 'Sky Charts Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sky Charts',
    description: 'Generate professional sky charts and star maps for stargazing.',
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

export default function SkyChartsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="sky-charts-layout">
      {children}
    </div>
  )
}

