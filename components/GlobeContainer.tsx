'use client';

import { useEffect, useRef, useState } from 'react';
import { GlobeScene } from '@/components/globe/GlobeScene';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div 
      ref={containerRef} 
      className="w-full h-full relative"
    >
      <div className={cn(
        "absolute inset-0 flex items-center justify-center z-10 bg-background/80 transition-opacity duration-500",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading Globe...</p>
        </div>
      </div>

      <GlobeScene 
        containerRef={containerRef}
        onLoaded={handleLoaded}
        isRotating={isRotating}
      />
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <Button 
          onClick={toggleRotation}
          variant="outline"
          className="backdrop-blur-sm bg-background/50"
        >
          {isRotating ? 'Pause Rotation' : 'Resume Rotation'}
        </Button>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-xl md:text-2xl font-bold">Interactive Globe</h1>
        <p className="text-sm text-muted-foreground">Explore our connected world</p>
      </div>
    </div>
  );
}