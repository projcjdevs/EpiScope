"use client";

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Heatmap from './Heatmap';
import DiseaseSelector from './DiseaseSelector';
import { generateMockHeatmapData, generateHotspotData } from '../utils/mockHeatMapData';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Custom icon colors for different cities
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      ">
        <i class="fas fa-map-pin" style="font-size: 10px;"></i>
      </div>
    `,
    iconSize: [25, 25],
    iconAnchor: [12, 12],
  });
};

// City icons
const cityIcons = {
  manila: createCustomIcon('#e74c3c'),
  quezon: createCustomIcon('#3498db'),
  caloocan: createCustomIcon('#2ecc71'),
  las_pinas: createCustomIcon('#f39c12'),
  makati: createCustomIcon('#9b59b6'),
  malabon: createCustomIcon('#1abc9c'),
  mandaluyong: createCustomIcon('#e67e22'),
  marikina: createCustomIcon('#34495e'),
  muntinlupa: createCustomIcon('#f1c40f'),
  navotas: createCustomIcon('#95a5a6'),
  paranaque: createCustomIcon('#e91e63'),
  pasay: createCustomIcon('#795548'),
  pasig: createCustomIcon('#607d8b'),
  pateros: createCustomIcon('#ff5722'),
  san_juan: createCustomIcon('#8bc34a'),
  taguig: createCustomIcon('#673ab7'),
  valenzuela: createCustomIcon('#009688'),
};

interface MapProps {
  showHeatmapSelector?: boolean;
}

export default function Map({ showHeatmapSelector = false }: MapProps) {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [mockData, setMockData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);

  // NCR bounds
  const ncrBounds = L.latLngBounds(
    L.latLng(14.0, 120.5),
    L.latLng(15.2, 121.5)
  );

  // Generate mock data on component mount
  useEffect(() => {
    const data = generateMockHeatmapData();
    setMockData(data);
  }, []);

  // Update heatmap data when disease changes
  useEffect(() => {
    if (!selectedDisease) {
      setHeatmapData([]);
      return;
    }

    // Use hotspot data for more realistic clustering
    const diseaseData = generateHotspotData(selectedDisease);
    setHeatmapData(diseaseData);
  }, [selectedDisease]);

  // NCR Cities
  const ncrCities = [
    { name: "Manila", coordinates: [14.5995, 120.9842], icon: cityIcons.manila, population: "1.78M" },
    { name: "Quezon City", coordinates: [14.6760, 121.0437], icon: cityIcons.quezon, population: "2.96M" },
    { name: "Caloocan", coordinates: [14.6507, 120.9676], icon: cityIcons.caloocan, population: "1.66M" },
    { name: "Las Piñas", coordinates: [14.4378, 120.9830], icon: cityIcons.las_pinas, population: "606K" },
    { name: "Makati", coordinates: [14.5547, 121.0244], icon: cityIcons.makati, population: "629K" },
    { name: "Malabon", coordinates: [14.6620, 120.9570], icon: cityIcons.malabon, population: "380K" },
    { name: "Mandaluyong", coordinates: [14.5832, 121.0409], icon: cityIcons.mandaluyong, population: "425K" },
    { name: "Marikina", coordinates: [14.6507, 121.1029], icon: cityIcons.marikina, population: "450K" },
    { name: "Muntinlupa", coordinates: [14.3832, 121.0409], icon: cityIcons.muntinlupa, population: "543K" },
    { name: "Navotas", coordinates: [14.6691, 120.9467], icon: cityIcons.navotas, population: "249K" },
    { name: "Parañaque", coordinates: [14.4793, 121.0198], icon: cityIcons.paranaque, population: "689K" },
    { name: "Pasay", coordinates: [14.5378, 120.9896], icon: cityIcons.pasay, population: "440K" },
    { name: "Pasig", coordinates: [14.5764, 121.0851], icon: cityIcons.pasig, population: "803K" },
    { name: "Pateros", coordinates: [14.5445, 121.0681], icon: cityIcons.pateros, population: "65K" },
    { name: "San Juan", coordinates: [14.6019, 121.0355], icon: cityIcons.san_juan, population: "126K" },
    { name: "Taguig", coordinates: [14.5176, 121.0509], icon: cityIcons.taguig, population: "886K" },
    { name: "Valenzuela", coordinates: [14.7000, 120.9833], icon: cityIcons.valenzuela, population: "714K" },
  ];

  const diseases = ['Dengue', 'COVID-19', 'Tuberculosis', 'Malaria', 'Typhoid'];

  return (
    <div className="relative">
      <MapContainer
        center={[14.5995, 120.9842]}
        zoom={11}
        minZoom={12.2}
        maxZoom={17}
        maxBounds={ncrBounds}
        maxBoundsViscosity={1.0}
        zoomControl={false}  // Disable zoom buttons
        doubleClickZoom={false}  // Disable double-click zoom
        scrollWheelZoom={true}  // Keep scroll wheel zoom (but still respects min/max)
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          minZoom={10}
          maxZoom={17}
        />
         
        {/* Show heatmap if disease is selected */}
        {selectedDisease && heatmapData.length > 0 && (
          <Heatmap 
            data={heatmapData}
            options={{
              radius: 20,
              blur: 15,
              maxZoom: 17,
              gradient: {
                0.0: '#0000ff',
                0.2: '#00ffff', 
                0.4: '#00ff00',
                0.6: '#ffff00',
                0.8: '#ff8000',
                1.0: '#ff0000'
              }
            }}
          />
        )}
        
        {/* City markers - hide when heatmap is active */}
        {!selectedDisease && ncrCities.map((city, index) => (
          <Marker 
            key={index}
            position={city.coordinates as [number, number]}
            icon={city.icon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{city.name}</h3>
                <p className="text-gray-600">Population: {city.population}</p>
                <p className="text-sm text-gray-500">NCR, Philippines</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Disease selector */}
      <DiseaseSelector
        selectedDisease={selectedDisease}
        onDiseaseChange={setSelectedDisease}
        diseases={diseases}
        isVisible={showHeatmapSelector}
      />
    </div>
  );
}