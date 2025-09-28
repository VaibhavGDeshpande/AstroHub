// app/about/page.tsx
'use client';
import { useState, useEffect } from 'react';
import About from "@/components/about/About";
import LoaderWrapper from "@/components/Loader";

export default function AboutPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoaderWrapper 
      isVisible={isLoading} 
      minDuration={1000}
    >
      <About />
    </LoaderWrapper>
  );
}

