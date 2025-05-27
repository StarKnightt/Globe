import * as THREE from 'three';

export interface MarkerData {
  id: string;
  latitude: number;
  longitude: number;
  avatarUrl: string;
  name: string;
  country?: string;
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

export function addMarkers(markers: MarkerData[], markerGroup: THREE.Group, globe: THREE.Group) {
  const radius = 2; // Same as globe radius
  const textureLoader = new THREE.TextureLoader();
  
  markers.forEach((marker) => {
    // Create marker container
    const markerContainer = new THREE.Group();
    markerContainer.userData = { id: marker.id, data: marker };
    
    // Calculate position based on lat/long
    const position = latLongToVector3(marker.latitude, marker.longitude, radius * 1.02);
    markerContainer.position.copy(position);
    
    // Make marker face outward from globe center
    markerContainer.lookAt(new THREE.Vector3(0, 0, 0));
    markerContainer.rotateY(Math.PI);
    
    // Create avatar disc
    const discGeometry = new THREE.CircleGeometry(0.08, 32);
    const discMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.position.z = 0.01;
    markerContainer.add(disc);
    
    // Load avatar texture
    textureLoader.load(marker.avatarUrl, (texture) => {
      const avatarGeometry = new THREE.CircleGeometry(0.075, 32);
      const avatarMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide
      });
      const avatar = new THREE.Mesh(avatarGeometry, avatarMaterial);
      avatar.position.z = 0.02;
      markerContainer.add(avatar);
    });
    
    // Add glow effect
    const glowGeometry = new THREE.CircleGeometry(0.1, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x6698ff,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = 0;
    markerContainer.add(glow);
    
    // Add to marker group
    markerGroup.add(markerContainer);
  });
  
  // Add marker group to scene
  globe.add(markerGroup);
}