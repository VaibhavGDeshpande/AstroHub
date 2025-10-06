"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { usePlanets } from "@/api_service/example";

function PlanetModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={5} position={[0, 0, 0]} />;
}

const PlanetViewer = () => {
  const { planets, loading, error } = usePlanets();

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

  return (
    <div className="h-screen w-screen overflow-hidden">
  <div className="h-full w-full">
    {planets.map((planet) => (
      <div key={planet.name} className="h-full w-full">
        {planet.model ? (
          <div className="h-full w-full">
            <Canvas camera={{ position: [0, 0, 5] }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[2, 2, 5]} intensity={1} />
              <Suspense fallback={null}>
                <PlanetModel url={planet.model} />
              </Suspense>
              <OrbitControls enableZoom />
              <Environment preset="sunset" />
            </Canvas>
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-slate-900/50 to-purple-900/20 flex items-center justify-center border border-purple-500/20">
            <p className="text-purple-400/60">No 3D model available</p>
          </div>
        )}
      </div>
    ))}
  </div>
</div>

  );
};

export default PlanetViewer;