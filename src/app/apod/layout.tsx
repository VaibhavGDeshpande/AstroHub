// app/apod/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'NASA APOD Explorer | Astronomy Picture of the Day',
  description: 'Explore NASA\'s Astronomy Picture of the Day archive. Discover stunning space imagery, HD photos, and cosmic wonders with detailed explanations from professional astronomers.',
  keywords: 'NASA, APOD, Astronomy Picture of the Day, space, astronomy, cosmos, HD images, NASA API',
  authors: [{ name: 'NASA APOD Explorer' }],
  openGraph: {
    title: 'NASA APOD Explorer',
    description: 'Explore NASA\'s Astronomy Picture of the Day archive with stunning space imagery and detailed explanations.',
    type: 'website',
    images: [
      {
        url: '/nasa-apod-preview.jpg', // You can add a preview image
        width: 1200,
        height: 630,
        alt: 'NASA APOD Explorer Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NASA APOD Explorer',
    description: 'Explore NASA\'s Astronomy Picture of the Day archive with stunning space imagery.',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function APODLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="apod-layout">
      {children}
    </div>
  )
}
