// components/DateSelectionButton.tsx
'use client'
import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import DateSelectionModal from './DateSelectionModal'

interface DateSelectionButtonProps {
  selectedDate: string
  setSelectedDate: (date: string) => void
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
  isDateRange: boolean
  setIsDateRange: (range: boolean) => void
  onSearch: () => Promise<void>
  onTodayClick: () => void
  minDate: string
  maxDate: string
}

export default function DateSelectionButton(props: DateSelectionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Calendar Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="relative group p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 border border-slate-600/40 hover:border-slate-500/60 backdrop-blur-sm transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <CalendarIcon className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
        
        {/* Tooltip */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
          Select Date
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800" />
        </div>

        {/* Active indicator */}
        {(props.selectedDate || props.startDate || props.endDate) && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
        )}
      </motion.button>

      {/* Modal */}
      <DateSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        {...props}
      />
    </>
  )
}
