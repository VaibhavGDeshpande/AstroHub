import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astronomy Weather Dashboard | AstroHub",
  description:
    "Check cloud cover, transparency, seeing, and planetary conditions with AstroHub's astronomy-focused weather dashboard.",
  keywords: [
    "astronomy weather",
    "astro weather dashboard",
    "cloud cover forecast",
    "stargazing conditions",
  ],
  openGraph: {
    title: "Astronomy Weather Dashboard | AstroHub",
    description:
      "Plan observing sessions using localized weather metrics tailored for astronomers.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.png",
        width: 1200,
        height: 630,
        alt: "Astronomy weather preview",
      },
    ],
  },
};

export default function WeatherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

