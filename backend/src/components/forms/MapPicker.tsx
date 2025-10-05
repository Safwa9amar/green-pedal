"use client";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useState, useEffect } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMarker({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  const [position, setPosition] = useState<[number, number] | null>(null);
  // const map = useMap();

  // useEffect(() => {
  //   if (!navigator.geolocation) {
  //     console.error("Geolocation not supported");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     (pos) => {
  //       const { latitude, longitude } = pos.coords;
  //       const newPos: [number, number] = [latitude, longitude];
  //       setPosition(newPos);
  //       map.setView(newPos, 13); // center map on user
  //       onSelect(latitude, longitude);
  //     },
  //     (err) => {
  //       console.error("Geolocation error:", err);
  //     },
  //     { enableHighAccuracy: true }
  //   );
  // }, [map, onSelect]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={markerIcon} /> : null;
}

export default function MapPicker({
  onSelect,
}: {
  onSelect: (lat: number, lng: number) => void;
}) {
  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <MapContainer
        center={[36.75, 3.04]}
        zoom={6}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onSelect={onSelect} />
      </MapContainer>
    </div>
  );
}
