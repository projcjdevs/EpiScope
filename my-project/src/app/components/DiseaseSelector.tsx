"use client";

interface DiseaseSelectorProps {
  selectedDisease: string | null;
  onDiseaseChange: (disease: string | null) => void;
  diseases: string[];
  isVisible: boolean;
}

export default function DiseaseSelector({ 
  selectedDisease, 
  onDiseaseChange, 
  diseases,
  isVisible 
}: DiseaseSelectorProps) {
  if (!isVisible) return null;

  return (
    <div className="absolute top-20 right-10 z-[1000] bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-gray-200/30 min-w-[250px]">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Disease Heatmap</h3>
      <select
        value={selectedDisease || ''}
        onChange={(e) => onDiseaseChange(e.target.value || null)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
      >
        <option value="">Select a disease</option>
        {diseases.map((disease) => (
          <option key={disease} value={disease}>
            {disease}
          </option>
        ))}
      </select>
      
      {selectedDisease && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Showing heatmap for: <strong>{selectedDisease}</strong>
          </p>
        </div>
      )}
    </div>
  );
}