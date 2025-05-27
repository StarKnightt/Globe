import * as THREE from 'three';

export function createGlobe() {
  // Create a group to hold the globe and its atmosphere
  const globeGroup = new THREE.Group();

  // Create globe geometry
  const radius = 2;
  const segments = 64;
  const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);

  // Create globe material with initial basic color
  const globeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff, // Set to white to not affect the texture color
    bumpScale: 0.02,
    specular: new THREE.Color(0x333333),
    shininess: 5,
    transparent: false,
    opacity: 1.0,
  });

  // Create globe mesh
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  globeGroup.add(globe);

  // Create atmosphere glow
  const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.1, segments, segments);
  const atmosphereMaterial = new THREE.MeshPhongMaterial({
    color: 0x6698ff,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  globeGroup.add(atmosphere);

  // Function to load textures and update materials
  const loadGlobe = async () => {
    const textureLoader = new THREE.TextureLoader();
    
    try {
      // Load textures concurrently
      const [diffuseMap, bumpMap, specularMap] = await Promise.all([
        new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
            resolve,
            undefined,
            reject
          );
        }),
        new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-topology.png',
            resolve,
            undefined,
            reject
          );
        }),
        new Promise<THREE.Texture>((resolve, reject) => {
          textureLoader.load(
            'https://unpkg.com/three-globe/example/img/earth-water.png',
            resolve,
            undefined,
            reject
          );
        }),
      ]);

      // Apply textures
      globeMaterial.map = diffuseMap;
      globeMaterial.bumpMap = bumpMap;
      globeMaterial.specularMap = specularMap;
      globeMaterial.needsUpdate = true;

    } catch (error) {
      console.error('Error loading globe textures:', error);
      // Continue with basic material if textures fail to load
    }
  };

  return { globe: globeGroup, loadGlobe };
}