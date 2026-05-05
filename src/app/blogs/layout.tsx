import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AstroHub Transmission | Astronomy Blog & Guides",
  description: "Dive into the latest astronomy news, observation guides, and deep-space tutorials. Stay updated with what's happening in the night sky.",
  keywords: ["astronomy blog", "space news", "stargazing guides", "astrophotography tutorials", "night sky events"],
  openGraph: {
    title: "AstroHub Transmission | Astronomy Blog & Guides",
    description: "Your go-to source for space exploration news and practical astronomy guides.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
