import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NASA Eyes: Solar System Tour | AstroHub",
  description:
    "Explore planets, moons, and spacecraft trajectories through NASA Eyes' solar system simulator embedded in AstroHub.",
  keywords: [
    "NASA Eyes solar system",
    "planet viewer",
    "spacecraft trajectories",
    "3D solar system tour",
  ],
  openGraph: {
    title: "NASA Eyes: Solar System Tour | AstroHub",
    description:
      "Travel across the solar system and follow NASA missions in the NASA Eyes experience.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.png",
        width: 1200,
        height: 630,
        alt: "NASA Eyes solar system preview",
      },
    ],
  },
};

export default function NasaEyesSolarSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

