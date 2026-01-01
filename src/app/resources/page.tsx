'use client'

import Link from "next/link";
import { motion } from "framer-motion";
import LoaderWrapper from "@/components/Loader";
import { ArrowLeftIcon, HomeIcon, LinkIcon } from "@heroicons/react/24/outline";

const apiResources = [
  {
    name: "NASA Open APIs (APOD, NEO, Mars Rover, EPIC)",
    url: "https://api.nasa.gov",
    description: "Core space imagery, near-earth objects, rover photos, and APOD feeds."
  },
  {
    name: "NASA EPIC",
    url: "https://epic.gsfc.nasa.gov",
    description: "Earth Polychromatic Imaging Camera imagery archive."
  },
  {
    name: "NASA Image and Video Library",
    url: "https://images-api.nasa.gov",
    description: "Public media library search and metadata."
  },
  {
    name: "NASA SkyView",
    url: "https://skyview.gsfc.nasa.gov",
    description: "Sky survey imagery for telescope planning tools."
  },
  {
    name: "Messier API",
    url: "https://osricdienda.com/messier-api/messier.json",
    description: "Messier catalog data source."
  },
  {
    name: "SpaceNews RSS",
    url: "https://spacenews.com/feed",
    description: "Space news headlines and summaries."
  },
  {
    name: "The Trivia API",
    url: "https://the-trivia-api.com",
    description: "Quiz content for space questions."
  },
  {
    name: "N2YO Satellite API",
    url: "https://api.n2yo.com",
    description: "Satellite positions, passes, and TLE data."
  },
  {
    name: "WeatherAPI",
    url: "https://api.weatherapi.com",
    description: "Current conditions and forecast data."
  },
  {
    name: "IPGeolocation Astronomy API",
    url: "https://api.ipgeolocation.io",
    description: "Sun and moon rise/set data for astronomy tools."
  },
  {
    name: "OpenRouter",
    url: "https://openrouter.ai",
    description: "AI responses used in AstroBot features."
  },
  {
    name: "EmailJS",
    url: "https://www.emailjs.com",
    description: "Contact form delivery service."
  },
  {
    name: "Nominatim (OpenStreetMap)",
    url: "https://nominatim.openstreetmap.org",
    description: "Geocoding for location search."
  },
  {
    name: "SkyMaps Downloads",
    url: "https://www.skymaps.com/downloads.html",
    description: "Monthly sky chart PDFs."
  }
];

const referenceResources = [
  {
    name: "NASA Eyes",
    url: "https://eyes.nasa.gov",
    description: "Interactive NASA Eyes experiences embedded in AstroHub."
  },
  {
    name: "Stellarium Web",
    url: "https://stellarium-web.org",
    description: "Live planetarium experience."
  },
  {
    name: "Light Pollution Map",
    url: "https://www.lightpollutionmap.info",
    description: "Light pollution references for observing tips."
  },
  {
    name: "Light Pollution Overlay",
    url: "https://djlorenz.github.io/astronomy/lp/overlay/dark.html",
    description: "Overlay reference used in the light pollution explorer."
  },
  {
    name: "OpenStreetMap",
    url: "https://www.openstreetmap.org",
    description: "Map tiles and attribution for location tools."
  },
  {
    name: "Carto Basemaps",
    url: "https://carto.com",
    description: "Dark basemap tiles for satellite tracking."
  },
  {
    name: "Esri World Imagery",
    url: "https://www.esri.com",
    description: "Satellite imagery basemap."
  },
  {
    name: "SatNOGS Database",
    url: "https://db.satnogs.org",
    description: "Satellite reference links."
  },
  {
    name: "Wikipedia",
    url: "https://en.wikipedia.org",
    description: "Reference articles linked from the moon viewer."
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com",
    description: "Embedded reference video content."
  },
  {
    name: "CesiumJS CDN",
    url: "https://cesium.com",
    description: "External Cesium widget assets for 3D viewers."
  },
  {
    name: "Leaflet Assets (UNPKG)",
    url: "https://unpkg.com",
    description: "Leaflet marker assets for map tools."
  },
  {
    name: "Leaflet Assets (CDNJS)",
    url: "https://cdnjs.cloudflare.com",
    description: "Leaflet icon assets used by satellite maps."
  },
  {
    name: "Google Tag Manager",
    url: "https://www.googletagmanager.com",
    description: "Analytics and measurement scripts."
  }
];

export default function ResourcesPage() {
  return (
    <LoaderWrapper>
      <div className="min-h-screen bg-gradient-to-b from-black via-blue-950/20 to-black pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 pt-15">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Resources & Credits
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Data sources, APIs, and reference websites used across AstroHub.
            </p>
          </div>

          <div className="fixed top-4 left-4 z-50 hidden md:block">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600/40 backdrop-blur-sm transition duration-300"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <HomeIcon className="h-4 w-4 hidden sm:block" />
                <span className="text-sm">Back</span>
              </Link>
            </motion.div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-400/20 p-8 md:p-12 shadow-2xl space-y-12 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">Data APIs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {apiResources.map((resource) => (
                  <div
                    key={resource.url}
                    className="bg-black/40 border border-slate-600/40 rounded-xl p-5 hover:border-cyan-400/60 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="h-5 w-5 text-cyan-400" />
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold hover:text-cyan-300"
                      >
                        {resource.name}
                      </a>
                    </div>
                    <p className="text-sm text-slate-300">{resource.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-cyan-400 mb-6">Reference Websites & Visualization Sources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {referenceResources.map((resource) => (
                  <div
                    key={resource.url}
                    className="bg-black/40 border border-slate-600/40 rounded-xl p-5 hover:border-cyan-400/60 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <LinkIcon className="h-5 w-5 text-cyan-400" />
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-semibold hover:text-cyan-300"
                      >
                        {resource.name}
                      </a>
                    </div>
                    <p className="text-sm text-slate-300">{resource.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-sm text-slate-400">
                If you see a missing credit or a resource that should be updated, please reach out via the contact page.
              </p>
            </section>
          </div>
        </div>
      </div>
    </LoaderWrapper>
  );
}
