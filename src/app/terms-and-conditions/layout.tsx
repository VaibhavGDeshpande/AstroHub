// app/terms-and-conditions/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | AstroHub Legal',
  description: 'Read AstroHub\'s terms and conditions to understand the terms of service, user agreements, and legal policies for using our space exploration platform.',
  keywords: ['terms and conditions', 'terms of service', 'user agreement', 'AstroHub legal', 'service terms', 'legal policies'],
  authors: [{ name: 'AstroHub Legal Team' }],
  openGraph: {
    title: 'Terms and Conditions | AstroHub Legal',
    description: 'Read AstroHub\'s terms and conditions and legal policies.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.png',
        width: 1200,
        height: 630,
        alt: 'AstroHub Terms and Conditions Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AstroHub Terms and Conditions',
    description: 'Read AstroHub\'s terms and conditions and legal policies.',
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

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="terms-and-conditions-layout">
      {children}
    </div>
  )
}

