import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Satellite Tracker | Real-Time ISS & Satellite Tracking",
  description: "Track the International Space Station (ISS) and thousands of other satellites in real-time. Find out when the ISS will pass over your location.",
  keywords: ["satellite tracker", "ISS tracking", "real-time satellite map", "satellite passes", "space station tracker"],
  openGraph: {
    title: "Satellite Tracker | Real-Time ISS & Satellite Tracking",
    description: "Watch the movement of satellites across the globe in real-time.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function SatelliteTrackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
