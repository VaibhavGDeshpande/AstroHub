// components/Footer.tsx
'use client'
import Link from 'next/link';
import { 
  EnvelopeIcon, 
  MapPinIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Documentation', path: '/documentation' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/terms' },
  ];

  const exploreLinks = [
    { name: 'APOD', path: '/apod' },
    { name: 'Mars Rover Photos', path: '/mars-photos' },
    { name: 'Near Earth Objects', path: '/neo' },
    { name: 'EPIC', path: '/epic' },
    { name: 'NASA Image Library', path: '/images' },
    { name: '3D View of Moon', path: '/3d-moon' },
    { name: '3D View of Mars', path: '/3d-mars' },
  ];

  const socialLinks = [
    { 
      name: 'GitHub', 
      url: 'https://github.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'Twitter', 
      url: 'https://twitter.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      name: 'Instagram', 
      url: 'https://instagram.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
        </svg>
      )
    },
  ];

  const resources = [
    { name: 'NASA API', url: 'https://api.nasa.gov' },
    { name: 'Astronomy Resources', url: '#' },
    { name: 'Community Forum', url: '#' },
    { name: 'FAQ', url: '/faq' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-black/95 to-black border-t border-cyan-400/20">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse" style={{ top: '20%', left: '10%' }} />
        <div className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{ top: '60%', left: '30%', animationDelay: '1s' }} />
        <div className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse" style={{ top: '40%', right: '20%', animationDelay: '2s' }} />
        <div className="absolute w-1 h-1 bg-blue-400/30 rounded-full animate-pulse" style={{ top: '70%', right: '40%', animationDelay: '1.5s' }} />
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block hover:scale-105 transition-transform duration-300">
              <img
                src="/assets/AstroHub.png"
                alt="AstroHub Logo"
                width={140}
                height={40}
                className="transition-all duration-300"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Explore the cosmos with AstroHub. Your gateway to NASA&apos;s astronomical data and space exploration resources.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 pt-2">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
              <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2" />
              Explore
            </h3>
            <ul className="space-y-2">
              {exploreLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                  >
                    <span className="relative">
                      {link.name}
                      <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Resources */}
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2" />
                Resources
              </h3>
              <ul className="space-y-2">
                {resources.map((resource, index) => (
                  <li key={index}>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-cyan-400 transition-all duration-300 text-sm hover:translate-x-1 inline-block group"
                    >
                      <span className="relative">
                        {resource.name}
                        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-lg flex items-center">
                <div className="w-1 h-1 bg-cyan-400 rounded-full mr-2" />
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 text-gray-400 text-sm">
                  <EnvelopeIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <a href="mailto:info@astrohub.space" className="hover:text-cyan-400 transition-colors">
                    info@astrohub.space
                  </a>
                </li>
                <li className="flex items-start space-x-3 text-gray-400 text-sm">
                  <PhoneIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <a href="tel:+1234567890" className="hover:text-cyan-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                </li>
                <li className="flex items-start space-x-3 text-gray-400 text-sm">
                  <MapPinIcon className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <span>Space Center, USA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cyan-400/20 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            © {currentYear} AstroHub. All rights reserved. Powered by NASA API.
          </div>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-cyan-400 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Attribution */}
        <div className="text-center mt-6 pt-6 border-t border-cyan-400/10">
          <p className="text-gray-500 text-xs">
            Data provided by{' '}
            <a 
              href="https://api.nasa.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              NASA Open APIs
            </a>
            {' '}• Made with ❤️ for space enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;