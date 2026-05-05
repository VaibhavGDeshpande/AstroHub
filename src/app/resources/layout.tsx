import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astronomy Resources | Tools & Learning Materials",
  description: "A curated collection of the best astronomy tools, books, websites, and software for enthusiasts of all levels. Enhance your cosmic journey with these resources.",
  keywords: ["astronomy resources", "stargazing tools", "space software", "learning astronomy", "astronomy books"],
  openGraph: {
    title: "Astronomy Resources | Tools & Learning Materials",
    description: "Equip yourself with the best tools and materials for exploring the universe.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
