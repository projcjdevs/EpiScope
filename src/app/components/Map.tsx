"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default function Map() {
  // NCR bounds (approximate boundaries)
  const ncrBounds = L.latLngBounds(
    L.latLng(14.35, 120.85), // Southwest corner
    L.latLng(14.85, 121.15)  // Northeast corner
  );

  return (
    <MapContainer
      center={[14.5995, 120.9842]} // Manila center
      zoom={11}
      minZoom={10}  // Prevent zooming out too far
      maxZoom={18}  // Allow detailed zoom
      maxBounds={ncrBounds}  // Restrict panning to NCR area
      maxBoundsViscosity={1.0}  // Make bounds "sticky"
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        bounds={ncrBounds}  // Only load tiles within bounds
      />
      <Marker position={[14.5995, 120.9842]}>
        <Popup>Manila, NCR</Popup>
      </Marker>
    </MapContainer>
  );
}