"use client";

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// Extend Leaflet types for heatLayer
declare module 'leaflet' {
  function heatLayer(
    data: [number, number, number][],
    options?: any
  ): any;
}

interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapProps {
  data: HeatmapData[];
  options?: {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    minOpacity?: number;
    gradient?: { [key: number]: string };
  };
}

export default function Heatmap({ data, options = {} }: HeatmapProps) {
  const map = useMap();

  useEffect(() => {
    // Dynamic import for leaflet.heat
    const loadHeatLayer = async () => {
      const { default: heat } = await import('leaflet.heat');
      
      if (!data || data.length === 0) return;

      // Convert data to format expected by leaflet.heat
      const heatData: [number, number, number][] = data.map(point => [
        point.lat, 
        point.lng, 
        point.intensity
      ]);

      // Default heatmap options
      const defaultOptions = {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        max: 1.0,
        minOpacity: 0.4,
        gradient: {
          0.0: '#0000ff',  // Blue
          0.2: '#00ffff',  // Cyan
          0.4: '#00ff00',  // Green
          0.6: '#ffff00',  // Yellow
          0.8: '#ff8000',  // Orange
          1.0: '#ff0000'   // Red
        },
        ...options
      };

      // Create heatmap layer
      const heatLayer = (L as any).heatLayer(heatData, defaultOptions);
      
      // Add to map
      heatLayer.addTo(map);

      // Cleanup function
      return () => {
        map.removeLayer(heatLayer);
      };
    };

    const cleanup = loadHeatLayer();
    
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, [map, data, options]);

  return null;
}