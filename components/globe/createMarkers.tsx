import * as THREE from 'three';

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population?: number;
  isCapital?: boolean;
}

// Convert latitude and longitude to 3D position
function latLongToVector3(lat: number, long: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Create text texture for city labels
function createTextTexture(text: string, isCapital: boolean = false): THREE.Texture {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  
  // Set canvas size
  canvas.width = 512;
  canvas.height = 128;
  
  // Clear canvas
  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Set text properties
  const fontSize = isCapital ? 32 : 24;
  context.font = `bold ${fontSize}px Arial, sans-serif`;
  context.fillStyle = isCapital ? '#ffffff' : '#e0e0e0';
  context.strokeStyle = '#000000';
  context.lineWidth = 3;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  // Add text with outline for better visibility
  context.strokeText(text, canvas.width / 2, canvas.height / 2);
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  // Create texture
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

export function addCityLabels(cities: CityLocation[], labelGroup: THREE.Group, globe: THREE.Group) {
  const radius = 2; // Same as globe radius
  
  cities.forEach((city) => {
    // Create label container
    const labelContainer = new THREE.Group();
    labelContainer.userData = { id: city.id, data: city };
    
    // Calculate position based on lat/long (slightly above surface)
    const position = latLongToVector3(city.latitude, city.longitude, radius * 1.05);
    labelContainer.position.copy(position);
    
    // Create small dot marker for the city
    const dotGeometry = new THREE.SphereGeometry(city.isCapital ? 0.015 : 0.01, 8, 8);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: city.isCapital ? 0xffd700 : 0xff6b6b, // Gold for capitals, red for other cities
      transparent: true,
      opacity: 0.9
    });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    labelContainer.add(dot);
    
    // Create text label
    const textTexture = createTextTexture(city.name, city.isCapital);
    const labelGeometry = new THREE.PlaneGeometry(1, 0.25);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    });
    
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = city.isCapital ? 0.15 : 0.12; // Capitals slightly higher
    labelContainer.add(label);
    
    // Make label always face the camera
    labelContainer.lookAt(new THREE.Vector3(0, 0, 0));
    labelContainer.rotateY(Math.PI);
    
    // Add to label group
    labelGroup.add(labelContainer);
  });
  
  // Add label group to globe
  globe.add(labelGroup);
}