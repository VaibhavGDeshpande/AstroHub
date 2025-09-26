// components/Header.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset;
      
      setScrollY(currentScrollY);
      
      // Only update direction if scroll difference is significant (> 10px)
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        const direction = currentScrollY > lastScrollY ? "down" : "up";
        
        if (direction !== scrollDirection) {
          setScrollDirection(direction);
        }
        
        setLastScrollY(currentScrollY > 0 ? currentScrollY : 0);
      }
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  const apiComponents = [
    { name: 'APOD - Astronomy Picture of the Day', path: '/apod' },
    { name: 'Mars Rover Photos', path: '/mars-rover' },
    { name: 'Near Earth Objects', path: '/neo' },
    { name: 'EPIC - Earth Polychromatic Imaging', path: '/epic' },
    { name: 'NASA Image Library', path: '/images' },
    { name: '3D View of moon', path: "/3d-moon" },
    { name: "3D View of Mars", path: "/3d-mars" }
  ];

  const SpaceLogo = () => {
    const isCompact = scrollY > 50;
    
    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
          {/* Logo Image */}
          <div className="flex flex-col">
            <img
              src="/assets/AstroHub.png"
              alt="NASA Explorer Logo"
              width={isCompact ? 120 : 140}
              height={isCompact ? 32 : 40}
              className="transition-all duration-500"
            />
          </div>
        </div>
      </div>
    );
  };

  // Calculate header transform and size based on scroll
  const getHeaderClasses = () => {
    let transformClass = 'translate-y-0';
    let heightClass = 'h-16';
    
    // Hide header when scrolling down, show when scrolling up
    if (scrollDirection === 'down' && scrollY > 100) {
      transformClass = '-translate-y-full';
    }
    
    // Make header smaller on scroll
    if (scrollY > 50) {
      heightClass = 'h-14';
    }
    
    return `${transformClass} ${heightClass}`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg transition-all duration-500 ease-in-out ${getHeaderClasses()}`}>
      {/* EXACTLY MATCHING Hero Section Space Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Enhanced nebula-like glow effects - EXACT MATCH */}
        <div className="absolute top-0 left-20 w-96 h-96 bg-gradient-radial from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse" 
             style={{ animationDuration: '6s' }} />
        <div className="absolute top-4 right-32 w-80 h-80 bg-gradient-radial from-blue-500/10 via-blue-500/5 to-transparent rounded-full blur-2xl animate-pulse" 
             style={{ animationDuration: '8s', animationDelay: '2s' }} />
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-64 h-32 bg-gradient-to-r from-transparent via-cyan-500/8 to-transparent rounded-full blur-xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '4s' }} />
        
        {/* Cosmic energy waves - EXACT MATCH */}
        <div className="cosmic-wave absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-400/8 to-transparent animate-wave-move" />
        <div className="cosmic-wave-2 absolute top-0 left-0 w-full h-full bg-gradient-to-l from-transparent via-purple-400/6 to-transparent animate-wave-move-reverse" />
        
        {/* NO particle streams - matching hero section which has them commented out */}
      </div>
      
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrollY > 50 ? 'h-14' : 'h-16'}`}>
          {/* Logo */}
          <Link href="/" className="hover:scale-105 transition-transform duration-300 relative z-10">
            <SpaceLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 relative z-10">
            <Link href="/" className="relative group text-white hover:text-blue-400 transition-colors">
              <span className={`transition-all duration-300 ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Home</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <Link href="/about" className="relative group text-white hover:text-blue-400 transition-colors">
              <span className={`transition-all duration-300 ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>About</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <Link href="/documentation" className="relative group text-white hover:text-blue-400 transition-colors">
              <span className={`transition-all duration-300 ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Documentation</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* API Components Dropdown with Animation */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors group"
              >
                <span className={`transition-all duration-300 ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>API Components</span>
                <ChevronDownIcon className={`transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${scrollY > 50 ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 group-hover:w-full transition-all duration-300" />
              </button>

              {/* Animated Dropdown Menu */}
              <div className={`absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 py-2 z-50 transition-all duration-300 ease-out origin-top-right ${
                isDropdownOpen 
                  ? 'opacity-100 visible transform scale-100 translate-y-0' 
                  : 'opacity-0 invisible transform scale-95 -translate-y-2'
              }`}>
                {/* Header with staggered animation */}
                <div className={`px-4 py-3 text-sm text-gray-400 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 transition-all duration-300 ${
                  isDropdownOpen ? 'opacity-100 translate-x-0 delay-75' : 'opacity-0 -translate-x-4'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                    <span>Available API Components</span>
                  </div>
                </div>
                
                {/* Menu Items with staggered animation */}
                {apiComponents.map((component, index) => (
                  <Link
                    key={index}
                    href={component.path}
                    className={`block px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 transition-all duration-200 hover:translate-x-1 ${
                      isDropdownOpen 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ 
                      transitionDelay: isDropdownOpen ? `${100 + (index * 50)}ms` : '0ms' 
                    }}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-1 h-1 bg-blue-400 rounded-full" />
                      <span>{component.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white hover:text-blue-400 transition-colors relative z-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className={`transition-all duration-300 ${scrollY > 50 ? 'h-5 w-5' : 'h-6 w-6'}`} />
            ) : (
              <Bars3Icon className={`transition-all duration-300 ${scrollY > 50 ? 'h-5 w-5' : 'h-6 w-6'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu with Animation */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg transition-all duration-300 ease-out ${
            isMobileMenuOpen 
              ? 'opacity-100 visible transform translate-y-0' 
              : 'opacity-0 invisible transform -translate-y-4'
          }`}>
            <nav className="px-4 py-6 space-y-4 relative z-10">
              <Link href="/" className={`block text-white hover:text-blue-400 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
                    style={{ transitionDelay: '100ms' }}
                    onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" className={`block text-white hover:text-blue-400 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
                    style={{ transitionDelay: '150ms' }}
                    onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/documentation" className={`block text-white hover:text-blue-400 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
                    style={{ transitionDelay: '200ms' }}
                    onClick={() => setIsMobileMenuOpen(false)}>
                Documentation
              </Link>
              
              <div className={`space-y-2 transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
                   style={{ transitionDelay: '250ms' }}>
                <div className="text-gray-400 text-sm font-medium">API Components</div>
                {apiComponents.map((component, index) => (
                  <Link
                    key={index}
                    href={component.path}
                    className={`block pl-4 text-sm text-white hover:text-blue-400 transition-all duration-300 ${
                      isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${300 + (index * 50)}ms` }}
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

      {/* EXACTLY MATCHING Hero Section CSS Animations */}
      <style jsx>{`
        @keyframes wave-move {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes wave-move-reverse {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes stream {
          0% {
            opacity: 0;
            transform: translateY(-30px) scaleY(0);
          }
          50% {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          100% {
            opacity: 0;
            transform: translateY(30px) scaleY(0.3);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-wave-move {
          animation: wave-move 20s linear infinite;
        }

        .animate-wave-move-reverse {
          animation: wave-move-reverse 25s linear infinite;
        }

        .animate-stream {
          animation: stream 4s ease-in-out infinite;
        }

        .animate-stream-delayed {
          animation: stream 5s ease-in-out infinite;
          animation-delay: 2s;
        }

        .animate-stream-slow {
          animation: stream 7s ease-in-out infinite;
          animation-delay: 4s;
        }

        .animate-stream-fast {
          animation: stream 3s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </header>
  );
};

export default Header;
