"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Heatmap from "./Heatmap";
import DiseaseSelector from "./DiseaseSelector";
import CityDataCard from "./CityDataCard";
import {
  generateMockHeatmapData,
  generateHotspotData,
} from "../utils/mockHeatMapData";
import { generateCityData, CityData } from "../utils/mockCityData";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Custom icon colors for different cities
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s ease;
      ">
        <i class="fas fa-map-pin" style="font-size: 12px;"></i>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// City icons
const cityIcons = {
  manila: createCustomIcon("#e74c3c"),
  quezon: createCustomIcon("#3498db"),
  caloocan: createCustomIcon("#2ecc71"),
  las_pinas: createCustomIcon("#f39c12"),
  makati: createCustomIcon("#9b59b6"),
  malabon: createCustomIcon("#1abc9c"),
  mandaluyong: createCustomIcon("#e67e22"),
  marikina: createCustomIcon("#34495e"),
  muntinlupa: createCustomIcon("#f1c40f"),
  navotas: createCustomIcon("#95a5a6"),
  paranaque: createCustomIcon("#e91e63"),
  pasay: createCustomIcon("#795548"),
  pasig: createCustomIcon("#607d8b"),
  pateros: createCustomIcon("#ff5722"),
  san_juan: createCustomIcon("#8bc34a"),
  taguig: createCustomIcon("#673ab7"),
  valenzuela: createCustomIcon("#009688"),
};

// Map Controller Component to handle zoom animations
function MapController({
  targetCoords,
  shouldZoom,
  onZoomComplete,
}: {
  targetCoords: [number, number] | null;
  shouldZoom: boolean;
  onZoomComplete: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (shouldZoom && targetCoords) {
      // Smooth zoom and pan animation with higher zoom level for city detail
      map.flyTo(targetCoords, 15, {
        duration: 1.5,
        easeLinearity: 0.25,
      });

      // Call completion callback after animation
      const timer = setTimeout(() => {
        onZoomComplete();
      }, 1600);

      return () => clearTimeout(timer);
    }
  }, [map, targetCoords, shouldZoom, onZoomComplete]);

  return null;
}

// Floating City Data Card Component with Charts Panel
function FloatingCityCard({
  cityData,
  isVisible,
  onClose,
}: {
  cityData: CityData | null;
  isVisible: boolean;
  onClose: () => void;
}) {
  const [selectedDisease, setSelectedDisease] = useState("Dengue");
  const [timeFrame, setTimeFrame] = useState("6months");

  if (!isVisible || !cityData) return null;

  const diseaseData = cityData.diseases[selectedDisease];
  const availableDiseases = Object.keys(cityData.diseases);

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop with radial blur effect */}
      <div
        className="fixed inset-0 z-[1999]"
        onClick={handleBackdropClick}
        style={{
          background: `radial-gradient(circle at 50% 50%, transparent 300px, rgba(0,0,0,0.3) 500px)`,
          backdropFilter: "blur(0px)",
        }}
      />

      {/* Left Data Card */}
      <div
        className={`fixed top-6 left-6 w-96 bg-white/98 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl z-[2000] transform transition-all duration-500 ease-in-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-10 opacity-0 scale-95"
        }`}
      >
        {/* Enhanced Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white p-6 rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold mb-1">{cityData.cityName}</h2>
              <div className="flex items-center gap-2 text-blue-100 text-sm mb-1">
                <i className="fas fa-users"></i>
                <span>Population: {cityData.population}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100 text-xs">
                <i className="fas fa-map-marker-alt"></i>
                <span>
                  {cityData.coordinates[0].toFixed(4)},{" "}
                  {cityData.coordinates[1].toFixed(4)}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-xl p-2 transition-all duration-200 hover:scale-110"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {/* Enhanced Controls */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-virus mr-2 text-red-500"></i>Disease
              </label>
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              >
                {availableDiseases.map((disease) => (
                  <option key={disease} value={disease}>
                    {disease}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <i className="fas fa-calendar-alt mr-2 text-blue-500"></i>Time
                Frame
              </label>
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
              </select>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-blue-700">
                    {diseaseData.totalCases.toLocaleString()}
                  </div>
                  <div className="text-xs text-blue-600 font-medium">
                    Total Cases
                  </div>
                </div>
                <i className="fas fa-chart-line text-blue-400 text-xl"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-2xl border border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-700">
                    {diseaseData.deaths.toLocaleString()}
                  </div>
                  <div className="text-xs text-red-600 font-medium">Deaths</div>
                </div>
                <i className="fas fa-heart-broken text-red-400 text-xl"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-700">
                    {diseaseData.recovered.toLocaleString()}
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Recovered
                  </div>
                </div>
                <i className="fas fa-check-circle text-green-400 text-xl"></i>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-2xl border border-yellow-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-yellow-700">
                    {diseaseData.active.toLocaleString()}
                  </div>
                  <div className="text-xs text-yellow-600 font-medium">
                    Active Cases
                  </div>
                </div>
                <i className="fas fa-exclamation-triangle text-yellow-400 text-xl"></i>
              </div>
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm flex items-center">
                    <i className="fas fa-skull mr-2 text-red-500"></i>Mortality
                    Rate
                  </h4>
                  <div className="text-2xl font-bold text-red-600">
                    {(
                      (diseaseData.deaths / diseaseData.totalCases) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1 text-sm flex items-center">
                    <i className="fas fa-heart mr-2 text-green-500"></i>Recovery
                    Rate
                  </h4>
                  <div className="text-2xl font-bold text-green-600">
                    {(
                      (diseaseData.recovered / diseaseData.totalCases) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Recent Trend */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-2xl border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2 text-sm flex items-center">
                <i className="fas fa-trending-up mr-2 text-indigo-500"></i>
                Recent Trend
              </h4>
              <div className="space-y-1">
                <div className="text-sm text-indigo-700">
                  Last month:{" "}
                  <span className="font-semibold">
                    {diseaseData.monthlyData[diseaseData.monthlyData.length - 1]
                      ?.cases || 0}
                  </span>{" "}
                  cases
                </div>
                <div className="text-sm text-indigo-600">
                  Trend:{" "}
                  <span className="font-semibold">
                    {diseaseData.monthlyData[diseaseData.monthlyData.length - 1]
                      ?.cases >
                    diseaseData.monthlyData[diseaseData.monthlyData.length - 2]
                      ?.cases
                      ? "📈 Increasing"
                      : "📉 Decreasing"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Charts Panel */}
      <div
        className={`fixed top-6 right-6 w-[480px] bg-white/98 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl z-[2000] transform transition-all duration-500 ease-in-out ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-10 opacity-0 scale-95"
        }`}
      >
        <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-slate-800 text-white p-6 rounded-t-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
          <div className="relative">
            <h3 className="text-xl font-bold mb-1 flex items-center">
              <i className="fas fa-chart-bar mr-3 text-yellow-400"></i>
              Charts & Analytics
            </h3>
            <p className="text-gray-300 text-sm">
              {selectedDisease} data visualization for {cityData.cityName}
            </p>
          </div>
        </div>

        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Enhanced Chart Placeholders */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200 h-64 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-chart-line text-6xl text-blue-400 mb-4"></i>
                <p className="text-blue-700 text-lg font-semibold">
                  Trend Analysis
                </p>
                <p className="text-blue-600 text-sm">
                  {selectedDisease} cases progression over time
                </p>
                <div className="mt-3 px-4 py-2 bg-blue-200 rounded-full text-xs text-blue-800 inline-block">
                  Interactive Chart Coming Soon
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl border border-green-200 h-64 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-chart-pie text-6xl text-green-400 mb-4"></i>
                <p className="text-green-700 text-lg font-semibold">
                  Status Distribution
                </p>
                <p className="text-green-600 text-sm">
                  Cases breakdown by recovery status
                </p>
                <div className="mt-3 px-4 py-2 bg-green-200 rounded-full text-xs text-green-800 inline-block">
                  Interactive Chart Coming Soon
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl border border-purple-200 h-64 flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-chart-area text-6xl text-purple-400 mb-4"></i>
                <p className="text-purple-700 text-lg font-semibold">
                  Heatmap Analysis
                </p>
                <p className="text-purple-600 text-sm">
                  Geographic distribution patterns
                </p>
                <div className="mt-3 px-4 py-2 bg-purple-200 rounded-full text-xs text-purple-800 inline-block">
                  Interactive Chart Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

interface MapProps {
  showHeatmapSelector?: boolean;
}

export default function Map({ showHeatmapSelector = false }: MapProps) {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);
  const [mockData, setMockData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [selectedCityData, setSelectedCityData] = useState<CityData | null>(
    null
  );
  const [showCityCard, setShowCityCard] = useState(false);

  // Animation states
  const [zoomTarget, setZoomTarget] = useState<[number, number] | null>(null);
  const [shouldZoom, setShouldZoom] = useState(false);
  const [selectedCityName, setSelectedCityName] = useState<string>("");

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

    const diseaseData = generateHotspotData(selectedDisease);
    setHeatmapData(diseaseData);
  }, [selectedDisease]);

  // NCR Cities
  const ncrCities = [
    {
      name: "Manila",
      coordinates: [14.5995, 120.9842],
      icon: cityIcons.manila,
      population: "1.78M",
    },
    {
      name: "Quezon City",
      coordinates: [14.676, 121.0437],
      icon: cityIcons.quezon,
      population: "2.96M",
    },
    {
      name: "Caloocan",
      coordinates: [14.6507, 120.9676],
      icon: cityIcons.caloocan,
      population: "1.66M",
    },
    {
      name: "Las Piñas",
      coordinates: [14.4378, 120.983],
      icon: cityIcons.las_pinas,
      population: "606K",
    },
    {
      name: "Makati",
      coordinates: [14.5547, 121.0244],
      icon: cityIcons.makati,
      population: "629K",
    },
    {
      name: "Malabon",
      coordinates: [14.662, 120.957],
      icon: cityIcons.malabon,
      population: "380K",
    },
    {
      name: "Mandaluyong",
      coordinates: [14.5832, 121.0409],
      icon: cityIcons.mandaluyong,
      population: "425K",
    },
    {
      name: "Marikina",
      coordinates: [14.6507, 121.1029],
      icon: cityIcons.marikina,
      population: "450K",
    },
    {
      name: "Muntinlupa",
      coordinates: [14.3832, 121.0409],
      icon: cityIcons.muntinlupa,
      population: "543K",
    },
    {
      name: "Navotas",
      coordinates: [14.6691, 120.9467],
      icon: cityIcons.navotas,
      population: "249K",
    },
    {
      name: "Parañaque",
      coordinates: [14.4793, 121.0198],
      icon: cityIcons.paranaque,
      population: "689K",
    },
    {
      name: "Pasay",
      coordinates: [14.5378, 120.9896],
      icon: cityIcons.pasay,
      population: "440K",
    },
    {
      name: "Pasig",
      coordinates: [14.5764, 121.0851],
      icon: cityIcons.pasig,
      population: "803K",
    },
    {
      name: "Pateros",
      coordinates: [14.5445, 121.0681],
      icon: cityIcons.pateros,
      population: "65K",
    },
    {
      name: "San Juan",
      coordinates: [14.6019, 121.0355],
      icon: cityIcons.san_juan,
      population: "126K",
    },
    {
      name: "Taguig",
      coordinates: [14.5176, 121.0509],
      icon: cityIcons.taguig,
      population: "886K",
    },
    {
      name: "Valenzuela",
      coordinates: [14.7, 120.9833],
      icon: cityIcons.valenzuela,
      population: "714K",
    },
  ];

  const diseases = ["Dengue", "COVID-19", "Tuberculosis", "Malaria", "Typhoid"];

  // Handle city click - show floating card and zoom
  const handleCityClick = (city: any) => {
    // Generate city data and show card - include population in the data
    const cityData = generateCityData(
      city.name,
      city.population,
      city.coordinates
    );
    setSelectedCityData(cityData);
    setShowCityCard(true);

    // Start zoom animation with higher zoom level
    setZoomTarget(city.coordinates as [number, number]);
    setShouldZoom(true);
    setSelectedCityName(city.name);
  };

  // Handle zoom animation completion
  const handleZoomComplete = () => {
    setShouldZoom(false);
    setZoomTarget(null);
  };

  // Handle closing city data card
  const handleCloseCityCard = () => {
    setShowCityCard(false);
    setSelectedCityData(null);
    setSelectedCityName("");
  };

  return (
    <div className="relative">
      {/* Global styles for compact popup */}
      <style jsx global>{`
        .compact-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          padding: 0;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .compact-popup .leaflet-popup-content {
          margin: 12px 16px;
          line-height: 1.4;
          min-width: 250px;
        }
        .compact-popup .leaflet-popup-tip {
          background: white;
        }
        .custom-div-icon:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5) !important;
        }
      `}</style>

      <MapContainer
        center={[14.5995, 120.9842]}
        zoom={11}
        minZoom={12.2}
        maxZoom={17}
        maxBounds={ncrBounds}
        maxBoundsViscosity={1.0}
        zoomControl={false}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        style={{ height: "100vh", width: "100%" }}
      >
        {/* Map Controller for animations */}
        <MapController
          targetCoords={zoomTarget}
          shouldZoom={shouldZoom}
          onZoomComplete={handleZoomComplete}
        />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
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
                0.0: "#0000ff",
                0.2: "#00ffff",
                0.4: "#00ff00",
                0.6: "#ffff00",
                0.8: "#ff8000",
                1.0: "#ff0000",
              },
            }}
          />
        )}

        {/* City markers */}
        {ncrCities.map((city, index) => (
          <Marker
            key={index}
            position={city.coordinates as [number, number]}
            icon={city.icon}
            eventHandlers={{
              click: () => handleCityClick(city),
            }}
          >
            <Popup
              closeOnClick={true}
              autoClose={true}
              className="compact-popup"
            >
              <div className="flex items-center gap-3 text-sm min-w-0 py-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full border border-white"
                    style={{
                      backgroundColor:
                        city.name === "Manila"
                          ? "#e74c3c"
                          : city.name === "Quezon City"
                          ? "#3498db"
                          : city.name === "Makati"
                          ? "#9b59b6"
                          : "#666",
                    }}
                  ></div>
                  <div className="font-semibold text-gray-800">{city.name}</div>
                </div>
                <div className="text-gray-400">•</div>
                <div className="text-gray-600 flex items-center gap-1">
                  <i className="fas fa-users text-xs"></i>
                  <span>{city.population}</span>
                </div>
                <div className="text-gray-400">•</div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleCityClick(city);
                  }}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-xs hover:from-blue-600 hover:to-blue-700 transition-all duration-200 whitespace-nowrap font-medium shadow-sm"
                >
                  <i className="fas fa-chart-bar mr-1"></i>
                  View Details
                </button>
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

      {/* Floating City Data Card */}
      <FloatingCityCard
        cityData={selectedCityData}
        isVisible={showCityCard}
        onClose={handleCloseCityCard}
      />

      {/* Zoom indicator */}
      {shouldZoom && (
        <div className="fixed top-6 right-6 z-[1500] bg-blue-500/90 backdrop-blur-lg text-white px-4 py-2 rounded-xl shadow-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="text-sm">Focusing on {selectedCityName}...</span>
          </div>
        </div>
      )}
    </div>
  );
}
