// app/space-quiz/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Space Quiz | Test Your Astronomy Knowledge',
  description: 'Challenge yourself with interactive space and astronomy quizzes. Test your knowledge about planets, stars, galaxies, and space exploration.',
  keywords: ['space quiz', 'astronomy quiz', 'space knowledge', 'astronomy test', 'space trivia', 'educational quiz', 'space learning'],
  authors: [{ name: 'AstroHub Quiz Team' }],
  openGraph: {
    title: 'Space Quiz | Test Your Astronomy Knowledge',
    description: 'Challenge yourself with interactive space and astronomy quizzes.',
    type: 'website',
    images: [
      {
        url: '/assets/AstroHub.avif',
        width: 1200,
        height: 630,
        alt: 'Space Quiz Preview'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Space Quiz',
    description: 'Challenge yourself with interactive space and astronomy quizzes.',
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

export default function SpaceQuizLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="space-quiz-layout">
      {children}
    </div>
  )
}

