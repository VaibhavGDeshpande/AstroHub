import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Astronomy & Astrophotography Tutorials",
  description: "Step-by-step guides for amateur astronomers and astrophotographers. Learn how to use telescopes, capture stunning space photos, and process astronomical data.",
  keywords: ["astrophotography tutorials", "telescope guides", "image processing", "astronomy for beginners"],
  openGraph: {
    title: "Astronomy & Astrophotography Tutorials",
    description: "Master the art of observation and astrophotography with our detailed tutorials.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function TutorialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
