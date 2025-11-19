import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NASA Eyes: Asteroids Explorer | AstroHub",
  description:
    "Experience NASA Eyes Asteroids mode to track near-Earth objects, missions, and orbital paths in an immersive 3D environment.",
  keywords: [
    "NASA Eyes",
    "asteroids explorer",
    "near earth objects",
    "3D asteroid visualization",
  ],
  openGraph: {
    title: "NASA Eyes: Asteroids Explorer | AstroHub",
    description:
      "Navigate NASA's Asteroids simulator and follow the latest missions monitoring NEOs.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.avif",
        width: 1200,
        height: 630,
        alt: "NASA Eyes asteroids preview",
      },
    ],
  },
};

export default function NasaEyesAsteroidsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

