// components/Header.tsx
'use client'
import { useState } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const apiComponents = [
    { name: 'APOD - Astronomy Picture of the Day', path: '/apod' },
    { name: 'Mars Rover Photos', path: '/mars-rover' },
    { name: 'Near Earth Objects', path: '/neo' },
    { name: 'Earth Imagery', path: '/earth' },
    { name: 'EPIC - Earth Polychromatic Imaging', path: '/epic' },
    { name: 'Exoplanet Archive', path: '/exoplanet' },
    { name: 'NASA Image Library', path: '/images' },
    { name: 'Solar Flare Data', path: '/solar' },
  ];

  const SpaceLogo = () => (
    <div className="flex items-center space-x-3">
      <div className="relative">
        {/* Orbital rings */}
        <div className="absolute inset-0 w-10 h-10 border-2 border-blue-400/30 rounded-full animate-spin" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute inset-1 w-8 h-8 border border-purple-400/30 rounded-full animate-spin" 
             style={{ animationDuration: '6s', animationDirection: 'reverse' }} />
        
        {/* Central planet/star */}
        <div className="relative w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25">
          <div className="w-6 h-6 bg-gradient-to-br from-white to-blue-200 rounded-full animate-pulse" />
          {/* Small satellites */}
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce" 
               style={{ animationDelay: '0.5s' }} />
          <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-green-400 rounded-full animate-bounce" 
               style={{ animationDelay: '1s' }} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent">
          NASA Explorer
        </span>
        <span className="text-xs text-blue-400/70 -mt-1">Space Data Portal</span>
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg border-b border-blue-500/20">
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-20 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-6 right-32 w-0.5 h-0.5 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-4 right-20 w-0.5 h-0.5 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-3 left-1/2 w-0.5 h-0.5 bg-pink-300 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="hover:scale-105 transition-transform duration-300">
            <SpaceLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="relative group text-white hover:text-blue-400 transition-colors">
              <span>Home</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <Link href="/about" className="relative group text-white hover:text-blue-400 transition-colors">
              <span>About</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <Link href="/documentation" className="relative group text-white hover:text-blue-400 transition-colors">
              <span>Documentation</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* API Components Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors group"
              >
                <span>API Components</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900/95 backdrop-blur-lg rounded-xl shadow-2xl border border-slate-700/50 py-2 z-50">
                  <div className="px-4 py-3 text-sm text-slate-400 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      <span>Available API Components</span>
                    </div>
                  </div>
                  {apiComponents.map((component, index) => (
                    <Link
                      key={index}
                      href={component.path}
                      className="block px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-200 hover:translate-x-1"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                        <span>{component.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white hover:text-blue-400 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
            <nav className="px-4 py-6 space-y-4">
              <Link href="/" className="block text-white hover:text-blue-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" className="block text-white hover:text-blue-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/documentation" className="block text-white hover:text-blue-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}>
                Documentation
              </Link>
              
              <div className="space-y-2">
                <div className="text-slate-400 text-sm font-medium">API Components</div>
                {apiComponents.map((component, index) => (
                  <Link
                    key={index}
                    href={component.path}
                    className="block pl-4 text-sm text-white hover:text-blue-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {component.name}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;