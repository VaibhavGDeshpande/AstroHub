import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messier Catalog | Deep-Sky Objects Guide",
  description: "Explore the Messier Catalog of 110 deep-sky objects. Find coordinates, descriptions, and images of galaxies, nebulae, and star clusters for your next stargazing session.",
  keywords: ["messier catalog", "deep-sky objects", "astronomy targets", "galaxies", "nebulae", "star clusters"],
  openGraph: {
    title: "Messier Catalog | Deep-Sky Objects Guide",
    description: "A comprehensive guide to the Messier Catalog for amateur astronomers.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function MessierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
