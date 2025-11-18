'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

// Import types dynamically to match your usage
type LeafletType = typeof import('leaflet');
type LeafletMap = import('leaflet').Map;
type LeafletCircleMarker = import('leaflet').CircleMarker;
type LeafletLayerGroup = import('leaflet').LayerGroup;
type LeafletLatLng = import('leaflet').LatLng;
type LeafletLayer = import('leaflet').Layer;

// Define interface for the Terminator layer since it lacks official types
interface TerminatorLayer extends LeafletLayer {
  setTime(date?: number): void;
}

// Define the factory function type for the terminator
type TerminatorFactory = (options?: Record<string, unknown>) => TerminatorLayer;

// Interface to handle the private _leaflet_id property on DOM elements
interface LeafletContainer extends HTMLElement {
  _leaflet_id?: unknown;
}

interface SatelliteMapProps {
  noradId: number;
  satelliteName: string;
}

interface SatellitePosition {
  satlatitude: number;
  satlongitude: number;
  sataltitude: number;
  satvelocity?: number;
  timestamp: number;
}

export default function SatelliteMap({ noradId, satelliteName }: SatelliteMapProps) {
  const [leaflet, setLeaflet] = useState<LeafletType | null>(null);
  const [terminatorFn, setTerminatorFn] = useState<TerminatorFactory | null>(null);
  
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletCircleMarker | null>(null);
  const orbitPathRef = useRef<LeafletLayerGroup | null>(null);
  const terminatorRef = useRef<TerminatorLayer | null>(null);
  const terminatorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFitOrbitRef = useRef(false);
  
  const [mapReady, setMapReady] = useState(false);
  const [positions, setPositions] = useState<SatellitePosition[]>([]);
  const [observer, setObserver] = useState({ lat: 0, lng: 0, alt: 0.2 });
  
  // Removed unused 'setShowTerminator'
  const [showTerminator] = useState(true); 
  const [isLoading, setIsLoading] = useState(true);

  // Load Leaflet and Terminator
  useEffect(() => {
    let isMounted = true;
    const loadLeaflet = async () => {
      const leafletModuleImport = await import('leaflet');
      const terminatorModule = await import('@joergdietrich/leaflet.terminator');
      
      if (!isMounted) return;
      
      const leafletModule = leafletModuleImport.default ?? leafletModuleImport;
      
      // Type-safe fix for the Leaflet Icon issue
      const iconPrototype = leafletModule.Icon.Default.prototype as { _getIconUrl?: string };
      delete iconPrototype._getIconUrl;

      leafletModule.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
      });
      
      setLeaflet(leafletModule);
      // Cast the module default to our factory type
      setTerminatorFn(() => (terminatorModule.default || terminatorModule) as TerminatorFactory);
    };

    if (!leaflet) {
      loadLeaflet();
    }

    return () => {
      isMounted = false;
    };
  }, [leaflet]);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined' || mapRef.current || !leaflet) return;

    const existing = leaflet.DomUtil.get('satellite-map') as LeafletContainer | null;
    
    // Type-safe check for existing leaflet instance
    if (existing && existing._leaflet_id) {
      existing._leaflet_id = undefined;
    }

    const map = leaflet.map('satellite-map', {
      worldCopyJump: true,
      zoomControl: false
    }).setView([0, 0], 3);

    // Add zoom control to bottom right
    leaflet.control.zoom({ position: 'bottomright' }).addTo(map);

    const darkMatterLayer = leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CartoDB',
      maxZoom: 19
    });

    const streetLayer = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    });

    const satelliteLayer = leaflet.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© Esri',
        maxZoom: 19
      }
    );

    darkMatterLayer.addTo(map);

    leaflet
      .control
      .layers(
        {
          'Dark Mode': darkMatterLayer,
          'Street Map': streetLayer,
          'Satellite View': satelliteLayer
        },
        undefined,
        { position: 'topright' }
      )
      .addTo(map);

    mapRef.current = map;
    setMapReady(true);

    return () => {
      setMapReady(false);
      if (terminatorIntervalRef.current) {
        clearInterval(terminatorIntervalRef.current);
        terminatorIntervalRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [leaflet]);

  // Add/Update Terminator Layer
  useEffect(() => {
    if (!mapRef.current || !mapReady || !leaflet || !terminatorFn) return;

    if (terminatorRef.current) {
      terminatorRef.current.remove();
      terminatorRef.current = null;
    }

    if (terminatorIntervalRef.current) {
      clearInterval(terminatorIntervalRef.current);
      terminatorIntervalRef.current = null;
    }

    if (!showTerminator) return;

    const terminator = terminatorFn({
      resolution: 3,
      fillColor: '#001a33',
      fillOpacity: 0.45,
      weight: 2,
      opacity: 0.8,
      color: '#4a90e2',
      interactive: false
    });

    terminator.addTo(mapRef.current);
    terminatorRef.current = terminator;

    terminatorIntervalRef.current = setInterval(() => {
      if (terminatorRef.current) {
        terminatorRef.current.setTime();
      }
    }, 60000);

    return () => {
      if (terminatorIntervalRef.current) {
        clearInterval(terminatorIntervalRef.current);
        terminatorIntervalRef.current = null;
      }
      if (terminatorRef.current) {
        terminatorRef.current.remove();
        terminatorRef.current = null;
      }
    };
  }, [leaflet, terminatorFn, mapReady, showTerminator]);

  // Get user location
  useEffect(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setObserver({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          alt: position.coords.altitude || 0.2
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, []);

  // Fetch satellite positions from API
  useEffect(() => {
    let isCancelled = false;

    const fetchPositions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          noradId: String(noradId),
          lat: observer.lat.toString(),
          lng: observer.lng.toString(),
          alt: observer.alt.toString(),
          seconds: '3600'
        });

        const response = await fetch(`/api/satellite/positions?${params.toString()}`, { cache: 'no-store' });
        const data = await response.json();

        if (!isCancelled && Array.isArray(data.positions)) {
          setPositions(data.positions as SatellitePosition[]);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error fetching positions:', error);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchPositions();
    const intervalId = setInterval(fetchPositions, 60 * 1000);

    return () => {
      isCancelled = true;
      clearInterval(intervalId);
    };
  }, [noradId, observer.alt, observer.lat, observer.lng]);

  // Update satellite marker
  useEffect(() => {
    if (!mapRef.current || positions.length === 0 || !leaflet) return;

    const latest = positions[0];
    if (markerRef.current) {
      markerRef.current.setLatLng([latest.satlatitude, latest.satlongitude]).bringToFront();
    } else {
      markerRef.current = leaflet.circleMarker([latest.satlatitude, latest.satlongitude], {
        radius: 8,
        color: '#f59e0b',
        weight: 3,
        opacity: 1,
        fillColor: '#fbbf24',
        fillOpacity: 1
      })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 4px;">
            <strong style="font-size: 14px; color: #1e293b;">${satelliteName}</strong><br/>
            <div style="margin-top: 6px; font-size: 12px; color: #475569;">
              <strong>NORAD ID:</strong> ${noradId}<br/>
              <strong>Latitude:</strong> ${latest.satlatitude.toFixed(4)}°<br/>
              <strong>Longitude:</strong> ${latest.satlongitude.toFixed(4)}°<br/>
              <strong>Altitude:</strong> ${latest.sataltitude.toFixed(2)} km
              ${latest.satvelocity ? `<br/><strong>Velocity:</strong> ${latest.satvelocity.toFixed(2)} km/s` : ''}
            </div>
          </div>
        `);
    }

    markerRef.current.setPopupContent(`
      <div style="font-family: system-ui; padding: 4px;">
        <strong style="font-size: 14px; color: #1e293b;">${satelliteName}</strong><br/>
        <div style="margin-top: 6px; font-size: 12px; color: #475569;">
          <strong>NORAD ID:</strong> ${noradId}<br/>
          <strong>Latitude:</strong> ${latest.satlatitude.toFixed(4)}°<br/>
          <strong>Longitude:</strong> ${latest.satlongitude.toFixed(4)}°<br/>
          <strong>Altitude:</strong> ${latest.sataltitude.toFixed(2)} km
          ${latest.satvelocity ? `<br/><strong>Velocity:</strong> ${latest.satvelocity.toFixed(2)} km/s` : ''}
        </div>
      </div>
    `);
  }, [leaflet, noradId, positions, satelliteName]);

  // Draw orbit path
  useEffect(() => {
    if (!mapRef.current || !mapReady || positions.length < 2 || !leaflet) return;

    if (orbitPathRef.current) {
      orbitPathRef.current.remove();
      orbitPathRef.current = null;
    }

    const points = positions.map((pos) => leaflet.latLng(pos.satlatitude, pos.satlongitude));
    const segments: LeafletLatLng[][] = [];
    let currentSegment: LeafletLatLng[] = [];

    points.forEach((point) => {
      if (!currentSegment.length) {
        currentSegment.push(point);
        return;
      }

      const prevPoint = currentSegment[currentSegment.length - 1];
      const delta = Math.abs(point.lng - prevPoint.lng);

      if (delta > 180) {
        segments.push(currentSegment);
        currentSegment = [point];
      } else {
        currentSegment.push(point);
      }
    });

    if (currentSegment.length) {
      segments.push(currentSegment);
    }

    if (!segments.length) return;

    const pathLayer = leaflet.layerGroup();
    
    // Removed unused 'index' parameter
    segments.forEach((segment) => {
      if (segment.length < 2) return;

      leaflet.polyline(segment, {
        color: '#06b6d4',
        weight: 3,
        opacity: 0.9,
        dashArray: '10, 6',
        lineCap: 'round',
        smoothFactor: 1.2,
        interactive: false
      }).addTo(pathLayer);
    });

    pathLayer.addTo(mapRef.current);
    orbitPathRef.current = pathLayer;

    if (!hasFitOrbitRef.current) {
      const bounds = leaflet.latLngBounds(segments[0]);
      segments.slice(1).forEach((segment) => segment.forEach((point) => bounds.extend(point)));
      if (bounds.isValid()) {
        hasFitOrbitRef.current = true;
        mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
      }
    }
  }, [leaflet, mapReady, positions]);

  // Reset on satellite change
  useEffect(() => {
    hasFitOrbitRef.current = false;
    if (orbitPathRef.current) {
      orbitPathRef.current.remove();
      orbitPathRef.current = null;
    }
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [noradId]);

  return (
    <div className="relative w-full h-full">
      <div
        id="satellite-map"
        className="w-full h-full rounded-xl shadow-2xl"
        style={{ minHeight: '400px' }}
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-2 rounded-lg bg-slate-800/90 backdrop-blur-sm px-3 py-2 shadow-lg border border-white/10">
          <svg className="h-4 w-4 animate-spin text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-xs font-medium text-slate-200">Updating...</span>
        </div>
      )}

      {/* Enhanced Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-slate-900/95 backdrop-blur-sm px-4 py-3 shadow-xl border border-white/10">
        <div className="space-y-2.5 text-xs text-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-amber-400 ring-2 ring-amber-500"></div>
            </div>
            <span className="font-medium">Current Position</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-5 w-5 items-center justify-center">
              <div className="h-0.5 w-5 bg-cyan-400" style={{ borderTop: '2px dashed' }}></div>
            </div>
            <span className="font-medium">Predicted Orbit</span>
          </div>
          {showTerminator && (
            <div className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center">
                <div className="h-0.5 w-5 border-t-2 border-blue-400 bg-blue-500/50"></div>
              </div>
              <span className="font-medium">Day/Night Line</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}