// components/Header.tsx
'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset;
      
      setScrollY(currentScrollY);
      
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

  // Categorized data from cardData.ts
  const exploreCategories = [
    {
      id: 'nasa-data',
      title: 'NASA Data',
      items: [
        { name: 'Astronomy Picture of the Day', path: '/apod' },
        { name: 'Mars Rover Photos', path: '/mars-rover' },
        { name: 'Near Earth Objects', path: '/neo' },
        { name: 'EPIC Earth Images', path: '/epic' },
        { name: 'NASA Image Library', path: '/images' },
        { name: 'NASA Eyes', path: '/nasa-eyes' }
      ]
    },
    {
      id: '3d-models',
      title: '3D Models',
      items: [
        { name: 'Solar System Explorer', path: '/solar-system' },
        { name: '3D View of Earth', path: '/3d-earth' },
        { name: '3D View of Moon', path: '/3d-moon' },
        { name: '3D View of Mars', path: '/3d-mars' }
      ]
    },
    {
      id: 'sky-tools',
      title: 'Sky Tools',
      items: [
        { name: 'Stellarium Sky Map', path: '/stellarium' },
        { name: 'Sky Charts', path: '/sky-charts' }
      ]
    },
    {
      id: 'news',
      title: 'News & Learning',
      items: [
        { name: 'Space News & Updates', path: '/space-news' },
        { name: 'Space Quiz', path: '/space-quiz' }
      ]
    }
  ];

  // Filter categories and items based on search query
  const filteredCategories = exploreCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const SpaceLogo = () => {
    const isCompact = scrollY > 50;
    
    return (
      <div className="flex items-center space-x-3">
        <div className="relative">
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

  const getHeaderClasses = () => {
    let transformClass = 'translate-y-0';
    let heightClass = 'h-16';
    
    if (scrollDirection === 'down' && scrollY > 100) {
      transformClass = '-translate-y-full';
    }
    
    if (scrollY > 50) {
      heightClass = 'h-14';
    }
    
    return `${transformClass} ${heightClass}`;
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500 ease-in-out ${getHeaderClasses()}`}>
      <div className="container mx-auto px-4">
        <div className={`flex items-center justify-between transition-all duration-500 ${scrollY > 50 ? 'h-14' : 'h-16'}`}>
          <Link href="/" className="hover:scale-105 transition-transform duration-300 relative z-10">
            <SpaceLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 relative z-10">
          
            {/* Explore Dropdown with Hover */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => {
                setIsDropdownOpen(false);
                setSearchQuery('');
              }}
            >
              <button
                className="flex items-center space-x-1 text-white hover:text-cyan-400 transition-colors group drop-shadow-lg"
              >
                <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Explore</span>
                <ChevronDownIcon className={`transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${scrollY > 50 ? 'h-3 w-3' : 'h-4 w-4'}`} />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </button>

              {/* Larger Dropdown Menu with Search and Categories */}
              <div className={`absolute right-0 mt-2 w-[600px] bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-cyan-400/20 z-50 transition-all duration-300 ease-out origin-top-right ${
                isDropdownOpen 
                  ? 'opacity-100 visible transform scale-100 translate-y-0' 
                  : 'opacity-0 invisible transform scale-95 -translate-y-2 pointer-events-none'
              }`}>
                {/* Search Bar */}
                <div className="p-4 border-b border-cyan-400/20 sticky top-0 bg-black/95 backdrop-blur-xl z-10">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyan-400" />
                    <input
                      type="text"
                      placeholder="Search astronomy tools..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-black/50 border border-cyan-400/30 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Categorized Menu Items - No Scrollbar */}
                <div 
                  className="p-4 max-h-[480px] overflow-y-auto hide-scrollbar"
                  style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                  }}
                >
                  <style jsx>{`
                    .hide-scrollbar::-webkit-scrollbar {
                      display: none;
                    }
                  `}</style>

                  {filteredCategories.length > 0 ? (
                    <div className="grid grid-cols-2 gap-6">
                      {filteredCategories.map((category, categoryIndex) => (
                        <div 
                          key={category.id}
                          className={`transition-all duration-300 ${
                            isDropdownOpen 
                              ? 'opacity-100 translate-y-0' 
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{ 
                            transitionDelay: isDropdownOpen ? `${100 + (categoryIndex * 100)}ms` : '0ms' 
                          }}
                        >
                          {/* Category Header */}
                          <div className="mb-3 pb-2 border-b border-cyan-400/20">
                            <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wide">
                              {category.title}
                            </h3>
                          </div>

                          {/* Category Items */}
                          <div className="space-y-1">
                            {category.items.map((item, itemIndex) => (
                              <Link
                                key={itemIndex}
                                href={item.path}
                                className="block px-3 py-2.5 text-sm text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-cyan-100 rounded-lg transition-all duration-200 hover:translate-x-1"
                                onClick={() => {
                                  setIsDropdownOpen(false);
                                  setSearchQuery('');
                                }}
                              >
                                <div className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full flex-shrink-0" />
                                  <span className="line-clamp-1">{item.name}</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <div className="text-cyan-400/30 text-6xl mb-4">🔍</div>
                      <p className="text-gray-400 text-sm">
                        No tools found matching <span className="text-cyan-400">&quot;{searchQuery}&quot;</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link href="/about" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
              <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>About</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>

            {/* Additional Links */}
            <Link href="/contact-us" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
              <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Contact</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <Link href="/privacy-policy" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
              <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Privacy Policy</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>

            <Link href="/terms-and-conditions" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
              <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Terms & Conditions</span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
            </Link>
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
          <div className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl rounded-b-xl transition-all duration-300 ease-out ${
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
              
              {/* Mobile Search */}
              <div className={`transition-all duration-300 ${
                isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`} style={{ transitionDelay: '250ms' }}>
                <div className="relative mb-3">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-cyan-400/30 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Mobile Categorized Items - No Scrollbar */}
              <div 
                className={`space-y-4 max-h-[400px] overflow-y-auto hide-scrollbar transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                style={{ 
                  transitionDelay: '300ms',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <style jsx>{`
                  .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>

                {filteredCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="text-cyan-300 text-sm font-semibold uppercase tracking-wide">
                      {category.title}
                    </div>
                    {category.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.path}
                        className="block pl-4 text-sm text-white hover:text-cyan-400 transition-all duration-300"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-cyan-400 rounded-full" />
                          <span>{item.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
                
                {filteredCategories.length === 0 && (
                  <div className="pl-4 text-sm text-gray-400 text-center py-8">
                    No tools found
                  </div>
                )}
              </div>

              {/* Mobile Additional Links */}
              <div className="pt-4 border-t border-cyan-400/20 space-y-3">
                <Link href="/contact" className={`block text-white hover:text-cyan-400 transition-all duration-300 font-medium ${
                  isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                      style={{ transitionDelay: '400ms' }}
                      onClick={() => setIsMobileMenuOpen(false)}>
                  Contact Us
                </Link>
                <Link href="/privacy-policy" className={`block text-white hover:text-cyan-400 transition-all duration-300 font-medium ${
                  isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                      style={{ transitionDelay: '450ms' }}
                      onClick={() => setIsMobileMenuOpen(false)}>
                  Privacy Policy
                </Link>
                <Link href="/terms-conditions" className={`block text-white hover:text-cyan-400 transition-all duration-300 font-medium ${
                  isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                }`}
                      style={{ transitionDelay: '500ms' }}
                      onClick={() => setIsMobileMenuOpen(false)}>
                  Terms & Conditions
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
