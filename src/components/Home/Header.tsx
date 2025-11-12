// components/Header.tsx
'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDownIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  type Status = 'live' | 'temporarily-closed';
  type ExploreItem = {
    name: string;
    path: string;
    status: Status;
  };
  type ExploreCategory = {
    id: string;
    title: string;
    icon: string;
    items: ExploreItem[];
  };

  const exploreCategories: ExploreCategory[] = [
    {
      id: 'nasa-data',
      title: 'NASA Data',
      icon: '',
      items: [
        { name: 'Astronomy Picture of the Day', path: '/apod', status: 'temporarily-closed' },
        { name: 'Near Earth Objects', path: '/neo', status: 'live' },
        { name: 'EPIC Earth Images', path: '/epic', status: 'live' },
        { name: 'NASA Image Library', path: '/images', status: 'live' },
        { name: 'NASA Eyes', path: '/nasa-eyes', status: 'live' }
      ]
    },
    {
      id: '3d-models',
      title: '3D Models',
      icon: '',
      items: [
        { name: 'Solar System Explorer', path: '/solar-system', status: 'temporarily-closed' },
        { name: '3D View of Earth', path: '/3d-earth', status: 'live' },
        { name: '3D View of Moon', path: '/3d-moon', status: 'live' },
        { name: '3D View of Mars', path: '/3d-mars', status: 'live' }
      ]
    },
    {
      id: 'sky-tools',
      title: 'Sky Tools',
      icon: '',
      items: [
        { name: 'Stellarium Sky Map', path: '/stellarium', status: 'live' },
        { name: 'Sky Charts', path: '/sky-charts', status: 'live' }
      ]
    },
    {
      id: 'advanced-tools',
      title: 'Advanced Tools',
      icon: '',
      items: [
        { name: 'Telescope Calculator', path: '/telescope-calculator', status: 'live' },
        { name: 'Astrophotography Exposure Calculator', path: '/exposure-calculator', status: 'live' }
      ]
    },
    {
      id: 'news',
      title: 'News & Learning',
      icon: '',
      items: [
        { name: 'Space News & Updates', path: '/space-news', status: 'live' },
        { name: 'Space Quiz', path: '/space-quiz', status: 'live' }
      ]
    },
    {
      id: 'earth-tools',
      title: 'Earth Tools',
      icon: '',
      items: [
        { name: 'Weather Dashboard', path: '/weather', status: 'live' },
        { name: 'Light Pollution Map', path: '/light-pollution', status: 'live' }
      ]
    }
  ];

  const StatusBadge = ({ status }: { status: 'live' | 'temporarily-closed' }) => {
    const statusConfig = {
      'live': {
        text: 'Live',
        bgColor: 'bg-green-500/20',
        textColor: 'text-green-400',
        borderColor: 'border-green-500/30',
        dotColor: 'bg-green-400'
      },
      'temporarily-closed': {
        text: 'Closed',
        bgColor: 'bg-red-500/20',
        textColor: 'text-red-400',
        borderColor: 'border-red-500/30',
        dotColor: 'bg-red-400'
      }
    };

    const config = statusConfig[status];

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bgColor} ${config.textColor} ${config.borderColor}`}>
        <span className={`w-1 h-1 rounded-full ${config.dotColor} animate-pulse`}></span>
        {config.text}
      </span>
    );
  };

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
      <div className="flex items-center" style={{ minHeight: '48px' }}>
        <img
          src="/assets/AstroHub.png"
          alt="AstroHub Logo"
          className={`mt-4 logo-transition ${isCompact
            ? 'w-[90px] sm:w-[100px] md:w-[110px] lg:w-[120px]'
            : 'w-[110px] sm:w-[130px] md:w-[150px] lg:w-[180px]'
            }`}
          style={{
            height: 'auto',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            WebkitTransform: 'translate3d(0, 0, 0)',
          }}
        />
        <style jsx>{`
          .logo-transition {
            transition: none;
          }
          
          @media (min-width: 640px) {
            .logo-transition {
              transition: width 500ms cubic-bezier(0.4, 0, 0.2, 1);
            }
          }
        `}</style>
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
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500 ease-in-out ${getHeaderClasses()}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrollY > 50 ? 'h-14' : 'h-16'}`}>
            <Link href="/" className="hover:scale-105 transition-transform duration-300 relative z-10">
              <SpaceLogo />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 relative z-10">

              {/* Explore Dropdown with Hover */}
              <div
                ref={dropdownRef}
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
                  <span className={`transition-all duration-300 font-medium whitespace-nowrap ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Explore</span>
                  <ChevronDownIcon className={`transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${scrollY > 50 ? 'h-3 w-3' : 'h-4 w-4'}`} />
                  <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                </button>

                {/* Enhanced Dropdown Menu - 3 Column Grid */}
                <div className={`absolute right-0 pt-2 w-[95vw] max-w-[900px] z-50 transition-all duration-300 ease-out origin-top-right ${isDropdownOpen
                  ? 'opacity-100 visible scale-100'
                  : 'opacity-0 invisible scale-95 pointer-events-none'
                  }`}>
                  <div className="bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-cyan-400/20 overflow-hidden">
                    
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

                    {/* Categorized Menu Items - 3 Column Grid */}
                    <div className="p-5 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
                      <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar {
                          width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                          background: rgba(0, 0, 0, 0.3);
                          border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                          background: rgba(34, 211, 238, 0.3);
                          border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                          background: rgba(34, 211, 238, 0.5);
                        }
                      `}</style>

                      {filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {filteredCategories.map((category, categoryIndex) => (
                            <div
                              key={category.id}
                              className={`transition-all duration-300 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg p-4 border border-cyan-400/10 hover:border-cyan-400/30 ${isDropdownOpen
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-2'
                                }`}
                              style={{
                                transitionDelay: isDropdownOpen ? `${50 + (categoryIndex * 50)}ms` : '0ms'
                              }}
                            >
                              {/* Category Header with Icon */}
                              <div className="mb-3 pb-2 border-b border-cyan-400/20">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl">{category.icon}</span>
                                  <h3 className="text-cyan-400 font-semibold text-sm uppercase tracking-wide">
                                    {category.title}
                                  </h3>
                                </div>
                                <div className="text-[10px] text-cyan-400/60 mt-1">
                                  {category.items.length} {category.items.length === 1 ? 'tool' : 'tools'}
                                </div>
                              </div>

                              {/* Category Items */}
                              <div className="space-y-1">
                                {category.items.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    href={item.path}
                                    className={`block px-3 py-2 text-xs rounded-lg transition-all duration-200 hover:translate-x-1 ${
                                      item.status === 'temporarily-closed'
                                        ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-300 cursor-not-allowed opacity-75'
                                        : 'text-white hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-cyan-100'
                                    }`}
                                    onClick={(e) => {
                                      if (item.status === 'temporarily-closed') {
                                        e.preventDefault();
                                        return;
                                      }
                                      setIsDropdownOpen(false);
                                      setSearchQuery('');
                                    }}
                                  >
                                    <div className="flex items-center justify-between gap-2">
                                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                                        <div className={`w-1 h-1 rounded-full flex-shrink-0 ${
                                          item.status === 'live' ? 'bg-cyan-400' : 'bg-red-400'
                                        }`} />
                                        <span className="line-clamp-2 leading-tight">{item.name}</span>
                                      </div>
                                      <StatusBadge status={item.status} />
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

                    {/* Footer with total count */}
                    <div className="px-5 py-3 border-t border-cyan-400/20 bg-black/50">
                      <div className="flex items-center justify-between text-xs text-cyan-400/60">
                        <span>Total: {exploreCategories.reduce((acc, cat) => acc + cat.items.length, 0)} tools available</span>
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                          {exploreCategories.reduce((acc, cat) => acc + cat.items.filter(i => i.status === 'live').length, 0)} live
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/about" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
                <span className={`transition-all duration-300 font-medium whitespace-nowrap ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>About</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>

              <Link href="/contact-us" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
                <span className={`transition-all duration-300 font-medium whitespace-nowrap ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Contact</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>

              <Link href="/privacy-policy" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
                <span className={`transition-all duration-300 font-medium whitespace-nowrap ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Privacy Policy</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>

              <Link href="/terms-and-conditions" className="relative group text-white hover:text-cyan-400 transition-colors drop-shadow-lg">
                <span className={`transition-all duration-300 font-medium whitespace-nowrap ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Terms & Conditions</span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>

            {/* Mobile/Tablet menu button */}
            <button
              className="lg:hidden text-white hover:text-cyan-400 transition-colors relative z-10 drop-shadow-lg p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className={`transition-all duration-300 ${scrollY > 50 ? 'h-5 w-5' : 'h-6 w-6'}`} />
              ) : (
                <Bars3Icon className={`transition-all duration-300 ${scrollY > 50 ? 'h-5 w-5' : 'h-6 w-6'}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile/Tablet Menu */}
      <div className={`lg:hidden fixed top-[64px] left-0 right-0 bottom-0 bg-black/95 backdrop-blur-xl transition-all duration-300 ease-out z-40 ${isMobileMenuOpen
        ? 'opacity-100 visible translate-y-0'
        : 'opacity-0 invisible -translate-y-4'
        }`}>
        <nav className="h-full overflow-y-auto px-4 py-6 space-y-4 relative z-10">
          
          {/* Mobile Search */}
          <div className={`transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`} style={{ transitionDelay: '100ms' }}>
            <div className="relative mb-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyan-400" />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-cyan-400/30 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Mobile Categorized Items */}
          <div className={`space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto custom-scrollbar transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            style={{ transitionDelay: '200ms' }}
          >
            <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar {
                width: 4px;
              }
              .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(0, 0, 0, 0.3);
              }
              .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(34, 211, 238, 0.3);
                border-radius: 10px;
              }
            `}</style>

            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg p-3 border border-cyan-400/10">
                <div className="flex items-center gap-2 text-cyan-300 text-sm font-semibold uppercase tracking-wide px-2 mb-2">
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.title}</span>
                  <span className="ml-auto text-[10px] text-cyan-400/60">({category.items.length})</span>
                </div>
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.path}
                      className={`block pl-4 pr-2 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                        item.status === 'temporarily-closed'
                          ? 'text-gray-400 cursor-not-allowed opacity-75'
                          : 'text-white hover:text-cyan-400 hover:bg-cyan-500/10'
                      }`}
                      onClick={(e) => {
                        if (item.status === 'temporarily-closed') {
                          e.preventDefault();
                          return;
                        }
                        setIsMobileMenuOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                            item.status === 'live' ? 'bg-cyan-400' : 'bg-red-400'
                          }`} />
                          <span className="truncate">{item.name}</span>
                        </div>
                        <StatusBadge status={item.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <div className="text-center py-8">
                <div className="text-cyan-400/30 text-4xl mb-3">🔍</div>
                <p className="text-gray-400 text-sm">
                  No tools found matching <span className="text-cyan-400">&quot;{searchQuery}&quot;</span>
                </p>
              </div>
            )}
          </div>

          {/* Mobile Additional Links */}
          <div className="pt-4 border-t border-cyan-400/20 space-y-2">
            <Link 
              href="/about" 
              className={`block px-2 py-2.5 text-white hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 font-medium ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: '250ms' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact-us" 
              className={`block px-2 py-2.5 text-white hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 font-medium ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: '300ms' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
            <Link 
              href="/privacy-policy" 
              className={`block px-2 py-2.5 text-white hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 font-medium ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: '350ms' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms-and-conditions" 
              className={`block px-2 py-2.5 text-white hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all duration-300 font-medium ${isMobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
              style={{ transitionDelay: '400ms' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Terms & Conditions
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
