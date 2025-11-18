import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NASA Eyes: Earth Explorer | AstroHub",
  description:
    "Fly around Earth with NASA Eyes to view real-time satellites, climate layers, and global data visualizations.",
  keywords: [
    "NASA Eyes Earth",
    "earth explorer",
    "3D earth visualization",
    "satellite tracker",
  ],
  openGraph: {
    title: "NASA Eyes: Earth Explorer | AstroHub",
    description:
      "Discover Earth from orbit using NASA Eyes' immersive Earth mode integrated into AstroHub.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.png",
        width: 1200,
        height: 630,
        alt: "NASA Eyes Earth preview",
      },
    ],
  },
};

export default function NasaEyesEarthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

