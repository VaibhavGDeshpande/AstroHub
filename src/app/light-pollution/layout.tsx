import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Light Pollution Map & Bortle Scale | AstroHub",
  description:
    "Visualize global light pollution, explore the Bortle scale, and plan dark-sky observing sessions with AstroHub's interactive tools.",
  keywords: [
    "light pollution map",
    "bortle scale",
    "dark sky",
    "astronomy observing sites",
  ],
  openGraph: {
    title: "Light Pollution Map & Bortle Scale | AstroHub",
    description:
      "Check sky quality worldwide with AstroHub's light pollution map and Bortle reference charts.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.png",
        width: 1200,
        height: 630,
        alt: "Light pollution visualization preview",
      },
    ],
  },
};

export default function LightPollutionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

