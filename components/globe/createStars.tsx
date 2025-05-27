import * as THREE from 'three';

export function createStars() {
  // Create star particles
  const starCount = 10000;
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  // Create star positions
  const positions = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    // Position stars in a sphere around the scene
    const radius = Math.random() * 80 + 20; // Between 20 and 100
    const theta = Math.random() * Math.PI * 2; // 0 to 2π
    const phi = Math.acos(2 * Math.random() - 1); // 0 to π

    // Convert spherical coordinates to Cartesian
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Random sizes for some variation
    sizes[i] = Math.random() * 0.5 + 0.1;
  }

  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const stars = new THREE.Points(starGeometry, starMaterial);
  return stars;
}