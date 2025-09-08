// pages/epic.tsx or components/EPICPage.tsx
'use client'
import { useState, useEffect } from 'react';
import EPICImageInfo from '@/components/EPIC/Epic';
import { getEpicData } from '@/api_service/get_epic';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const EPICPage = () => {
    const MAX_DATE = '2025-07-15';
  const [epicData, setEpicData] = useState({ images: [], imageUrls: [] });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(MAX_DATE)
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpicData = async () => {
      setLoading(true);
      try {
        const data = await getEpicData(selectedDate);
        setEpicData(data);
        setCurrentImageIndex(0);
      } catch (error) {
        console.error('Failed to fetch EPIC data:', error);
        setEpicData({ images: [], imageUrls: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchEpicData();
  }, [selectedDate]);

  const openImageInNewTab = (url: string) => {
    window.open(url, '_blank');
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
        <div className="fixed top-4 left-4 z-50">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">EPIC - Earth Images</h1>
          <p className="text-slate-300">View Earth from the DSCOVR satellite at L1 Lagrange point</p>
        </header>
        
        <div className="h-[calc(100vh-200px)]">
          <EPICImageInfo
            data={epicData}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            imageLoaded={imageLoaded}
            setImageLoaded={setImageLoaded}
            openImageInNewTab={openImageInNewTab}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default EPICPage;
