// app/contact-us/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | AstroHub Support',
  description: 'Get in touch with the AstroHub team. Contact us for support, feedback, or collaboration opportunities in space exploration and astronomy.',
  keywords: ['contact AstroHub', 'support', 'feedback', 'collaboration', 'space exploration', 'astronomy help'],
  authors: [{ name: 'AstroHub Team' }],
  openGraph: {
    title: 'Contact Us | AstroHub Support',
    description: 'Get in touch with the AstroHub team for support and collaboration opportunities.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.png',
        width: 1200,
        height: 630,
        alt: 'Contact AstroHub Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact AstroHub',
    description: 'Get in touch with the AstroHub team for support and collaboration.',
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

export default function ContactUsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="contact-us-layout">
      {children}
    </div>
  )
}
