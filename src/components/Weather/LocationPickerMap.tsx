'use client';

import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Coordinates = { lat: number; lon: number };

interface LocationPickerMapProps {
  coordinates: Coordinates;
  onSelect: (coords: Coordinates) => void;
}

function MapClickHandler({ onSelect }: { onSelect: (coords: Coordinates) => void }) {
  useMapEvents({
    click(event) {
      onSelect({ lat: event.latlng.lat, lon: event.latlng.lng });
    }
  });
  return null;
}

function RecenterMap({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.lat, coordinates.lon]);
  }, [coordinates, map]);

  return null;
}

export default function LocationPickerMap({ coordinates, onSelect }: LocationPickerMapProps) {
  const markerIcon = useMemo(
    () =>
      L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      }),
    []
  );

  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-red-900/30">
      <MapContainer
        center={[coordinates.lat, coordinates.lon]}
        zoom={6}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <RecenterMap coordinates={coordinates} />
        <MapClickHandler onSelect={onSelect} />
        <Marker position={[coordinates.lat, coordinates.lon]} icon={markerIcon} />
      </MapContainer>
    </div>
  );
}
