'use client';

import { useRef, useEffect, RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createGlobe } from '@/components/globe/createGlobe';
import { createStars } from '@/components/globe/createStars';
import { MarkerData, addMarkers } from '@/components/globe/createMarkers';
import { sampleMarkers } from '@/lib/globeData';

interface GlobeSceneProps {
  containerRef: RefObject<HTMLDivElement>;
  onLoaded?: () => void;
  isRotating: boolean;
}

export function GlobeScene({ containerRef, onLoaded, isRotating }: GlobeSceneProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const markersRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let mounted = true;

    // Initialize scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Initialize camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Initialize renderer
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 10;
    controls.enablePan = false;
    controlsRef.current = controls;

    // Create the scene elements
    const stars = createStars();
    scene.add(stars);

    // Initialize and load globe
    const { globe, loadGlobe } = createGlobe();
    globeRef.current = globe;
    scene.add(globe);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Add point light
    const pointLight = new THREE.PointLight(0x6698ff, 1, 100);
    pointLight.position.set(-10, 5, 10);
    scene.add(pointLight);

    // Create markers group
    const markerGroup = new THREE.Group();
    markersRef.current = markerGroup;
    scene.add(markerGroup);

    // Animate function
    const animate = () => {
      if (!mounted) return;
      
      frameIdRef.current = requestAnimationFrame(animate);
      
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      
      if (globeRef.current && isRotating) {
        globeRef.current.rotation.y += 0.001;
      }
      
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      
      rendererRef.current.setSize(width, height);
    };

    // Load globe textures and add markers
    loadGlobe().then(() => {
      if (mounted) {
        if (markersRef.current && globeRef.current) {
          addMarkers(sampleMarkers, markersRef.current, globeRef.current);
        }
        
        if (onLoaded) {
          onLoaded();
        }
        
        // Start animation after everything is loaded
        animate();
      }
    });

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      mounted = false;
      
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      window.removeEventListener('resize', handleResize);
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of Three.js resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [containerRef, onLoaded]);

  // Update rotation state when isRotating changes
  useEffect(() => {
    // No need to do anything here; the animate function will use the latest isRotating value
  }, [isRotating]);

  return null;
}