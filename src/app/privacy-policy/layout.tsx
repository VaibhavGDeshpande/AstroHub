// app/privacy-policy/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | AstroHub Data Protection',
  description: 'Read AstroHub\'s privacy policy to understand how we collect, use, and protect your personal information and data privacy rights.',
  keywords: ['privacy policy', 'data protection', 'AstroHub privacy', 'user data', 'privacy rights', 'GDPR'],
  authors: [{ name: 'AstroHub Legal Team' }],
  openGraph: {
    title: 'Privacy Policy | AstroHub Data Protection',
    description: 'Read AstroHub\'s privacy policy and data protection practices.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.avif',
        width: 1200,
        height: 630,
        alt: 'AstroHub Privacy Policy Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AstroHub Privacy Policy',
    description: 'Read AstroHub\'s privacy policy and data protection practices.',
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

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="privacy-policy-layout">
      {children}
    </div>
  )
}

