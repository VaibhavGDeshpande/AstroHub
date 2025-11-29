'use client'
import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image - Positioned to show Earth at bottom and astronaut in upper portion */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/assets/404.webp)',
          backgroundPosition: 'center 60%', // Adjusted to show more of the astronaut
        }}
      >
        {/* Subtle gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 pt-20">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 drop-shadow-[0_0_30px_rgba(0,0,0,0.9)] tracking-wider leading-tight">
          LOST IN SPACE
        </h1>

        {/* Description */}
        <div className="space-y-4 mb-12">
          <p className="text-lg md:text-xl lg:text-2xl text-gray-100 drop-shadow-[0_0_20px_rgba(0,0,0,0.9)] font-light leading-relaxed">
            The page you&apos;re looking for has drifted into the void.
          </p>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-100 drop-shadow-[0_0_20px_rgba(0,0,0,0.9)] font-light leading-relaxed">
            Just like this astronaut, you&apos;ve floated away from your destination.
          </p>
        </div>

        {/* Return Home Button */}
        <div className="flex justify-center mb-16">
          <button
            onClick={() => window.location.href = '/'}
            className="group relative px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_rgba(59,130,246,0.8)]"
          >
            <span className="flex items-center justify-center gap-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Return Home
            </span>
          </button>
        </div>

        {/* Quote */}
        <p className="text-base md:text-lg text-gray-200 italic drop-shadow-[0_0_20px_rgba(0,0,0,0.9)] max-w-3xl mx-auto leading-relaxed">
          &quot;Space is big. You just won&apos;t believe how vastly, hugely, mind-bogglingly big it is.&quot;
        </p>
      </div>

      {/* Floating stars for ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              width: `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}