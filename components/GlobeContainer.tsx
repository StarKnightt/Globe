'use client';

import { useRef, useState } from 'react';
import { CobeGlobe } from '@/components/globe/CobeGlobe';

export default function GlobeContainer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(true);

  const handleLoaded = () => {
    setIsLoading(false);
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div ref={containerRef} className="h-screen w-screen bg-slate-950">
      <CobeGlobe 
        isRotating={isRotating} 
        onLoaded={handleLoaded} 
        containerRef={containerRef} 
      />
      {/* You could add buttons or loaders here using isLoading and toggleRotation if needed */}
    </div>
  );
}
