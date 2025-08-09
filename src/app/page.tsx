"use client";

import dynamic from 'next/dynamic';

// Dynamically import Map component with no SSR
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function HomePage() {
  return (
    <div>
      <Map />
    </div>
  );
}