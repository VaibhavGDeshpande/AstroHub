import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NASA Eyes: Exoplanet Explorer | AstroHub",
  description:
    "Dive into NASA Eyes Exoplanet mode to discover distant worlds, planetary systems, and mission highlights.",
  keywords: [
    "NASA Eyes exoplanets",
    "exoplanet explorer",
    "distant worlds visualization",
    "kepler planets",
  ],
  openGraph: {
    title: "NASA Eyes: Exoplanet Explorer | AstroHub",
    description:
      "Visualize confirmed exoplanets and their host stars using NASA Eyes' interactive space viewer.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.avif",
        width: 1200,
        height: 630,
        alt: "NASA Eyes exoplanet preview",
      },
    ],
  },
};

export default function NasaEyesExoplanetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

