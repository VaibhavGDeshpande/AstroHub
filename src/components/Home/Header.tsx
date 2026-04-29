// components/Header.tsx
'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { ChevronDownIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { shouldPrefetchRoute } from '@/lib/routePrefetch';
import SpaceLogo from './SpaceLogo';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset;
      setScrollY(currentScrollY);

      if (Math.abs(currentScrollY - lastScrollYRef.current) > 10) {
        if (currentScrollY > lastScrollYRef.current && currentScrollY > 100) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
        lastScrollYRef.current = currentScrollY > 0 ? currentScrollY : 0;
      }
    };

    window.addEventListener("scroll", updateScrollDirection, { passive: true });
    return () => window.removeEventListener("scroll", updateScrollDirection);
  }, []);

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
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleOpen = () => setIsDropdownOpen(true);
    const handleClose = () => setIsDropdownOpen(false);
    
    const handleMobileOpen = () => setIsMobileMenuOpen(true);
    const handleMobileClose = () => setIsMobileMenuOpen(false);
    
    window.addEventListener('openExploreMenu', handleOpen);
    window.addEventListener('closeExploreMenu', handleClose);
    window.addEventListener('openMobileMenu', handleMobileOpen);
    window.addEventListener('closeMobileMenu', handleMobileClose);
    
    return () => {
      window.removeEventListener('openExploreMenu', handleOpen);
      window.removeEventListener('closeExploreMenu', handleClose);
      window.removeEventListener('openMobileMenu', handleMobileOpen);
      window.removeEventListener('closeMobileMenu', handleMobileClose);
    };
  }, []);

  type ExploreItem = {
    name: string;
    path: string;
  };

  type ExploreCategory = {
    id: string;
    title: string;
    items: ExploreItem[];
  };

  const exploreCategories: ExploreCategory[] = [
    {
      id: 'nasa-data',
      title: 'NASA Data',
      items: [
        { name: 'Near Earth Objects', path: '/neo' },
        { name: 'EPIC Earth Images', path: '/epic' },
        { name: 'NASA Image Library', path: '/images' },
        { name: 'NASA Eyes', path: '/nasa-eyes' },
        { name: 'Astronomy Picture of the Day', path: '/apod' }
      ]
    },
    {
      id: '3d-models',
      title: '3D Models',
      items: [
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
        { name: 'Sky Charts', path: '/sky-charts' },
        { name: 'Satellite Tracker', path: '/satellite-tracker' },
        { name: 'Messier Catalog', path: '/messier' }
      ]
    },
    {
      id: 'advanced-tools',
      title: 'Advanced Tools',
      items: [
        { name: 'Telescope Calculator', path: '/telescope-calculator' },
        { name: 'Astrophotography Exposure Calculator', path: '/exposure-calculator' },
        { name: 'Cosmic Age Calculator', path: '/cosmic-age' }
      ]
    },
    {
      id: 'news',
      title: 'News & Media',
      items: [
        { name: 'Space News & Updates', path: '/space-news' },
        { name: 'AstroHub Transmission', path: '/blogs' },
        { name: 'Space Quiz', path: '/space-quiz' },
        { name: 'Space Wallpapers', path: '/wallpapers' }
      ]
    },
    {
      id: 'earth-tools',
      title: 'Earth Tools',
      items: [
        { name: 'Light Pollution Map', path: '/light-pollution' },
        { name: 'Weather Dashboard', path: '/weather' }
      ]
    }
  ];

  const filteredCategories = exploreCategories.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const getHeaderClasses = () => {
    const transformClass = isHidden ? '-translate-y-full' : 'translate-y-0';
    const heightClass = scrollY > 50 ? 'h-14' : 'h-16';
    return `${transformClass} ${heightClass}`;
  };

  const pathname = usePathname();
  const HIDE_HEADER_ROUTES = ['/3d-earth', '/3d-moon', '/3d-mars', '/stellarium', '/nasa-eyes'];

  if (HIDE_HEADER_ROUTES.includes(pathname)) {
    return null;
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-500 ${getHeaderClasses()}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-between transition-all duration-500 ${scrollY > 50 ? 'h-14' : 'h-16'}`}>
            <Link
              href="/"
              prefetch={shouldPrefetchRoute('/')}
              className="hover:scale-105 transition-transform duration-300 relative z-10"
            >
              <SpaceLogo scrollY={scrollY} />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8 relative z-10">
              {/* Explore Dropdown */}
              <div
                ref={dropdownRef}
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => {
                  setIsDropdownOpen(false);
                  setSearchQuery('');
                }}
              >
                <button className="flex items-center space-x-1 text-white hover:text-cyan-400 transition-colors group">
                  <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Explore</span>
                  <ChevronDownIcon className={`transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${scrollY > 50 ? 'h-3 w-3' : 'h-4 w-4'}`} />
                </button>

                {/* Dropdown Menu */}
                <div id="explore-header" className={`absolute right-0 pt-2 w-[95vw] max-w-[900px] z-50 transition-all duration-300 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                  }`}>
                  <div className="bg-black/95 backdrop-blur-xl rounded-xl shadow-2xl border border-cyan-400/20 overflow-hidden">

                    {/* Menu Items */}
                    <div className="p-5 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {filteredCategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {filteredCategories.map((category) => (
                            <div key={category.id} className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg p-4 border border-cyan-400/10 hover:border-cyan-400/30 transition-colors">
                              <div className="mb-3 pb-2 border-b border-cyan-400/20">
                                <h3 className="text-cyan-400 font-semibold text-sm uppercase">
                                  {category.title}
                                </h3>
                                <div className="text-xs text-cyan-400/60 mt-1">
                                  {category.items.length} {category.items.length === 1 ? 'tool' : 'tools'}
                                </div>
                              </div>

                              <div className="space-y-1">
                                {category.items.map((item, itemIndex) => (
                                  <Link
                                    key={itemIndex}
                                    href={item.path}
                                    prefetch={shouldPrefetchRoute(item.path)}
                                    className="block px-3 py-2 text-xs text-white rounded-lg hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-cyan-100 transition-all"
                                    onClick={() => {
                                      setIsDropdownOpen(false);
                                      setSearchQuery('');
                                    }}
                                  >
                                    {item.name}
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

                    {/* Footer */}
                    <div className="px-5 py-3 border-t border-cyan-400/20 bg-black/50">
                      <div className="text-xs text-cyan-400/60">
                        Total: {exploreCategories.reduce((acc, cat) => acc + cat.items.length, 0)} tools available
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/about" className="relative group text-white hover:text-cyan-400 transition-colors">
                <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>About</span>
              </Link>

              <Link href="/blogs" className="relative group text-white hover:text-cyan-400 transition-colors">
                <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Blogs</span>
              </Link>

              <Link href="/resources" className="relative group text-white hover:text-cyan-400 transition-colors">
                <span className={`transition-all duration-300 font-medium ${scrollY > 50 ? 'text-sm' : 'text-base'}`}>Resources</span>
              </Link>


            </nav>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white hover:text-cyan-400 transition-colors relative z-10 p-2"
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

      {/* Mobile Menu */}
      <div id="tour-explore-mobile-menu" className={`lg:hidden fixed top-[64px] left-0 right-0 bottom-0 bg-black/95 backdrop-blur-xl transition-all duration-300 z-40 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
        <nav className="h-full overflow-y-auto px-4 py-6 space-y-4 relative z-10">

          {/* Mobile Items */}
          <div className="space-y-4 max-h-[calc(100vh-240px)] overflow-y-auto">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg p-3 border border-cyan-400/10">
                <div className="text-cyan-300 text-sm font-semibold uppercase px-2 mb-2">
                  {category.title} ({category.items.length})
                </div>
                <div className="space-y-1">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      href={item.path}
                      prefetch={shouldPrefetchRoute(item.path)}
                      className="block pl-4 pr-2 py-2.5 text-sm text-white rounded-lg hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      {item.name}
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
            <Link href="/about" prefetch={shouldPrefetchRoute('/about')} className="block px-2 py-2.5 text-white hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="/blogs" prefetch={shouldPrefetchRoute('/blogs')} className="block px-2 py-2.5 text-white hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Blogs
            </Link>
            <Link href="/resources" prefetch={shouldPrefetchRoute('/resources')} className="block px-2 py-2.5 text-white hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-all font-medium" onClick={() => setIsMobileMenuOpen(false)}>
              Resources
            </Link>

          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
