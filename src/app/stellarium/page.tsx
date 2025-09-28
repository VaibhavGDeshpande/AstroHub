// components/StellariumViewer.tsx
'use client';

import { useState, useRef } from 'react';
import LoaderWrapper from '@/components/Loader'; // Adjust path as needed

const StellariumViewer: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <LoaderWrapper>
      <iframe
        ref={iframeRef}
        src="https://stellarium-web.org/"
        title="Stellarium Web - Interactive Sky Map"
        className="w-full h-screen border-0"
        onLoad={handleLoad}
        loading="eager"
        allow="geolocation; camera; microphone"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
      />
    </LoaderWrapper>
  );
};

export default StellariumViewer;
