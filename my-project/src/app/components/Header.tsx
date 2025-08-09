"use client";

import { useState } from 'react';

interface HeaderProps {
  onMenuClick?: () => void;
  onViewClick?: () => void;
  onSettingsClick?: () => void;
  onMoreClick?: () => void;
}

export default function Header({ 
  onMenuClick, 
  onViewClick, 
  onSettingsClick, 
  onMoreClick 
}: HeaderProps) {
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleButtonClick = (buttonType: string, callback?: () => void) => {
    setActiveButton(buttonType);
    callback?.();
    // Reset active state after animation
    setTimeout(() => setActiveButton(null), 200);
  };

  return (
    <header className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[1000] w-[calc(100%-2.5rem)] max-w-6xl">
      <div className="bg-white/90 backdrop-blur-lg border border-gray-200/30 rounded-2xl px-6 py-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex justify-between items-center">
          {/* Left side */}
          <div className="flex items-center">
            <button 
              className={`group relative w-10 h-10 rounded-xl bg-gray-50/80 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden ${
                activeButton === 'menu' ? 'bg-blue-600 text-white scale-95' : ''
              }`}
              onClick={() => handleButtonClick('menu', onMenuClick)}
              aria-label="Menu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <i className="fas fa-bars text-lg group-hover:scale-110 transition-transform duration-200"></i>
            </button>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Heatmap View Button */}
            <button 
              className={`group relative w-10 h-10 rounded-xl bg-gray-50/80 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden ${
                activeButton === 'view' ? 'bg-blue-600 text-white scale-95' : ''
              }`}
              onClick={() => handleButtonClick('view', onViewClick)}
              aria-label="Heatmap View"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <i className="fas fa-fire text-sm group-hover:scale-110 transition-transform duration-200"></i>
            </button>
            
            {/* Settings Button */}
            <button 
              className={`group relative w-10 h-10 rounded-xl bg-gray-50/80 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden ${
                activeButton === 'settings' ? 'bg-blue-600 text-white scale-95' : ''
              }`}
              onClick={() => handleButtonClick('settings', onSettingsClick)}
              aria-label="Settings"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <i className="fas fa-cog text-sm group-hover:scale-110 transition-transform duration-200"></i>
            </button>
            
            {/* More Options Button */}
            <button 
              className={`group relative w-10 h-10 rounded-xl bg-gray-50/80 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden ${
                activeButton === 'more' ? 'bg-blue-600 text-white scale-95' : ''
              }`}
              onClick={() => handleButtonClick('more', onMoreClick)}
              aria-label="More Options"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <i className="fas fa-ellipsis-v text-sm group-hover:scale-110 transition-transform duration-200"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}