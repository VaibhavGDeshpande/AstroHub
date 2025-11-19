import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Telescope Calculator & FOV Planner | AstroHub",
  description:
    "Analyze telescope and eyepiece combinations, magnification, and field of view with AstroHub's telescope calculator.",
  keywords: [
    "telescope calculator",
    "eyepiece calculator",
    "astronomy tools",
    "field of view planner",
  ],
  openGraph: {
    title: "Telescope Calculator & FOV Planner | AstroHub",
    description:
      "Model telescope performance and visualize field of view before your next observing session.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.avif",
        width: 1200,
        height: 630,
        alt: "Telescope calculator preview",
      },
    ],
  },
};

export default function TelescopeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

