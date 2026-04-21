"use client";

import { useEffect, useRef, useState } from "react";

type LightPollutionMapProps = {
  className?: string;
  frameClassName?: string;
};

export default function LightPollutionMap({ className = "", frameClassName = "" }: LightPollutionMapProps) {
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

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative shadow-2xl rounded-2xl overflow-hidden border border-white/10 bg-black/60 ${className}`}
    >
      <div className={`relative w-full pt-[100%] md:pt-[65%] bg-slate-900 ${frameClassName}`}>
        <iframe
          title="Global light pollution overlay"
          src="https://djlorenz.github.io/astronomy/lp/overlay/dark.html"
          className="absolute inset-0 w-full h-full border-0 grayscale invert opacity-80 brightness-75 contrast-125"
          loading="lazy"
          allowFullScreen
        />
        <div className="absolute inset-0 pointer-events-none border border-white/5 bg-gradient-to-b from-transparent via-transparent to-black/20" />
      </div>

      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 bg-black/70 hover:bg-black/90 text-white px-3 py-2 rounded-lg backdrop-blur transition z-10 border border-white/30 text-sm font-semibold"
        aria-label="Toggle fullscreen"
      >
        {isFullscreen ? "⊗ Exit" : "⛶ Fullscreen"}
      </button>
    </div>
  );
}
