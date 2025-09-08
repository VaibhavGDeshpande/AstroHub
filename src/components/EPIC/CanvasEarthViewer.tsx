// components/EPIC/CanvasEarthViewer.tsx
'use client'
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface CanvasEarthViewerProps {
  imageUrl: string;
  zoom: number;
  pan: { x: number; y: number };
  onImageLoad: () => void;
  onImageLoadStart: () => void;
  onZoomChange: (newZoom: number) => void;
  onPanChange: (newPan: { x: number; y: number }) => void;
  imageLoaded: boolean;
}

const CanvasEarthViewer: React.FC<CanvasEarthViewerProps> = ({
  imageUrl,
  zoom,
  pan,
  onImageLoad,
  onImageLoadStart,
  onZoomChange,
  onPanChange,
  imageLoaded
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Load and cache the image
  useEffect(() => {
    if (!imageUrl) return;

    onImageLoadStart();
    const img = new Image();
    img.crossOrigin = 'anonymous'; // For CORS
    
    img.onload = () => {
      imageRef.current = img;
      onImageLoad();
      drawCanvas();
    };
    
    img.onerror = () => {
      console.error('Failed to load image:', imageUrl);
    };
    
    img.src = imageUrl;
  }, [imageUrl, onImageLoad, onImageLoadStart]);

  // Handle canvas resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: rect.width,
          height: rect.height
        });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Draw the canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate image dimensions and positioning
    const canvasAspect = canvas.width / canvas.height;
    const imageAspect = img.width / img.height;
    
    let drawWidth, drawHeight;
    
    if (imageAspect > canvasAspect) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imageAspect;
    } else {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imageAspect;
    }

    // Apply zoom
    drawWidth *= zoom;
    drawHeight *= zoom;

    // Calculate center position with pan offset
    const centerX = canvas.width / 2 + pan.x;
    const centerY = canvas.height / 2 + pan.y;
    
    const drawX = centerX - drawWidth / 2;
    const drawY = centerY - drawHeight / 2;

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Draw the image
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

    // Optional: Draw grid overlay for that classic Earth viewer look
    if (zoom > 1.5) {
      drawGridOverlay(ctx, canvas.width, canvas.height, drawX, drawY, drawWidth, drawHeight);
    }
  }, [zoom, pan]);

  // Draw grid overlay (like the NASA EPIC interface)
  const drawGridOverlay = (
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    imageX: number,
    imageY: number,
    imageWidth: number,
    imageHeight: number
  ) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 4]);

    // Draw longitude lines (vertical)
    const lonStep = imageWidth / 12; // 30-degree intervals
    for (let i = 0; i <= 12; i++) {
      const x = imageX + i * lonStep;
      if (x >= 0 && x <= canvasWidth) {
        ctx.beginPath();
        ctx.moveTo(x, Math.max(0, imageY));
        ctx.lineTo(x, Math.min(canvasHeight, imageY + imageHeight));
        ctx.stroke();
      }
    }

    // Draw latitude lines (horizontal)
    const latStep = imageHeight / 8; // Approximate latitude intervals
    for (let i = 0; i <= 8; i++) {
      const y = imageY + i * latStep;
      if (y >= 0 && y <= canvasHeight) {
        ctx.beginPath();
        ctx.moveTo(Math.max(0, imageX), y);
        ctx.lineTo(Math.min(canvasWidth, imageX + imageWidth), y);
        ctx.stroke();
      }
    }

    ctx.setLineDash([]); // Reset line dash
  };

  // Redraw canvas when zoom or pan changes
  useEffect(() => {
    if (imageRef.current && imageLoaded) {
      drawCanvas();
    }
  }, [zoom, pan, imageLoaded, canvasSize, drawCanvas]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        setDragStart({
          x: e.clientX - rect.left - pan.x,
          y: e.clientY - rect.top - pan.y
        });
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newPan = {
          x: e.clientX - rect.left - dragStart.x,
          y: e.clientY - rect.top - dragStart.y
        };
        onPanChange(newPan);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = 1.2;
    const newZoom = e.deltaY > 0 
      ? Math.max(zoom / zoomFactor, 0.5)
      : Math.min(zoom * zoomFactor, 5);
    
    onZoomChange(newZoom);
  };

  const handleDoubleClick = () => {
    if (zoom === 1) {
      onZoomChange(2);
    } else {
      onZoomChange(1);
      onPanChange({ x: 0, y: 0 });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative overflow-hidden rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 w-full h-full flex items-center justify-center group"
    >
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className={`max-w-full max-h-full ${isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-pointer'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      />

      {/* Loading overlay */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 backdrop-blur-sm">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
          />
        </div>
      )}

      {/* Zoom indicator */}
      {zoom > 1 && imageLoaded && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-green-400/50">
          <div className="flex items-center space-x-1">
            <span>{(zoom * 100).toFixed(0)}%</span>
          </div>
        </div>
      )}

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-white text-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Scroll to zoom • Drag to pan • Double-click to reset</span>
      </div>

      {/* Crosshair center indicator when zoomed */}
      {zoom > 2 && imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-6 h-6 border border-white/50 rounded-full">
            <div className="w-full h-full border border-white/30 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasEarthViewer;
