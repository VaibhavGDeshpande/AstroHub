import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Space Quiz Questions | AstroHub",
  description:
    "Challenge yourself with curated astronomy questions covering space science, NASA missions, and celestial phenomena.",
  keywords: [
    "space quiz",
    "astronomy trivia",
    "space questions",
    "astro quiz",
  ],
  robots: {
    index: false,
    follow: true,
  },
  openGraph: {
    title: "Space Quiz Questions | AstroHub",
    description:
      "Dive into the interactive AstroHub quiz and test your knowledge about the universe.",
    type: "website",
    images: [
      {
        url: "/assets/AstroHub.png",
        width: 1200,
        height: 630,
        alt: "Space quiz preview",
      },
    ],
  },
};

export default function SpaceQuizQuestionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

