'use client'
import { motion } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  loading = false
}) => {
  if (totalPages <= 1) return null;

  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    const pages: number[] = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination logic
      if (currentPage <= 3) {
        // Show first 5 pages
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Show last 5 pages
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show current page with 2 pages on each side
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
      onPageChange(page);
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value);
    if (page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Results Info */}
        <div className="text-sm text-slate-400 text-center lg:text-left">
          Showing <span className="text-white font-medium">{startItem.toLocaleString()}</span> to{' '}
          <span className="text-white font-medium">{endItem.toLocaleString()}</span> of{' '}
          <span className="text-white font-medium">{totalItems.toLocaleString()}</span> results
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>

          {/* First page if not visible */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                disabled={loading}
                className="w-8 h-8 rounded-lg text-sm font-medium bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50 transition-colors disabled:opacity-50"
              >
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="text-slate-500 px-1">...</span>
              )}
            </>
          )}

          {/* Page Numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                  pageNum === currentPage
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>

          {/* Last page if not visible */}
          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="text-slate-500 px-1">...</span>
              )}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={loading}
                className="w-8 h-8 rounded-lg text-sm font-medium bg-slate-700/50 border border-slate-600/50 text-slate-300 hover:bg-slate-600/50 transition-colors disabled:opacity-50"
              >
                {totalPages}
              </button>
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="p-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Jump */}
        <div className="flex items-center justify-center lg:justify-end space-x-3">
          <span className="text-slate-400 text-sm whitespace-nowrap">Go to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={handlePageInputChange}
            disabled={loading}
            className="w-16 bg-slate-700/50 border border-slate-600/50 text-white rounded px-2 py-1 text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <span className="text-slate-500 text-sm">of {totalPages}</span>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-slate-800/50 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="flex items-center space-x-2 text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Pagination;