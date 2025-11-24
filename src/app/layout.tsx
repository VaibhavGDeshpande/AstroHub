import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/provider/NotificationProvider";
import { Analytics } from "@vercel/analytics/next"
import FloatingClientWidgets from "@/components/FloatingClientWidgets";
import { SpeedInsights } from "@vercel/speed-insights/next"

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
    default: "AstroHub - Space Platform with Professional Observation Tools",
    template: "%s | AstroHub"
  },
  icons: {
    icon: [
      {
        url: "/assets/AstroHub.avif",
        type: "image/avif",
        sizes: "16x16",
      },
    ],
    shortcut: "/assets/Astrohub.avif",
    apple: "/assets/AstroHub.avif",
  },
  description: "Explore the cosmos with NASA's public APIs including Astronomy Picture of the Day (APOD), Earth Polychromatic Imaging Camera (EPIC), and more stunning space imagery and data.",
  keywords: [
    "NASA", "space", "astronomy", "APOD", "EPIC", "earth imagery",
    "space exploration", "astronomy pictures", "NASA API", "space data",
    "satellite imagery", "cosmos", "universe", "3D Models", "Nasa Eyes",
    "Space News", "Space Quiz", "Stellarium", "earth", "moon", "mars",
  ],
  authors: [{ name: "Vaibhav Ganesh Deshpande" }],
  creator: "Vaibhav Ganesh Deshpande",
  publisher: "AstroHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://astrohub.live"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://astrohub.live",
    siteName: "AstroHub", // Fixed typo: was "AstoHub"
    title: "AstroHub - Astronomy Hub for Astrophiles and Amateur Astronomers",
    description: "Explore the cosmos with NASA's public APIs including APOD, EPIC, and more stunning space imagery and data.",
    images: [
      {
        url: "/assets/AstroHub.avif",
        width: 1200,
        height: 630,
        alt: "AstroHub - Astronomy Hub for Astrophiles and young astronomers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroHub - Astronomy Hub for Astrophiles and young astronomers",
    description: "Explore the cosmos with NASA's public APIs including APOD, EPIC, and more stunning space imagery and data.",
    images: ["/assets/AstroHub.avif"],
    // creator: "@yourtwitterhandle", // Commented out until you have a real handle
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
  
  // --- THE FIX IS HERE ---
  verification: {
    // 1. Go to Search Console -> HTML Tag
    // 2. Copy the text inside content="HERE"
    // 3. Paste it below:
    google: "cHiN1rSzb5BNk_59ey39HFmSIPyhtxctzZD2mAcNYvs", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-G2LCH85QMD"
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-G2LCH85QMD');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          <FloatingClientWidgets />
          <Analytics/>
          <SpeedInsights/>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
