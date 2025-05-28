"use client";

import createGlobe from "cobe";
import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const globeRef = useRef<any>(null);
  const [scale, setScale] = useState(1.5);
  const [dimensions, setDimensions] = useState({ width: 800, height: 800 });

  const r = useMotionValue(0);
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  });

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ 
          width: Math.min(width, height), 
          height: Math.min(width, height) 
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    let phi = 0;
    
    const createGlobeInstance = async () => {
      if (!canvasRef.current) return;

      try {
        const COBE = (await import("cobe")).default;
        
        const globe = COBE(canvasRef.current, {
          devicePixelRatio: 2,
          width: dimensions.width * 2,
          height: dimensions.height * 2,
          phi: 0,
          theta: 0.3,
          dark: 1,
          diffuse: 3,
          mapSamples: 50000,
          mapBrightness: 6,
          baseColor: [0.3, 0.3, 0.3],
          markerColor: [0.1, 0.8, 1],
          glowColor: [0.2, 0.2, 0.2],
          markers: [],
          scale: scale,
          offset: [0, 0],
          onRender: (state) => {
            state.phi = phi
            phi += 0.003
          }
        });

        globeRef.current = globe;

        setTimeout(() => {
          if (canvasRef.current) {
            canvasRef.current.style.opacity = "1";
          }
        }, 100);
      } catch (error) {
        console.error("Error creating globe:", error);
      }
    };

    createGlobeInstance();

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
      }
    };
  }, [scale, dimensions]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    const newScale = Math.min(Math.max(scale + delta, 1.2), 2.0);
    setScale(newScale);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-slate-950">
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        style={{ transform: 'translateX(-15%)' }}
        onWheel={handleWheel}
      >
        <canvas
          ref={canvasRef}
          style={{ 
            width: dimensions.width,
            height: dimensions.height,
            objectFit: 'contain',
            transform: 'scale(1.2)'
          }}
          width={dimensions.width * 2}
          height={dimensions.height * 2}
          className="opacity-0 transition-opacity duration-500 cursor-grab active:cursor-grabbing"
          onPointerDown={(e) => {
            pointerInteracting.current = e.clientX;
            if (canvasRef.current) {
              canvasRef.current.style.cursor = "grabbing";
            }
          }}
          onPointerUp={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) {
              canvasRef.current.style.cursor = "grab";
            }
          }}
          onPointerOut={() => {
            pointerInteracting.current = null;
            if (canvasRef.current) {
              canvasRef.current.style.cursor = "grab";
            }
          }}
          onMouseMove={(e) => {
            if (pointerInteracting.current !== null) {
              const delta = e.clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              r.set(r.get() + delta / dimensions.width);
            }
          }}
          onTouchMove={(e) => {
            if (pointerInteracting.current !== null && e.touches[0]) {
              const delta = e.touches[0].clientX - pointerInteracting.current;
              pointerInteractionMovement.current = delta;
              r.set(r.get() + delta / dimensions.width);
            }
          }}
        />

        {/* Controls */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          <button
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setScale(Math.min(scale + 0.1, 2.0))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <button
            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            onClick={() => setScale(Math.max(scale - 0.1, 1.2))}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 