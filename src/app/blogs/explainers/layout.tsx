import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astronomy Explainers | Learn About the Universe",
  description: "Complex cosmic concepts made simple. Learn about black holes, galaxies, stellar evolution, and more with our easy-to-understand astronomy explainers.",
  keywords: ["astronomy explainers", "space education", "astrophysics simplified", "how the universe works"],
  openGraph: {
    title: "Astronomy Explainers | Learn About the Universe",
    description: "Discover the secrets of the cosmos with our simplified astronomy explainers.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function ExplainersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
