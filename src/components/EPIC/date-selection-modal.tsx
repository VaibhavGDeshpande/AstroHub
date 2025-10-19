'use client'
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  CalendarDaysIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  maxDate: string;
}

// Mobile-optimized Date Selection Modal
const DateSelectionModal: React.FC<DateSelectionModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedDate, 
  onDateChange, 
  maxDate 
}) => {
  const [tempDate, setTempDate] = useState(selectedDate);

  const handleSave = () => {
    onDateChange(tempDate);
    onClose();
  };

  const handleCancel = () => {
    setTempDate(selectedDate);
    onClose();
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split('T')[0];
    if (today <= maxDate) {
      setTempDate(today);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-md border border-slate-600/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1.5 sm:p-2 bg-blue-500/20 rounded-lg sm:rounded-xl">
                  <CalendarDaysIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white">Select Date</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-1.5 sm:p-2 hover:bg-slate-700/50 rounded-full transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">
                  Choose EPIC Image Date
                </label>
                <input
                  type="date"
                  value={tempDate}
                  onChange={(e) => setTempDate(e.target.value)}
                  max={maxDate}
                  className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm text-base sm:text-lg"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Available from June 2015 to {maxDate}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={handleTodayClick}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm"
                >
                  Today
                </button>
                <div className="text-xs text-slate-400">
                  Current: {selectedDate}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 mt-6 sm:mt-8">
              <button
                onClick={handleCancel}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-700/60 hover:bg-slate-600/60 text-white rounded-lg sm:rounded-xl transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 font-medium shadow-lg text-sm sm:text-base"
              >
                Apply Date
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DateSelectionModal;