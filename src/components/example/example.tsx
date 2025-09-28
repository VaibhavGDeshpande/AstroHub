"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface SimpleBlackHoleProps {
  className?: string;
  size?: number;
  diskRadius?: number;
  rotationSpeed?: number;
  showStars?: boolean;
}

const SimpleBlackHole: React.FC<SimpleBlackHoleProps> = ({
  className = "",
  size = 0.5,
  diskRadius = 2.5,
  rotationSpeed = 0.5,
  showStars = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const frameRef = useRef<number>();
  const blackHoleRef = useRef<THREE.Mesh>();
  const accretionDiskRef = useRef<THREE.Points>();
  const starsRef = useRef<THREE.Points>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 1, 6);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Create black hole [web:1][web:47]
    const createBlackHole = () => {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          varying vec3 vPosition;
          
          void main() {
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(vUv, center);
            
            // Event horizon - pure black with subtle edge glow
            float horizon = 0.45;
            float edgeGlow = smoothstep(horizon, horizon + 0.1, dist);
            
            vec3 color = vec3(0.0);
            if (dist > horizon) {
              // Subtle gravitational lensing effect at the edge
              color = vec3(0.15, 0.05, 0.25) * edgeGlow * 0.3;
            }
            
            gl_FragColor = vec4(color, 1.0);
          }
        `,
        side: THREE.DoubleSide
      });

      const blackHole = new THREE.Mesh(geometry, material);
      blackHoleRef.current = blackHole;
      scene.add(blackHole);
    };

    // Create accretion disk [web:7][web:47][web:49]
    const createAccretionDisk = () => {
      const particleCount = 3000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      const velocities = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Create disk distribution with realistic density falloff
        const innerRadius = size * 1.5;
        const outerRadius = diskRadius;
        const radius = innerRadius + Math.pow(Math.random(), 0.7) * (outerRadius - innerRadius);
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 0.15 * Math.pow(radius / outerRadius, 2);

        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 1] = height;  
        positions[i3 + 2] = Math.sin(angle) * radius;

        // Temperature-based coloring (closer = hotter = bluer) [web:49]
        const temp = 1.0 - Math.pow((radius - innerRadius) / (outerRadius - innerRadius), 0.5);
        const r = 0.8 + temp * 0.2;
        const g = 0.4 + temp * 0.4;
        const b = 0.2 + temp * 0.8;
        
        colors[i3] = r;
        colors[i3 + 1] = g;
        colors[i3 + 2] = b;

        // Particle size based on distance and temperature
        sizes[i] = (0.02 + temp * 0.04) * Math.random();
        
        // Orbital velocity (Keplerian motion)
        velocities[i] = Math.sqrt(1.0 / radius) * 0.3;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0.0 }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          attribute float velocity;
          varying vec3 vColor;
          varying float vAlpha;
          uniform float time;
          
          void main() {
            vColor = color;
            
            // Calculate orbital motion
            float radius = length(position.xz);
            float currentAngle = atan(position.z, position.x);
            float newAngle = currentAngle + velocity * time;
            
            vec3 newPosition = position;
            newPosition.x = cos(newAngle) * radius;
            newPosition.z = sin(newAngle) * radius;
            
            vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
            
            // Size attenuation and brightness based on distance from center
            float distanceFromCenter = length(newPosition.xz);
            vAlpha = 1.0 / (1.0 + distanceFromCenter * 0.3);
            
            gl_PointSize = size * (300.0 / -mvPosition.z) * vAlpha;
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          varying float vAlpha;
          
          void main() {
            // Create circular particles
            vec2 center = vec2(0.5, 0.5);
            float dist = distance(gl_PointCoord, center);
            if (dist > 0.5) discard;
            
            // Smooth falloff
            float alpha = (1.0 - dist * 2.0) * vAlpha;
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        depthWrite: false
      });

      const accretionDisk = new THREE.Points(geometry, material);
      accretionDiskRef.current = accretionDisk;
      scene.add(accretionDisk);
    };

    // Create background stars [web:22][web:48]
    const createStars = () => {
      if (!showStars) return;

      const starCount = 1000;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        
        // Random positions in a sphere
        const radius = 20 + Math.random() * 80;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);

        // Star colors (realistic stellar colors)
        const starType = Math.random();
        if (starType < 0.7) {
          // White/yellow stars
          colors[i3] = 0.9 + Math.random() * 0.1;
          colors[i3 + 1] = 0.8 + Math.random() * 0.2;
          colors[i3 + 2] = 0.6 + Math.random() * 0.4;
        } else if (starType < 0.9) {
          // Blue stars
          colors[i3] = 0.6 + Math.random() * 0.2;
          colors[i3 + 1] = 0.8 + Math.random() * 0.2;
          colors[i3 + 2] = 1.0;
        } else {
          // Red stars
          colors[i3] = 1.0;
          colors[i3 + 1] = 0.3 + Math.random() * 0.3;
          colors[i3 + 2] = 0.1 + Math.random() * 0.2;
        }

        sizes[i] = Math.random() * 0.02 + 0.01;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
      });

      const stars = new THREE.Points(geometry, material);
      starsRef.current = stars;
      scene.add(stars);
    };

    // Initialize all components
    createBlackHole();
    createAccretionDisk();
    createStars();

    // Animation loop
    let time = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      time += 0.016 * rotationSpeed;

      // Update black hole shader
      if (blackHoleRef.current?.material instanceof THREE.ShaderMaterial) {
        blackHoleRef.current.material.uniforms.time.value = time;
      }

      // Update accretion disk rotation
      if (accretionDiskRef.current?.material instanceof THREE.ShaderMaterial) {
        accretionDiskRef.current.material.uniforms.time.value = time;
      }

      // Subtle camera movement for dynamic view
      if (cameraRef.current) {
        cameraRef.current.position.x = Math.sin(time * 0.1) * 0.2;
        cameraRef.current.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    // Handle resize
    const handleResize = () => {
      if (!mount || !camera || !renderer) return;
      
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mount && renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      
      // Dispose of resources
      renderer.dispose();
      
      [blackHoleRef, accretionDiskRef, starsRef].forEach(ref => {
        if (ref.current) {
          ref.current.geometry.dispose();
          if (ref.current.material instanceof THREE.Material) {
            ref.current.material.dispose();
          }
        }
      });
    };
  }, [size, diskRadius, rotationSpeed, showStars]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Three.js canvas container */}
      <div 
        ref={mountRef} 
        className="w-full h-full bg-black"
        style={{ minHeight: '400px' }}
      />
      
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-lg animate-pulse">
            Loading Black Hole...
          </div>
        </div>
      )}
      
      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 text-white/70 text-sm">
        <div>Black Hole Visualization</div>
        <div className="text-xs mt-1">
          Event Horizon: {(size * 2).toFixed(1)}units • Disk Radius: {diskRadius}units
        </div>
      </div>
    </div>
  );
};

export default SimpleBlackHole;
