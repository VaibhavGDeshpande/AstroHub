import Script from "next/script";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space News | Latest Astronomy & Space Exploration Updates",
  description:
    "Stay updated with the latest space news, astronomy discoveries, and space exploration updates from NASA, ESA, and other space agencies worldwide.",
  keywords: [
    "space news",
    "astronomy news",
    "space exploration",
    "NASA news",
    "space discoveries",
    "astronomy updates",
    "space missions",
  ],
  authors: [{ name: "AstroHub News Team" }],
  openGraph: {
    title: "Space News | Latest Astronomy & Space Exploration Updates",
    description:
      "Stay updated with the latest space news and astronomy discoveries from around the world.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.avif",
        width: 1200,
        height: 630,
        alt: "Space News Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Space News",
    description: "Stay updated with the latest space news and astronomy discoveries.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function SpaceNewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8047919310863091"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <div className="space-news-layout">{children}</div>
    </>
  );
}
