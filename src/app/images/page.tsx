"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import NIVL from "../../components/NIVL/NIVL";

export default function ImagesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4 md:p-6">
      {/* Back button */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Go back to home page"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            NASA Images & Videos
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Search NASA&apos;s Image and Video Library with advanced filters.
          </p>
        </header>

        <main className="min-h-[60vh]" role="main">
          <NIVL />
        </main>
      </div>
    </div>
  );
}
