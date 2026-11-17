import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import FloatingClientWidgets from "@/components/FloatingClientWidgets";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Home/Header";
import ClientLayout from "@/components/provider/NotificationProvider";
import { PostHogProvider } from "@/components/provider/PostHogProvider";
// import SmoothScrollProvider from "@/components/provider/SmoothScrollProvider";

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
  // www is the host that actually serves the site; the apex returns a 404.
  metadataBase: new URL("https://www.astrohub.live"),
  alternates: {
    // "./" resolves per route; a hard-coded "/" told Google every page was the homepage.
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AstroHub",
    title: "AstroHub - Astronomy Hub for Astrophiles and Amateur Astronomers",
    description: "Explore the cosmos with NASA's public APIs including APOD, EPIC, and more stunning space imagery and data.",
    images: [
      {
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.astrohub.live/#org",
                  name: "AstroHub",
                  url: "https://www.astrohub.live",
                  logo: "https://www.astrohub.live/icon.png",
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.astrohub.live/#website",
                  url: "https://www.astrohub.live",
                  name: "AstroHub",
                  publisher: { "@id": "https://www.astrohub.live/#org" },
                },
              ],
            }),
          }}
        />
        <PostHogProvider>
          <ClientLayout>
            {/* <SmoothScrollProvider> */}
              <FloatingClientWidgets />
              <Analytics/>
              <SpeedInsights/>
              <Header />
              {children}
            {/* </SmoothScrollProvider> */}
          </ClientLayout>
        </PostHogProvider>
      </body>
    </html>
  );
}
