// components/StellariumViewer.tsx
'use client';

import { useRef } from 'react';
import LoaderWrapper from '@/components/Loader'; // Adjust path as needed

const StellariumViewer: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    // You can add any post-load logic here if needed
    console.log('Stellarium loaded successfully');
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
