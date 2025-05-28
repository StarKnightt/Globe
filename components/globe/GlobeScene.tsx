'use client';

import { useRef, useEffect, RefObject } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createGlobe } from '@/components/globe/createGlobe';
import { createStars } from '@/components/globe/createStars';
import { CityLocation, addCityLabels } from '@/components/globe/createMarkers';
import { worldCities } from '@/lib/globeData';
import { useRealtimeVisitors } from '@/lib/realtimeVisitors';
import { addRealtimeVisitors, animateVisitorMarkers } from '@/components/globe/createRealtimeMarkers';

interface GlobeSceneProps {
  containerRef: RefObject<HTMLDivElement>;
  onLoaded?: () => void;
  isRotating: boolean;
  showRealtimeVisitors?: boolean;
}

export function GlobeScene({ containerRef, onLoaded, isRotating, showRealtimeVisitors = true }: GlobeSceneProps) {
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const globeRef = useRef<THREE.Group | null>(null);
  const frameIdRef = useRef<number | null>(null);
  const cityLabelsRef = useRef<THREE.Group | null>(null);
  const visitorsRef = useRef<THREE.Group | null>(null);
  
  // Real-time visitor tracking
  const { visitors, currentVisitor } = useRealtimeVisitors();

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

    // Enhanced lighting for Google Maps-like visibility
    // Strong ambient light to ensure all areas are visible
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Primary directional light (simulating sun)
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight1.position.set(5, 3, 5);
    scene.add(directionalLight1);

    // Secondary directional light from opposite side to eliminate shadows
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, -3, -5);
    scene.add(directionalLight2);

    // Additional hemisphere light for even illumination
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.3);
    scene.add(hemisphereLight);

    // Create city labels group
    const cityLabelGroup = new THREE.Group();
    cityLabelsRef.current = cityLabelGroup;
    scene.add(cityLabelGroup);
    
    // Create visitors group
    const visitorsGroup = new THREE.Group();
    visitorsRef.current = visitorsGroup;
    scene.add(visitorsGroup);

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
      
      // Make city labels always face the camera
      if (cityLabelsRef.current && cameraRef.current) {
        cityLabelsRef.current.children.forEach((labelContainer) => {
          const labelMesh = labelContainer.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry);
          if (labelMesh) {
            labelMesh.lookAt(cameraRef.current!.position);
          }
        });
      }
      
      // Animate visitor markers and make labels face camera
      if (visitorsRef.current && cameraRef.current) {
        animateVisitorMarkers(visitorsRef.current);
        visitorsRef.current.children.forEach((visitorContainer) => {
          const labelMesh = visitorContainer.children.find(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.PlaneGeometry);
          if (labelMesh) {
            labelMesh.lookAt(cameraRef.current!.position);
          }
        });
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

    // Load globe textures and add labels based on mode
    loadGlobe().then(() => {
      if (mounted) {
        if (!showRealtimeVisitors && cityLabelsRef.current && globeRef.current) {
          addCityLabels(worldCities, cityLabelsRef.current, globeRef.current);
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
  
  // Update visitors when they change
  useEffect(() => {
    if (showRealtimeVisitors && visitorsRef.current && globeRef.current && visitors.length > 0) {
      addRealtimeVisitors(visitors, visitorsRef.current, globeRef.current);
    }
  }, [visitors, showRealtimeVisitors]);
  
  // Toggle between city labels and visitors
  useEffect(() => {
    if (!cityLabelsRef.current || !visitorsRef.current || !globeRef.current) return;
    
    if (showRealtimeVisitors) {
      // Clear city labels
      while (cityLabelsRef.current.children.length > 0) {
        cityLabelsRef.current.remove(cityLabelsRef.current.children[0]);
      }
      // Show visitors if any
      if (visitors.length > 0) {
        addRealtimeVisitors(visitors, visitorsRef.current, globeRef.current);
      }
    } else {
      // Clear visitors
      while (visitorsRef.current.children.length > 0) {
        visitorsRef.current.remove(visitorsRef.current.children[0]);
      }
      // Show city labels
      addCityLabels(worldCities, cityLabelsRef.current, globeRef.current);
    }
  }, [showRealtimeVisitors, visitors]);

  return null;
}