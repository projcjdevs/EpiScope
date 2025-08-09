export interface MockDiseaseData {
  disease: string;
  data: Array<{
    lat: number;
    lng: number;
    intensity: number;
    cases: number;
    location: string;
  }>;
}

// Generate random coordinates within NCR bounds
const generateRandomNCRCoordinate = () => {
  const ncrBounds = {
    minLat: 14.35,
    maxLat: 14.85,
    minLng: 120.85,
    maxLng: 121.15
  };
  
  return {
    lat: ncrBounds.minLat + Math.random() * (ncrBounds.maxLat - ncrBounds.minLat),
    lng: ncrBounds.minLng + Math.random() * (ncrBounds.maxLng - ncrBounds.minLng)
  };
};

// Generate mock data for different diseases
export const generateMockHeatmapData = (): MockDiseaseData[] => {
  const diseases = ['Dengue', 'COVID-19', 'Tuberculosis', 'Malaria', 'Typhoid'];
  const locations = [
    'Manila', 'Quezon City', 'Makati', 'Pasig', 'Taguig', 
    'Mandaluyong', 'San Juan', 'Caloocan', 'Malabon', 'Navotas',
    'Valenzuela', 'Las Piñas', 'Muntinlupa', 'Parañaque', 
    'Pasay', 'Marikina', 'Pateros'
  ];

  return diseases.map(disease => ({
    disease,
    data: Array.from({ length: 50 + Math.floor(Math.random() * 100) }, (_, index) => {
      const coord = generateRandomNCRCoordinate();
      const cases = Math.floor(Math.random() * 100) + 1;
      
      return {
        ...coord,
        intensity: Math.min(cases / 100, 1), // Normalize to 0-1
        cases,
        location: locations[Math.floor(Math.random() * locations.length)]
      };
    })
  }));
};

// Specific hotspot data for more realistic patterns
export const generateHotspotData = (disease: string) => {
  const hotspots = [
    { lat: 14.5995, lng: 120.9842, name: 'Manila City Center' },
    { lat: 14.6760, lng: 121.0437, name: 'Quezon City' },
    { lat: 14.5547, lng: 121.0244, name: 'Makati CBD' },
    { lat: 14.5764, lng: 121.0851, name: 'Pasig' },
    { lat: 14.5176, lng: 121.0509, name: 'Taguig BGC' }
  ];

  return hotspots.flatMap(hotspot => 
    Array.from({ length: 15 + Math.floor(Math.random() * 20) }, () => {
      // Create cluster around hotspot
      const offsetLat = (Math.random() - 0.5) * 0.05; // Small radius
      const offsetLng = (Math.random() - 0.5) * 0.05;
      const cases = Math.floor(Math.random() * 80) + 20;
      
      return {
        lat: hotspot.lat + offsetLat,
        lng: hotspot.lng + offsetLng,
        intensity: Math.min(cases / 100, 1),
        cases,
        location: hotspot.name
      };
    })
  );
};