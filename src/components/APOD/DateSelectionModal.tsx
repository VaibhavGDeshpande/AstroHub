// components/DateSelectionModal.tsx
'use client'
import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { 
  CalendarIcon, 
  XMarkIcon,
  CheckIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface DateSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: string
  setSelectedDate: (date: string) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  isDateRange: boolean
  setIsDateRange: (range: boolean) => void
  onSearch: () => Promise<void> // Make sure this returns a Promise
  onTodayClick: () => void
  minDate: string
  maxDate: string
}

const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalVariants: Variants = {
  hidden: { 
    y: -50, 
    opacity: 0, 
    scale: 0.95,
    rotateX: 10
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      type: 'spring' as const,
      damping: 25,
      stiffness: 300
    }
  },
  exit: {
    y: -30,
    opacity: 0,
    scale: 0.95,
    rotateX: 5,
    transition: {
      duration: 0.2
    }
  }
}

export default function DateSelectionModal({
  isOpen,
  onClose,
  selectedDate,
  setSelectedDate,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isDateRange,
  setIsDateRange,
  onSearch,
  onTodayClick,
  minDate,
  maxDate
}: DateSelectionModalProps) {
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      await onSearch() // Wait for the search to complete
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
      onClose()
    }
  }

  const handleTodayClick = () => {
    onTodayClick()
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal content */}
          <motion.div
            className="relative bg-slate-900/95 backdrop-blur-md border border-slate-600/40 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-600/40">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Select Date
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={loading} // Disable close during loading
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMarkIcon className="h-5 w-5 text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Date Range Toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">
                  Search by date range
                </span>
                <button
                  onClick={() => setIsDateRange(!isDateRange)}
                  disabled={loading} // Disable during loading
                  className={`relative w-12 h-6 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isDateRange ? 'bg-blue-500' : 'bg-slate-600'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      isDateRange ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {/* Date Inputs */}
              {isDateRange ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={minDate}
                      max={maxDate}
                      disabled={loading} // Disable during loading
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/40 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={minDate}
                      max={maxDate}
                      disabled={loading} // Disable during loading
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/40 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={minDate}
                    max={maxDate}
                    disabled={loading} // Disable during loading
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600/40 rounded-lg text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              )}

              {/* Quick Actions */}
              <div className="pt-2">
                <button
                  onClick={handleTodayClick}
                  disabled={loading} // Disable during loading
                  className="w-full px-4 py-2 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors border border-slate-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Today&apos;s APOD
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 bg-slate-800/30 border-t border-slate-600/40">
              <button
                onClick={onClose}
                disabled={loading} // Disable cancel during loading
                className="flex-1 px-4 py-2 text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    Search
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
