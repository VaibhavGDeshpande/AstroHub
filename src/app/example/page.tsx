"use client";

import React, { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { usePlanets } from "@/api_service/example";
import * as THREE from "three";

// Planet Model Component with proper centering
function PlanetModel({ url }: { url: string }) {
  const gltf = useGLTF(url);

  useEffect(() => {
    // Center the geometry like in the solar system code
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        
        // Center the geometry so model pivots from its actual center
        if (mesh.geometry) {
          mesh.geometry.center();
        }

        // Fix material rendering issues
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => {
              material.needsUpdate = true;
            });
          } else {
            mesh.material.needsUpdate = true;
          }
          // Enable shadows for better visuals
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });
  }, [gltf]);

  return <primitive object={gltf.scene} scale={3} position={[0, 0, 0]} />;
}

const PlanetViewer = () => {
  const { planets, loading, error } = usePlanets();
  const [selectedPlanet, setSelectedPlanet] = useState(0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-purple-300 text-lg font-medium">Discovering planets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="bg-red-950/50 border border-red-500/50 rounded-2xl p-8 backdrop-blur-sm max-w-md">
          <p className="text-red-400 text-center">{error}</p>
        </div>
      </div>
    );
  }

  // Filter planets that have models
  const planetsWithModels = planets.filter(planet => planet.model);

  if (planetsWithModels.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <p className="text-purple-400">No planet models available</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Planet Navigation */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full p-2 border border-purple-500/30 max-w-4xl">
        {planetsWithModels.map((planet, index) => (
          <button
            key={planet.name}
            onClick={() => setSelectedPlanet(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              selectedPlanet === index
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-800/50 text-purple-300 hover:bg-slate-700/50'
            }`}
          >
            {planet.name}
          </button>
        ))}
      </div>

      {/* Current Planet Info */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 max-w-sm">
        <h2 className="text-2xl font-bold text-purple-300 mb-2">
          {planetsWithModels[selectedPlanet]?.name}
        </h2>
      </div>

      {/* 3D Canvas - Planet always centered at (0, 0, 0) */}
      <Canvas 
        camera={{ 
          position: [0, 0, 10],  // Camera positioned straight back from center
          fov: 50 
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        {/* Enhanced lighting like solar system */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <hemisphereLight
          color={new THREE.Color(0xffffff)}
          groundColor={new THREE.Color(0x444444)}
          intensity={0.6}
        />
        
        <Suspense fallback={null}>
          {planetsWithModels[selectedPlanet]?.model && (
            <PlanetModel 
              url={planetsWithModels[selectedPlanet].model}
            />
          )}
        </Suspense>
        
        {/* OrbitControls target fixed at origin (0, 0, 0) */}
        <OrbitControls 
          target={[0, 0, 0]}  // Always look at center where planet is
          enableZoom 
          enablePan 
          enableDamping
          dampingFactor={0.05}
          minDistance={3} 
          maxDistance={20}
        />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default PlanetViewer;
