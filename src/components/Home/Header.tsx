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
    { name: 'Mars Rover Photos', path: '/mars-photos' },
    { name: 'Near Earth Objects', path: '/neo' },
    { name: 'EPIC - Earth Polychromatic Imaging', path: '/epic' },
    { name: 'NASA Image Library', path: '/images' },
    { name: '3D View of Moon', path: "/3d-moon" },
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
              alt="AstroHub Logo"
              width={isCompact ? 120 : 140}
              height={isCompact ? 32 : 40}
              className="transition-all duration-500"
            />
          </div>
        </div>
      </div>
    );
  };

  // Calculate header transform - keep transparent always
  const getHeaderClasses = () => {
    let transformClass = 'translate-y-0';
    let heightClass = 'h-16';
    
    // Hide header when scrolling down, show when scrolling up
    if (scrollDirection === 'down' && scrollY > 100) {
      transformClass = '-translate-y-full';
    }
    
    // Make header smaller on scroll but keep transparent
    if (scrollY > 50) {
      heightClass = 'h-14';
    }
    
    return `${transformClass} ${heightClass}`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500 ease-in-out ${getHeaderClasses()}`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrollY > 50 ? 'h-14' : 'h-16'}`}>
          {/* Logo */}
          <Link href="/" className="hover:scale-105 transition-transform duration-300 relative z-10">
            <SpaceLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 relative z-10">
            <Link href="/" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
              <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Home</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <Link href="/about" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
              <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>About</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
            
            <Link href="/documentation" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
              <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Documentation</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* API Components Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-white hover:text-cyan-400 transition-colors group drop-shadow-lg"
              >
                <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Explore</span>
                <ChevronDownIcon className={`transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${scrollY > 50 ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </button>

              {/* Dropdown Menu */}
              <div className={`absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl rounded-xl shadow-2xl border border-cyan-400/20 py-2 z-50 transition-all duration-300 ease-out origin-top-right ${
                isDropdownOpen 
                  ? 'opacity-100 visible transform scale-100 translate-y-0' 
                  : 'opacity-0 invisible transform scale-95 -translate-y-2'
              }`}>
                {/* Header */}
                {/* <div className={`px-4 py-3 text-sm text-cyan-300 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 transition-all duration-300 ${
                  isDropdownOpen ? 'opacity-100 translate-x-0 delay-75' : 'opacity-0 -translate-x-4'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="font-medium">Astronomy Tools</span>
                  </div>
                </div> */}
                
                {/* Menu Items */}
                {apiComponents.map((component, index) => (
                  <Link
                    key={index}
                    href={component.path}
                    className={`block px-4 py-3 text-sm text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-cyan-100 transition-all duration-200 hover:translate-x-1 ${
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
                      <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                      <span>{component.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white hover:text-cyan-400 transition-colors relative z-10 drop-shadow-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className={`transition-all duration-300 ${scrollY > 50 ? 'h-5 w-5' : 'h-6 w-6'}`} />
            ) : (
              <Bars3Icon className={`transition-all duration-300 ${scrollY > 50 ? 'h-5 w-5' : 'h-6 w-6'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl rounded-b-xl transition-all duration-300 ease-out ${
            isMobileMenuOpen 
              ? 'opacity-100 visible transform translate-y-0' 
              : 'opacity-0 invisible transform -translate-y-4'
          }`}>
            <nav className="px-4 py-6 space-y-4 relative z-10">
              <Link href="/" className={`block text-white hover:text-cyan-400 transition-all duration-300 font-medium ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
                    style={{ transitionDelay: '100ms' }}
                    onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <Link href="/about" className={`block text-white hover:text-cyan-400 transition-all duration-300 font-medium ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
                    style={{ transitionDelay: '150ms' }}
                    onClick={() => setIsMobileMenuOpen(false)}>
                About
              </Link>
              <Link href="/documentation" className={`block text-white hover:text-cyan-400 transition-all duration-300 font-medium ${
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
                <div className="text-cyan-300 text-sm font-medium">Astronomy Tools</div>
                {apiComponents.map((component, index) => (
                  <Link
                    key={index}
                    href={component.path}
                    className={`block pl-4 text-sm text-white hover:text-cyan-400 transition-all duration-300 ${
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
    </header>
  );
};

export default Header;
