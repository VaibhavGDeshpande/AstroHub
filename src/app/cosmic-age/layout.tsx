import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cosmic Age Calculator | Your Age on Other Planets",
  description: "Calculate how old you would be on Mars, Jupiter, or other planets in our solar system. Explore time across the cosmos with our interactive calculator.",
  keywords: ["cosmic age calculator", "age on other planets", "planetary years", "space time calculator"],
  openGraph: {
    title: "Cosmic Age Calculator | Your Age on Other Planets",
    description: "Discover your age across the solar system with our interactive cosmic calculator.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function CosmicAgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
