"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from './components/Header';

const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function HomePage() {
  const [showHeatmapSelector, setShowHeatmapSelector] = useState(false);

  const handleViewClick = () => {
    setShowHeatmapSelector(!showHeatmapSelector);
  };

  return (
    <div>
      <Header
        onMenuClick={() => console.log('Menu clicked')}
        onViewClick={handleViewClick}
        onSettingsClick={() => console.log('Settings clicked')}
        onMoreClick={() => console.log('More clicked')}
      />
      <Map showHeatmapSelector={showHeatmapSelector} />
    </div>
  );
}