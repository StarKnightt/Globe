import * as THREE from 'three';

export function createGlobe() {
  // Create a group to hold the globe and its atmosphere
  const globeGroup = new THREE.Group();

  // Create globe geometry with higher detail
  const radius = 2;
  const segments = 128; // Increased for smoother surface
  const globeGeometry = new THREE.SphereGeometry(radius, segments, segments);

  // Create globe material optimized for visibility
  const globeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    transparent: false,
    opacity: 1.0,
  });

  // Create globe mesh
  const globe = new THREE.Mesh(globeGeometry, globeMaterial);
  globeGroup.add(globe);

  // Create subtle atmosphere glow that doesn't obscure details
  const atmosphereGeometry = new THREE.SphereGeometry(radius * 1.05, segments, segments);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x88ccff,
    transparent: true,
    opacity: 0.03,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  globeGroup.add(atmosphere);

  // Function to load textures and update materials
  const loadGlobe = async () => {
    const textureLoader = new THREE.TextureLoader();
    
    try {
      // Load high-resolution Earth texture
      const earthTexture = await new Promise<THREE.Texture>((resolve, reject) => {
        textureLoader.load(
          'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
          (texture) => {
            // Configure texture for best quality
            texture.generateMipmaps = true;
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            resolve(texture);
          },
          undefined,
          reject
        );
      });

      // Apply texture with enhanced material properties
      globeMaterial.map = earthTexture;
      globeMaterial.needsUpdate = true;

      // Switch to a material that provides better visibility
      const enhancedMaterial = new THREE.MeshLambertMaterial({
        map: earthTexture,
        color: 0xffffff,
        transparent: false,
        opacity: 1.0,
      });

      globe.material = enhancedMaterial;

    } catch (error) {
      console.error('Error loading globe textures:', error);
      // Fallback to a solid color if texture loading fails
      globeMaterial.color = new THREE.Color(0x4488bb);
      globeMaterial.needsUpdate = true;
    }
  };

  return { globe: globeGroup, loadGlobe };
}