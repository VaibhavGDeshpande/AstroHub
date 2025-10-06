'use client'

import LoaderWrapper from '@/components/Loader'
import React from 'react'
import RevolveRotateFocus from '@/components/solar-system/SolarSystem'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline'

function page() {
  return (
    <LoaderWrapper>
        <div className="fixed top-4 left-4 z-50">
          {/* Back Button */}
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
        <RevolveRotateFocus/>
    </LoaderWrapper>
  )
}

export default page