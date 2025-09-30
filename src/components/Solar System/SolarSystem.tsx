import React from 'react';

interface SolarSystemEmbedProps {
  embedOptions?: {
    locked?: boolean;
    logo?: boolean;
    menu?: boolean;
    featured?: boolean;
    content?: boolean;
    search?: boolean;
  };
  className?: string;
}

const SolarSystemEmbed: React.FC<SolarSystemEmbedProps> = ({
  embedOptions = {},
  className = ''
}) => {
  const buildEmbedUrl = (): string => {
    const baseUrl = 'https://eyes.nasa.gov/apps/solar-system/#/home';
    const params = new URLSearchParams({ embed: 'true' });
    
    if (embedOptions.locked !== undefined) {
      params.append('locked', embedOptions.locked.toString());
    }
    if (embedOptions.logo !== undefined) {
      params.append('logo', embedOptions.logo.toString());
    }
    if (embedOptions.menu !== undefined) {
      params.append('menu', embedOptions.menu.toString());
    }
    if (embedOptions.featured !== undefined) {
      params.append('featured', embedOptions.featured.toString());
    }
    if (embedOptions.content !== undefined) {
      params.append('content', embedOptions.content.toString());
    }
    if (embedOptions.search !== undefined) {
      params.append('search', embedOptions.search.toString());
    }

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div 
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <iframe
        id="nasa-solar-system-iframe"
        src={buildEmbedUrl()}
        title="Our Solar System in Real-Time"
        style={{
          display: 'block',
          width: '100vw',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0
        }}
        allow="fullscreen"
        aria-label="NASA Solar System 3D Visualization"
      >
        Unable to render the NASA Solar System visualization
      </iframe>
    </div>
  );
};

export default SolarSystemEmbed;
