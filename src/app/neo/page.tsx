// app/neo/page.tsx
'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getNEO } from "../../api_service/neo";
import { NEOResponse } from "../../types/neo";
import NEOExplorer from "@/components/NEO/NEO";
import {
  ArrowLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import ErrorMessage from "@/components/Error";
import LoaderWrapper from "@/components/Loader";

export default function NEOPage() {
  const [data, setData] = useState<NEOResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date functionality states
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDateRange, setIsDateRange] = useState(true);

  // Get today's date and yesterday as default range
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split("T")[0];
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  useEffect(() => {
    if (!startDate && !endDate) {
      setStartDate(yesterdayStr);
      setEndDate(todayStr);
    }
  }, [yesterdayStr, todayStr, startDate, endDate]);

  const fetchData = async (start?: string, end?: string, date?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      let startDateToUse = start || startDate;
      let endDateToUse = end || endDate;
      
      if (date) {
        startDateToUse = date;
        endDateToUse = date;
      }
      
      if (!startDateToUse || !endDateToUse) {
        throw new Error("Please select both start and end dates");
      }

      const result = await getNEO(startDateToUse, endDateToUse);
      setData(result);
    } catch (err) {
      console.error('Failed to fetch NEO data:', err);
      setError(err instanceof Error ? err.message : "Failed to load NEO data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate]);


  const handleTodayClick = () => {
    setSelectedDate("");
    setStartDate(yesterdayStr);
    setEndDate(todayStr);
    setIsDateRange(true);
    fetchData(yesterdayStr, todayStr);
  };

  const getCurrentDate = () => {
    if (data && Object.keys(data.near_earth_objects).length > 0) {
      return Object.keys(data.near_earth_objects)[0];
    }
    return todayStr;
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

  return (
    <LoaderWrapper 
      isVisible={loading} 
      minDuration={1000}
    >
      <div className="min-h-screen bg-black text-white relative overflow-hidden">

        <div className="container mx-auto px-4 sm:px-6 lg:px-10 py-10 flex flex-col gap-10">
          {/* NEO Explorer Component - All rendering logic moved here */}
          {data && (
            <NEOExplorer/>
          )}
        </div>
      </div>
    </LoaderWrapper>
  );
}
