import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Eyes on the Sky | Monthly Stargazing Guide",
  description: "Stay updated with the best celestial events each month. From meteor showers to planetary alignments, find out what to look for in the night sky.",
  keywords: ["monthly stargazing", "night sky events", "celestial highlights", "astronomy calendar"],
  openGraph: {
    title: "Eyes on the Sky | Monthly Stargazing Guide",
    description: "Your monthly guide to the most spectacular events in the night sky.",
    images: ["/assets/AstroHub.avif"],
  },
};

export default function EyesOnTheSkyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
