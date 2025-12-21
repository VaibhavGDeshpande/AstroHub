"use client";

import { motion } from "framer-motion";


export default function MessierHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-center mb-10"
    >
      <div className="flex items-center justify-center gap-3 mb-4">

        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Messier Catalog Explorer
        </h1>
      </div>
      <p className="text-slate-300 max-w-2xl mx-auto">
        Browse iconic deep-sky showpieces with observing details, brightness, and finder data for every Messier object.
      </p>
    </motion.div>
  );
}

