"use client";

import { useState, useRef } from "react";

export default function MapWithFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="flex justify-center">
      <div
        ref={containerRef}
        className="w-full max-w-2xl shadow-lg rounded-2xl overflow-hidden border border-white/20 relative"
      >
        <div className="relative w-full pt-[65%] bg-black">
          <iframe
            title="Global light pollution overlay"
            src="https://djlorenz.github.io/astronomy/lp/overlay/dark.html"
            className="absolute inset-0 w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white px-3 py-2 rounded-lg backdrop-blur transition z-10 border border-white/30 text-sm font-semibold"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? "⊗ Exit" : "⛶ Fullscreen"}
        </button>
      </div>
    </div>
  );
}
