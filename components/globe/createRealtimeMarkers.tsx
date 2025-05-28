import * as THREE from 'three';
import { VisitorLocation } from '@/lib/realtimeVisitors';

// Convert latitude and longitude to 3D position
function latLongToVector3(lat: number, long: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Create text texture for visitor labels
function createVisitorTextTexture(visitor: VisitorLocation): THREE.Texture {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  
  canvas.width = 512;
  canvas.height = 128;
  
  context.fillStyle = 'transparent';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Create a gradient background
  const gradient = context.createLinearGradient(0, 0, canvas.width, 0);
  gradient.addColorStop(0, 'rgba(0, 150, 255, 0.8)');
  gradient.addColorStop(1, 'rgba(0, 100, 200, 0.8)');
  
  // Draw rounded background
  const cornerRadius = 20;
  const rectX = 50;
  const rectY = 20;
  const rectWidth = canvas.width - 100;
  const rectHeight = canvas.height - 40;
  
  context.fillStyle = gradient;
  context.beginPath();
  context.roundRect(rectX, rectY, rectWidth, rectHeight, cornerRadius);
  context.fill();
  
  // Add border
  context.strokeStyle = '#ffffff';
  context.lineWidth = 2;
  context.stroke();
  
  // Add text
  context.font = 'bold 24px Arial, sans-serif';
  context.fillStyle = '#ffffff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  
  const text = `🌍 ${visitor.city}, ${visitor.country}`;
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  return texture;
}

// Create animated pulse effect
function createPulseEffect(): THREE.Mesh {
  const geometry = new THREE.RingGeometry(0.02, 0.08, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  
  return new THREE.Mesh(geometry, material);
}

export function addRealtimeVisitors(
  visitors: VisitorLocation[], 
  visitorGroup: THREE.Group, 
  globe: THREE.Group
) {
  // Clear existing visitors
  while (visitorGroup.children.length > 0) {
    const child = visitorGroup.children[0];
    visitorGroup.remove(child);
    
    // Dispose of geometries and materials
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose();
      if (Array.isArray(child.material)) {
        child.material.forEach(mat => mat.dispose());
      } else {
        child.material.dispose();
      }
    }
  }
  
  const radius = 2;
  
  visitors.forEach((visitor, index) => {
    // Create visitor container
    const visitorContainer = new THREE.Group();
    visitorContainer.userData = { id: visitor.id, data: visitor };
    
    // Calculate position
    const position = latLongToVector3(visitor.latitude, visitor.longitude, radius * 1.03);
    visitorContainer.position.copy(position);
    
    // Create main visitor dot
    const dotGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 1
    });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    visitorContainer.add(dot);
    
    // Create pulse effect
    const pulse = createPulseEffect();
    pulse.position.z = 0.01;
    
    // Animate pulse
    const animatePulse = () => {
      const scale = 1 + 0.5 * Math.sin(Date.now() * 0.003 + index * 0.5);
      pulse.scale.setScalar(scale);
      pulse.material.opacity = 0.6 / scale;
    };
    
    // Store animation function for cleanup
    pulse.userData.animate = animatePulse;
    visitorContainer.add(pulse);
    
    // Create visitor info label
    const textTexture = createVisitorTextTexture(visitor);
    const labelGeometry = new THREE.PlaneGeometry(1.2, 0.3);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    });
    
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.y = 0.2;
    visitorContainer.add(label);
    
    // Create connection line to globe surface
    const lineGeometry = new THREE.BufferGeometry();
    const surfacePosition = latLongToVector3(visitor.latitude, visitor.longitude, radius);
    const linePositions = new Float32Array([
      surfacePosition.x, surfacePosition.y, surfacePosition.z,
      position.x, position.y, position.z
    ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.5
    });
    
    const line = new THREE.Line(lineGeometry, lineMaterial);
    visitorContainer.add(line);
    
    // Make label face outward
    visitorContainer.lookAt(new THREE.Vector3(0, 0, 0));
    visitorContainer.rotateY(Math.PI);
    
    visitorGroup.add(visitorContainer);
  });
  
  globe.add(visitorGroup);
}

// Animation function for pulse effects
export function animateVisitorMarkers(visitorGroup: THREE.Group) {
  visitorGroup.children.forEach(container => {
    container.children.forEach(child => {
      if (child.userData.animate) {
        child.userData.animate();
      }
    });
  });
} 