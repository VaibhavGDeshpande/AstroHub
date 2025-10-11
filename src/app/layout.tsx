import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import ClientLayout from "@/components/provider/NotificationProvider";
import { Analytics } from "@vercel/analytics/next"

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
    default: "AstroHub - One-Stop Space Platform with professional observation tools",
    template: "%s | AstroHub"
  },
  icons: {
    icon:[
      {url: "/assets/AstroHub.png", sizes: "'16x16', type: 'image/png'"},
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
    "universe",
    "3D Models",
    "Nasa Eyes",
    "Space News",
    "Space Quiz"
  ],
  authors: [{ name: "Vaibhav Ganesh Deshpande" }],
  creator: "Vaibhav Ganesh Deshpande",
  publisher: "AstroHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://explorenasa.vercel.app"), // Replace with your actual domain
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://explorenasa.vercel.app", // Replace with your actual domain
    siteName: "AstoHub",
    title: "AstroHub - Astronomy Hub for Astrophiles and young astronomers",
    description: "Explore the cosmos with NASA's public APIs including APOD, EPIC, and more stunning space imagery and data.",
    images: [
      {
        url: "/assets/AstroHub.png", // You'll need to add this image to your public folder
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
    images: ["/assets/AstroHub.png"],
    creator: "@yourtwitterhandle", 
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
        <ClientLayout>
          <Analytics/>
        {children}
        </ClientLayout>
      </body>
    </html>
  );
}
