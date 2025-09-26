"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

interface ErrorMessageProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900/20 to-slate-900 flex items-center justify-center p-4">
      {/* Back Button - Error State */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="text-sm">Back</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm sm:max-w-md mx-auto text-center bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 sm:p-8"
      >
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 
              0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-
              1.728-.833-2.498 0L4.316 15.5c-.77.833.192 
              2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-red-400 mb-2">
          Houston, we have a problem!
        </h2>
        <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base">
          {error}
        </p>
        <div className="space-y-3">
          <button
            onClick={onRetry}
            className="w-full px-4 sm:px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-300 text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    </div>
  );
}
