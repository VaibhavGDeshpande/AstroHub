import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space Wallpapers | HD Cosmic Imagery",
  description: "Download stunning, high-definition space wallpapers for your desktop and mobile. Featuring images from NASA, Hubble, and professional astrophotographers.",
  keywords: ["space wallpapers", "astronomy backgrounds", "cosmic imagery", "NASA photos", "HD space images"],
  openGraph: {
    title: "Space Wallpapers | HD Cosmic Imagery",
    description: "Transform your screens with breathtaking views of the universe.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function WallpapersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
