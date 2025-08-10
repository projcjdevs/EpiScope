"use client";

import { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface CityData {
  cityName: string;
  population: string;
  coordinates: [number, number];
  diseases: {
    [key: string]: {
      totalCases: number;
      deaths: number;
      recovered: number;
      active: number;
      monthlyData: {
        month: string;
        cases: number;
        deaths: number;
        recovered: number;
      }[];
    };
  };
}

interface CityDataCardProps {
  cityData: CityData | null;
  isVisible: boolean;
  onClose: () => void;
}

export default function CityDataCard({ cityData, isVisible, onClose }: CityDataCardProps) {
  const [selectedDisease, setSelectedDisease] = useState('Dengue');
  const [timeFrame, setTimeFrame] = useState('6months');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  if (!isVisible || !cityData) return null;

  const diseaseData = cityData.diseases[selectedDisease];
  const availableDiseases = Object.keys(cityData.diseases);

  // Filter data based on timeframe
  const getFilteredData = () => {
    let months = 12;
    if (timeFrame === '3months') months = 3;
    if (timeFrame === '6months') months = 6;
    
    return diseaseData.monthlyData.slice(-months);
  };

  const filteredData = getFilteredData();

  // Chart data configuration
  const chartData = {
    labels: filteredData.map(d => d.month),
    datasets: [
      {
        label: 'Cases',
        data: filteredData.map(d => d.cases),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Deaths',
        data: filteredData.map(d => d.deaths),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Recovered',
        data: filteredData.map(d => d.recovered),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      }
    ]
  };

  // Doughnut chart for status distribution
  const statusData = {
    labels: ['Active Cases', 'Recovered', 'Deaths'],
    datasets: [{
      data: [diseaseData.active, diseaseData.recovered, diseaseData.deaths],
      backgroundColor: [
        'rgba(255, 193, 7, 0.8)',
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(255, 193, 7, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${selectedDisease} Trends in ${cityData.cityName}`
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">{cityData.cityName}</h2>
              <p className="text-blue-100">Population: {cityData.population}</p>
              <p className="text-blue-100 text-sm">
                Coordinates: {cityData.coordinates[0].toFixed(4)}, {cityData.coordinates[1].toFixed(4)}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Disease Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Disease</label>
              <select
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {availableDiseases.map(disease => (
                  <option key={disease} value={disease}>{disease}</option>
                ))}
              </select>
            </div>

            {/* Time Frame */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Frame</label>
              <select
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
              </select>
            </div>

            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value as 'line' | 'bar')}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{diseaseData.totalCases.toLocaleString()}</div>
              <div className="text-sm text-blue-800">Total Cases</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{diseaseData.deaths.toLocaleString()}</div>
              <div className="text-sm text-red-800">Deaths</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{diseaseData.recovered.toLocaleString()}</div>
              <div className="text-sm text-green-800">Recovered</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{diseaseData.active.toLocaleString()}</div>
              <div className="text-sm text-yellow-800">Active Cases</div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-gray-50 p-4 rounded-lg">
              {chartType === 'line' ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>

            {/* Status Distribution */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-center">Case Status Distribution</h3>
              <Doughnut 
                data={statusData} 
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Mortality Rate</h4>
              <div className="text-2xl font-bold text-red-600">
                {((diseaseData.deaths / diseaseData.totalCases) * 100).toFixed(2)}%
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Recovery Rate</h4>
              <div className="text-2xl font-bold text-green-600">
                {((diseaseData.recovered / diseaseData.totalCases) * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}