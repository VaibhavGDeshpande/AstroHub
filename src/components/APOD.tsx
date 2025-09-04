'use client'
import { useState, useEffect } from "react";   
import Image from "next/image";
import { getAPOD } from '../api_service/APOD';

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

export default function Home() {
  const [data, setData] = useState<APODData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [useHD, setUseHD] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAPOD();
        setData(result);
        console.log('APOD data:', result);
      } catch (err) {
        console.error('Failed to fetch APOD:', err);
        setError(err instanceof Error ? err.message : 'Failed to load APOD data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading today&apos;s astronomy picture...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>No data available</div>
      </div>
    );
  }

  // Determine which image URL to use
  const imageUrl = useHD && data.hdurl ? data.hdurl : data.url;
  const hasHDVersion = !!data.hdurl;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">NASA Astronomy Picture of the Day</h1>
      <h2 className="text-2xl font-semibold mb-4">{data.title}</h2>
      
      {/* HD Toggle Button */}
      {hasHDVersion && data.media_type === 'image' && (
        <div className="mb-4">
          <button
            onClick={() => setUseHD(!useHD)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {useHD ? 'Switch to Standard Quality' : 'Switch to HD Quality'}
          </button>
          <span className="ml-2 text-sm text-gray-600">
            Currently showing: {useHD ? 'HD' : 'Standard'} quality
          </span>
        </div>
      )}

      <div className="mb-6">
        {data.media_type === 'image' ? (
          <div className="relative">
            <img
              src={imageUrl} 
              alt={data.title} 
              width={800} 
              height={600}
              className="rounded-lg shadow-lg"
            />
            {/* HD indicator */}
            {useHD && data.hdurl && (
              <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                HD
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p>Today&apos;s APOD is a video. View it at:</p>
          </div>
        )}
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{data.explanation}</p>
      </div>

      {data.copyright && (
        <p className="text-sm text-gray-500">© {data.copyright}</p>
      )}
      <p className="text-sm text-gray-500">Date: {data.date}</p>
    </div>
  );
}
