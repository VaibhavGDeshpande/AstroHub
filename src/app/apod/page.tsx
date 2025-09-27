// app/apod/page.tsx
'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getAPOD } from "../../api_service/APOD";
import APODImageInfo from "../../components/APOD/APOD";
import DateSelectionButton from "@/components/APOD/DateSearchSection";
import {
  ArrowLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import ErrorMessage from "@/components/Error";
import LoaderWrapper from "@/components/Loader";

interface APODData {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export default function APODPage() {
  const [data, setData] = useState<APODData | APODData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useHD, setUseHD] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Date functionality states
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateRange, setIsDateRange] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Dates
  const today = new Date().toISOString().split("T")[0];
  const maxDate = today;
  const minDate = "1995-06-16";

  const fetchData = async (date?: string, start?: string, end?: string) => {
    try {
      setLoading(true);
      setError(null);
      setImageLoaded(false);
      const result = await getAPOD(date, start, end);
      setData(result);
      setCurrentImageIndex(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load APOD data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch today's APOD
  }, []);

  const handleDateSearch = async (): Promise<void> => {
    if (isDateRange) {
      if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
          setError("Start date must be before end date");
          return;
        }
        await fetchData(undefined, startDate, endDate);
      } else {
        setError("Please select both start and end dates");
      }
    } else {
      if (selectedDate) {
        await fetchData(selectedDate);
      } else {
        setError("Please select a date");
      }
    }
  };

  const handleTodayClick = () => {
    setSelectedDate("");
    setStartDate("");
    setEndDate("");
    setIsDateRange(false);
    fetchData();
  };

  const openImageInNewTab = (imageUrl: string) => {
    window.open(imageUrl, "_blank", "noopener,noreferrer");
  };

  const navigateImages = (direction: "prev" | "next") => {
    if (Array.isArray(data)) {
      setImageLoaded(false);
      if (direction === "prev" && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
      } else if (direction === "next" && currentImageIndex < data.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      }
    }
  };

  // Get current displayed date
  const getCurrentDate = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data[currentImageIndex]?.date || today;
    } else if (data && !Array.isArray(data)) {
      return data.date;
    }
    return today;
  };

  // Error handling
  if (error && !loading) {
    return (
      <ErrorMessage
        error={error}
        onRetry={() => {
          setError(null);
          handleTodayClick();
        }}
      />
    );
  }

  // Main content with integrated loader
  return (
    <LoaderWrapper 
      isVisible={loading} 
      minDuration={1000}
    >
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-20 w-80 h-80 bg-purple-500/20 blur-[120px]" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-blue-500/20 blur-[100px]" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-pink-500/20 blur-[100px]" />
        </div>

        {/* Header with Navigation only */}
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

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              NASA&apos;s Astronomy Picture of the Day
            </h1>
          </motion.div>

          {/* Main Content */}
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex justify-center"
            >
              <APODImageInfo
                data={data}
                currentImageIndex={currentImageIndex}
                useHD={useHD}
                setUseHD={setUseHD}
                imageLoaded={imageLoaded}
                setImageLoaded={setImageLoaded}
                openImageInNewTab={openImageInNewTab}
                navigateImages={navigateImages}
                searchSection={
                  /* Compact Date Selection with reduced width */
                  <div className="inline-block">
                    <DateSelectionButton
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      startDate={startDate}
                      setStartDate={setStartDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                      isDateRange={isDateRange}
                      setIsDateRange={setIsDateRange}
                      onSearch={handleDateSearch}
                      onTodayClick={handleTodayClick}
                      minDate={minDate}
                      maxDate={maxDate}
                      currentDate={getCurrentDate()}
                      compact={true}
                      reducedWidth={true}
                    />
                  </div>
                }
              />
            </motion.div>
          )}

          {/* Empty section for future use */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto w-full"
          >
          </motion.div>
        </div>
      </div>
    </LoaderWrapper>
  );
}
