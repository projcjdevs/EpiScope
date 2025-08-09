"use client";

import dynamic from 'next/dynamic';
import Header from './components/Header';

// Dynamically import Map component with no SSR
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function HomePage() {
  return (
    <div>
      <Header
        onMenuClick={() => console.log('Menu clicked')}
        onUserClick={() => console.log('User clicked')}
        onSettingsClick={() => console.log('Settings clicked')}
        onMoreClick={() => console.log('More clicked')}
      />
      <Map />
    </div>
  );
}