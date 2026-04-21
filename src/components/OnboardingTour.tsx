'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function OnboardingTour() {
  useEffect(() => {
    // Only run on the client
    if (typeof window === 'undefined') return;

    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem('astrohub_tour_seen');
    if (hasSeenTour) return;

    // Give the floating widgets a moment to render
    const timer = setTimeout(() => {
      const isMobile = window.innerWidth < 1024;
      
      const driverObj = driver({
        showProgress: true,
        animate: true,
        popoverClass: 'driverjs-theme',
        steps: [
          {
            element: '#astronomy-widget-trigger',
            popover: {
              title: 'Astronomy Dashboard',
              description: 'Click here to access daily celestial briefings, sunrise/sunset times, and moon phases based on your location.',
              side: "left", align: 'start'
            }
          },
          {
            element: '#night-light-filter',
            popover: {
              title: 'Night Light Filter (Red)',
              description: 'When pressed the screen will adapt to the night light filter',
              side: "left", align: 'start'
            }
          },
          {
            element: '#astrobot-widget-trigger',
            popover: {
              title: 'Meet AstroBot',
              description: 'Got questions about space? Chat directly with our AI astronomy assistant!',
              side: "left", align: 'start'
            }
          },
          {
            element: isMobile ? '#tour-explore-mobile-menu' : '#explore-header',
            popover: {
              title: 'Quick Explore Menu',
              description: 'Quick Explore Menu designed to seamlessly switch between different sections of the website.',
              side: "bottom", align: 'center'
            },
            onHighlightStarted: () => {
              window.dispatchEvent(new CustomEvent(isMobile ? 'openMobileMenu' : 'openExploreMenu'));
            },
            onDeselected: () => {
              window.dispatchEvent(new CustomEvent(isMobile ? 'closeMobileMenu' : 'closeExploreMenu'));
            }
          },
          {
            element: '#tour-features-directory',
            popover: {
              title: 'Command Center',
              description: 'Explore the universe through our interactive tools, 3D solar system models, and real-time telemetry data.',
              side: "top", align: 'center'
            }
          }, 
           
        ],
        onDestroyStarted: () => {
          if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
            driverObj.destroy();
            localStorage.setItem('astrohub_tour_seen', 'true');
          }
        },
      });

      driverObj.drive();
    }, 1000); // Wait 3 seconds for widgets to pop in

    return () => clearTimeout(timer);
  }, []);

  return null;
}
