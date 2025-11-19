import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Satellite Tracker & NORAD Lookup | AstroHub",
  description:
    "Track real-time satellite positions, view orbital footprints, and search the NORAD catalog with AstroHub's satellite tracker.",
  keywords: [
    "satellite tracker",
    "NORAD lookup",
    "live satellite map",
    "spacecraft tracking",
  ],
  openGraph: {
    title: "Satellite Tracker & NORAD Lookup | AstroHub",
    description:
      "Search for any satellite by NORAD ID and follow its ground track on AstroHub.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.avif",
        width: 1200,
        height: 630,
        alt: "Satellite tracker preview",
      },
    ],
  },
};

export default function SatelliteTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

