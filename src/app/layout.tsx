import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NASA Explorer - Space Data & Imagery",
    template: "%s | NASA Explorer"
  },
  icons: {
    icon:[
      {url: "/AstroHub-remove-bg-preview", sizes: "'16x16', type: 'image/png'"},
    ]
  },
  description: "Explore the cosmos with NASA's public APIs including Astronomy Picture of the Day (APOD), Earth Polychromatic Imaging Camera (EPIC), and more stunning space imagery and data.",
  keywords: [
    "NASA",
    "space",
    "astronomy",
    "APOD",
    "EPIC",
    "earth imagery",
    "space exploration",
    "astronomy pictures",
    "NASA API",
    "space data",
    "satellite imagery",
    "cosmos",
    "universe"
  ],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  publisher: "NASA Explorer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://your-domain.com"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.com", // Replace with your actual domain
    siteName: "NASA Explorer",
    title: "NASA Explorer - Space Data & Imagery",
    description: "Explore the cosmos with NASA's public APIs including APOD, EPIC, and more stunning space imagery and data.",
    images: [
      {
        url: "/og-image.jpg", // You'll need to add this image to your public folder
        width: 1200,
        height: 630,
        alt: "NASA Explorer - Space Data & Imagery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NASA Explorer - Space Data & Imagery",
    description: "Explore the cosmos with NASA's public APIs including APOD, EPIC, and more stunning space imagery and data.",
    images: ["/og-image.jpg"], // Same image as OpenGraph
    creator: "@yourtwitterhandle", // Replace with your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Space Technology and Astronomy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
