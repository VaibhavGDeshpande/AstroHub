import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astrophotography Exposure Calculator | AstroHub",
  description:
    "Fine tune ISO, shutter speed, and aperture values with AstroHub's astrophotography exposure calculator built for night sky imaging.",
  keywords: [
    "astrophotography calculator",
    "exposure calculator",
    "night sky settings",
    "astro camera settings",
  ],
  openGraph: {
    title: "Astrophotography Exposure Calculator | AstroHub",
    description:
      "Optimize your night sky photos using the AstroHub exposure calculator for telescopes and DSLR cameras.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.avif",
        width: 1200,
        height: 630,
        alt: "Astrophotography Exposure Calculator preview",
      },
    ],
  },
};

export default function ExposureCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

