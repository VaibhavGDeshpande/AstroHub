import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'NASA Images & Videos | NIVL Explorer',
	description:
		"Search NASA's Image and Video Library (NIVL). Filter by media type, year, center, and more to explore photos, videos, and audio.",
	keywords: ['NASA', 'images', 'videos', 'audio', 'NIVL', 'space'],
	openGraph: {
		title: 'NASA Images & Videos | NIVL Explorer',
		description:
			"Explore NASA's Image and Video Library with rich filters and previews.",
		url: 'https://yourdomain.com/images',
		siteName: 'AstroHub',
		images: [
			{
				url: '/images-og.png',
				width: 1200,
				height: 630,
				alt: 'NASA Images & Videos',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'NASA Images & Videos | NIVL Explorer',
		description:
			"Search and preview NASA's Image and Video Library with filters and modal details.",
		images: ['/images-twitter.png'],
	},
}

export default function ImagesLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="min-h-screen">
			{children}
		</main>
	)
}
