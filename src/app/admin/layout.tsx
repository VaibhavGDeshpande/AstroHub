import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AstroHub Admin Dashboard",
  description: "Administrative dashboard for managing AstroHub content, blogs, and astronomical data.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
