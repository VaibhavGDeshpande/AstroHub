// "use client";

// import React, { Suspense, useState, useEffect, useRef } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { OrbitControls as DreiOrbitControls, useGLTF, Environment } from "@react-three/drei";
// import { usePlanets } from "@/api_service/example";
// import * as THREE from "three";
// import gsap from "gsap";

// // --- Utility: Convert Lat/Lon to 3D Coordinates ---
// function latLonToVector3(
//   latitude: number,
//   longitude: number,
//   radius: number = 3
// ): THREE.Vector3 {
//   const phi = (90 - latitude) * (Math.PI / 180);
//   const theta = (longitude + 180) * (Math.PI / 180);

//   const x = -radius * Math.sin(phi) * Math.cos(theta);
//   const y = radius * Math.cos(phi);
//   const z = radius * Math.sin(phi) * Math.sin(theta);

//   return new THREE.Vector3(x, y, z);
// }

// // --- Points of Interest Interface ---
// interface PointOfInterest {
//   name: string;
//   latitude: number;
//   longitude: number;
//   description?: string;
//   wiki?: string;
// }

// // --- Rover POI Constant ---
// const ROVER_POI: PointOfInterest = {
//   name: "Curiosity Rover",
//   latitude: -4.59,
//   longitude: 137.44,
//   description: "NASA's Curiosity rover is actively exploring Gale Crater. This car-sized rover has been investigating Mars since August 6, 2012, studying the planet's climate and geology. Click to zoom in and see detailed views of the rover and surrounding terrain.",
//   wiki: "https://en.wikipedia.org/wiki/Curiosity_(rover)"
// };

// // --- Example POIs for different planets ---
// const PLANET_POIS: Record<string, PointOfInterest[]> = {
//   Earth: [
//     { 
//       name: "North Pole", 
//       latitude: 90, 
//       longitude: 0, 
//       description: "The Arctic region, characterized by permanent ice cover and extreme cold, home to unique wildlife adapted to harsh conditions.",
//       wiki: "https://en.wikipedia.org/wiki/North_Pole"
//     },
//     { 
//       name: "Equator", 
//       latitude: 0, 
//       longitude: 0, 
//       description: "The Prime Meridian intersection with the Equator in the Atlantic Ocean, where latitude and longitude are both zero.",
//       wiki: "https://en.wikipedia.org/wiki/Equator"
//     },
//     { 
//       name: "Mount Everest", 
//       latitude: 27.9881, 
//       longitude: 86.9250, 
//       description: "Earth's highest mountain above sea level at 8,848.86 metres, located in the Himalayas on the border of Nepal and Tibet.",
//       wiki: "https://en.wikipedia.org/wiki/Mount_Everest"
//     },
//     { 
//       name: "New York", 
//       latitude: 40.7128, 
//       longitude: -74.0060, 
//       description: "The most populous city in the United States, a global center for finance, culture, and commerce.",
//       wiki: "https://en.wikipedia.org/wiki/New_York_City"
//     },
//   ],
//   Mars: [
//     { 
//       name: "Olympus Mons", 
//       latitude: 18.65, 
//       longitude: 226.2, 
//       description: "The largest volcano in the Solar System, standing 21.9 km high - nearly three times the height of Mount Everest. This shield volcano covers an area roughly the size of France.",
//       wiki: "https://en.wikipedia.org/wiki/Olympus_Mons"
//     },
//     { 
//       name: "Valles Marineris", 
//       latitude: -14, 
//       longitude: 301, 
//       description: "A vast canyon system that stretches over 4,000 km across Mars - about 10 times longer than Earth's Grand Canyon and up to 7 km deep.",
//       wiki: "https://en.wikipedia.org/wiki/Valles_Marineris"
//     },
//     { 
//       name: "North Polar Ice Cap", 
//       latitude: 85, 
//       longitude: 0, 
//       description: "A permanent ice cap made primarily of water ice and frozen carbon dioxide (dry ice), spanning about 1,000 km in diameter.",
//       wiki: "https://en.wikipedia.org/wiki/Martian_polar_ice_caps"
//     },
//     { 
//       name: "Curiosity Rover (Gale Crater)", 
//       latitude: -4.59, 
//       longitude: 137.44, 
//       description: "NASA's Curiosity rover landed here on August 6, 2012. The car-sized rover is exploring Gale Crater and Mount Sharp, studying Mars' climate and geology to understand if Mars ever had conditions suitable for life.",
//       wiki: "https://en.wikipedia.org/wiki/Curiosity_(rover)"
//     },
//   ],
//   Mercury: [
//     { 
//       name: "Caloris Basin", 
//       latitude: 30.5, 
//       longitude: 170.2, 
//       description: "One of the largest impact craters in the Solar System, about 1,550 km in diameter. The impact was so powerful it created hills on the opposite side of the planet.",
//       wiki: "https://en.wikipedia.org/wiki/Caloris_Basin"
//     },
//     { 
//       name: "North Pole", 
//       latitude: 90, 
//       longitude: 0, 
//       description: "Mercury's north polar region, which surprisingly contains water ice in permanently shadowed craters despite the planet's proximity to the Sun.",
//       wiki: "https://en.wikipedia.org/wiki/Mercury_(planet)#Polar_ice"
//     },
//   ],
//   Venus: [
//     { 
//       name: "Maxwell Montes", 
//       latitude: 65.2, 
//       longitude: 3.3, 
//       description: "The highest mountain on Venus at 11 km above the planet's mean radius, located in the Ishtar Terra highland region.",
//       wiki: "https://en.wikipedia.org/wiki/Maxwell_Montes"
//     },
//     { 
//       name: "Aphrodite Terra", 
//       latitude: -5, 
//       longitude: 104, 
//       description: "One of the largest highland regions on Venus, comparable in size to Africa. It contains some of the planet's most prominent volcanic features.",
//       wiki: "https://en.wikipedia.org/wiki/Aphrodite_Terra"
//     },
//   ],
// };

// // --- Camera Controller Component ---
// function CameraController({ 
//   targetPOI,
//   planetRadius = 3,
//   isRoverView = false,
//   onComplete 
// }: { 
//   targetPOI: PointOfInterest | null;
//   planetRadius?: number;
//   isRoverView?: boolean;
//   onComplete?: () => void;
// }) {
//   const { camera } = useThree();
//   const controlsRef = useRef<any>(null);
//   const animatingRef = useRef(false);
//   const previousPOIRef = useRef<PointOfInterest | null>(null);

//   useEffect(() => {
//     if (!controlsRef.current || animatingRef.current) return;

//     const poiChanged = previousPOIRef.current !== targetPOI;
//     if (!poiChanged) return;

//     previousPOIRef.current = targetPOI;
//     animatingRef.current = true;
//     const controls = controlsRef.current;

//     controls.enabled = false;

//     if (targetPOI) {
//       console.log('Animating to:', targetPOI.name);

//       const lookAtPosition = latLonToVector3(
//         targetPOI.latitude, 
//         targetPOI.longitude, 
//         planetRadius
//       );

//       const direction = lookAtPosition.clone().normalize();
//       const cameraDistance = isRoverView ? 2 : 4.5;
//       const cameraPos = direction.clone().multiplyScalar(cameraDistance);

//       gsap.to(camera.position, {
//         x: cameraPos.x,
//         y: cameraPos.y,
//         z: cameraPos.z,
//         duration: 2,
//         ease: "power2.inOut",
//       });

//       gsap.to(controls.target, {
//         x: lookAtPosition.x,
//         y: lookAtPosition.y,
//         z: lookAtPosition.z,
//         duration: 2,
//         ease: "power2.inOut",
//         onUpdate: () => {
//           controls.update();
//         },
//         onComplete: () => {
//           controls.enabled = true;
//           animatingRef.current = false;
//           console.log('Animation complete');
//           onComplete?.();
//         }
//       });
//     } else {
//       console.log('Resetting to default view');

//       gsap.to(camera.position, {
//         x: 0,
//         y: 0,
//         z: 10,
//         duration: 2,
//         ease: "power2.inOut",
//       });

//       gsap.to(controls.target, {
//         x: 0,
//         y: 0,
//         z: 0,
//         duration: 2,
//         ease: "power2.inOut",
//         onUpdate: () => {
//           controls.update();
//         },
//         onComplete: () => {
//           controls.enabled = true;
//           animatingRef.current = false;
//           console.log('Reset complete');
//           onComplete?.();
//         }
//       });
//     }

//   }, [targetPOI, camera, planetRadius, isRoverView, onComplete]);

//   return (
//     <DreiOrbitControls
//       ref={controlsRef}
//       enableZoom 
//       enablePan={false}
//       enableRotate 
//       minDistance={isRoverView ? 0 : 3.5}
//       maxDistance={15}
//       makeDefault
//     />
//   );
// }

// // --- Marker Component ---
// function LocationMarker({ position, label, color = "#ff0000", isSelected = false }: { 
//   position: THREE.Vector3;
//   label: string;
//   color?: string;
//   isSelected?: boolean;
// }) {
//   const markerRef = useRef<THREE.Mesh>(null);

//   useFrame((state) => {
//     if (markerRef.current && isSelected) {
//       markerRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3) * 0.2);
//     } else if (markerRef.current) {
//       markerRef.current.scale.setScalar(1);
//     }
//   });

//   return (
//     <group position={position}>
//       <mesh ref={markerRef}>
//         <sphereGeometry args={[0.08, 16, 16]} />
//         <meshStandardMaterial 
//           color={color} 
//           emissive={color} 
//           emissiveIntensity={isSelected ? 1.0 : 0.5} 
//         />
//       </mesh>
//       <mesh position={[0, 0.2, 0]}>
//         <cylinderGeometry args={[0.015, 0.015, 0.4]} />
//         <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
//       </mesh>
//     </group>
//   );
// }

// // --- Rover Model Component ---
// function RoverModel({ 
//   position, 
//   onRoverClick 
// }: { 
//   position: THREE.Vector3;
//   onRoverClick?: () => void;
// }) {
//   const roverRef = useRef<THREE.Group>(null);
//   const [hovered, setHovered] = useState(false);
  
//   const gltf = useGLTF('/models/Mars/Curiosity.glb');

//   useEffect(() => {
//     if (roverRef.current) {
//       const normalVector = position.clone().normalize();
//       roverRef.current.up.copy(normalVector);
//       roverRef.current.lookAt(position.clone().add(normalVector));
      
//       // ADD ROTATION ADJUSTMENTS HERE 
//       roverRef.current.rotateX(Math.PI / 2)
      
//       gltf.scene.traverse((child) => {
//         if ((child as THREE.Mesh).isMesh) {
//           const mesh = child as THREE.Mesh;
//           if (mesh.material) {
//             if (Array.isArray(mesh.material)) {
//               mesh.material.forEach(mat => {
//                 mat.needsUpdate = true;
//               });
//             } else {
//               mesh.material.needsUpdate = true;
//             }
//             mesh.castShadow = true;
//             mesh.receiveShadow = true;
//           }
//         }
//       });
//     }
//   }, [position, gltf]);

//   useFrame(() => {
//     if (roverRef.current) {
//       roverRef.current.rotateY(0.0001);
//     }
//   });

//   useEffect(() => {
//     document.body.style.cursor = hovered ? 'pointer' : 'auto';
//     return () => {
//       document.body.style.cursor = 'auto';
//     };
//   }, [hovered]);

//   return (
//     <group 
//       ref={roverRef} 
//       position={position}
//       onClick={(e) => {
//         e.stopPropagation();
//         onRoverClick?.();
//       }}
//       onPointerOver={(e) => {
//         e.stopPropagation();
//         setHovered(true);
//       }}
//       onPointerOut={(e) => {
//         e.stopPropagation();
//         setHovered(false);
//       }}
//     >
//       <primitive 
//         object={gltf.scene.clone()} 
//         scale={hovered ? 0.0165 : 0.015}
//       />
      
//       {hovered && (
//         <mesh rotation={[Math.PI / 1, 0, 0]} position={[0, 0, 0]}>
//           <ringGeometry args={[0.08, 0.1, 32]} />
//           <meshBasicMaterial 
//             color="#00ff00" 
//             transparent 
//             opacity={0.5} 
//             side={THREE.DoubleSide}
//           />
//         </mesh>
//       )}
//     </group>
//   );
// }

// // --- Planet Model Component ---
// function PlanetModel({ url }: { url: string }) {
//   const gltf = useGLTF(url);

//   useEffect(() => {
//     gltf.scene.traverse((child) => {
//       if ((child as THREE.Mesh).isMesh) {
//         const mesh = child as THREE.Mesh;
        
//         if (mesh.geometry) {
//           mesh.geometry.center();
//         }

//         if (mesh.material) {
//           if (Array.isArray(mesh.material)) {
//             mesh.material.forEach(material => {
//               material.needsUpdate = true;
//             });
//           } else {
//             mesh.material.needsUpdate = true;
//           }
//           mesh.castShadow = true;
//           mesh.receiveShadow = true;
//         }
//       }
//     });
//   }, [gltf]);

//   return <primitive object={gltf.scene} scale={3} position={[0, 0, 0]} />;
// }

// // --- Main Component ---
// const PlanetViewer = () => {
//   const { planets, loading, error } = usePlanets();
//   const [selectedPlanet, setSelectedPlanet] = useState(0);
//   const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
//   const [showMarkers, setShowMarkers] = useState(true);
//   const [showRover, setShowRover] = useState(true);
//   const [animating, setAnimating] = useState(false);
//   const [isRoverView, setIsRoverView] = useState(false);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
//         <div className="text-center space-y-4">
//           <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
//           <p className="text-purple-300 text-lg font-medium">Discovering planets...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
//         <div className="bg-red-950/50 border border-red-500/50 rounded-2xl p-8 backdrop-blur-sm max-w-md">
//           <p className="text-red-400 text-center">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   const planetsWithModels = planets.filter(planet => planet.model);

//   if (planetsWithModels.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
//         <p className="text-purple-400">No planet models available</p>
//       </div>
//     );
//   }

//   const currentPlanet = planetsWithModels[selectedPlanet];
//   const currentPOIs = PLANET_POIS[currentPlanet?.name] || [];

//   const handlePOIClick = (poi: PointOfInterest) => {
//     console.log('POI clicked:', poi.name);
//     setAnimating(true);
//     setSelectedPOI(poi);
//     setIsRoverView(false);
//   };

//   const handleRoverClick = () => {
//     console.log('Rover clicked!');
//     setAnimating(true);
//     setSelectedPOI(ROVER_POI);
//     setIsRoverView(true);
//   };

//   const resetView = () => {
//     console.log('Resetting view');
//     setAnimating(true);
//     setSelectedPOI(null);
//     setIsRoverView(false);
//   };

//   return (
//     <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
//       {/* Planet Navigation */}
//       <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-wrap justify-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full p-2 border border-purple-500/30 max-w-4xl">
//         {planetsWithModels.map((planet, index) => (
//           <button
//             key={planet.name}
//             onClick={() => {
//               setSelectedPlanet(index);
//               setSelectedPOI(null);
//               setAnimating(false);
//               setIsRoverView(false);
//             }}
//             className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
//               selectedPlanet === index
//                 ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
//                 : 'bg-slate-800/50 text-purple-300 hover:bg-slate-700/50'
//             }`}
//           >
//             {planet.name}
//           </button>
//         ))}
//       </div>

//       {/* Points of Interest Panel */}
//       {currentPOIs.length > 0 && (
//         <div className="absolute top-24 left-4 z-10 bg-slate-900/80 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 max-w-xs">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-lg font-bold text-purple-300">Points of Interest</h3>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setShowMarkers(!showMarkers)}
//                 className="text-xs px-2 py-1 bg-slate-700/50 rounded hover:bg-slate-600/50 text-purple-300"
//               >
//                 {showMarkers ? 'Hide' : 'Show'} Markers
//               </button>
//               {currentPlanet.name === "Mars" && (
//                 <button
//                   onClick={() => setShowRover(!showRover)}
//                   className="text-xs px-2 py-1 bg-slate-700/50 rounded hover:bg-slate-600/50 text-purple-300"
//                 >
//                   {showRover ? '🚗' : '🚫'} Rover
//                 </button>
//               )}
//             </div>
//           </div>
//           <div className="space-y-2 max-h-60 overflow-y-auto">
//             {currentPOIs.map((poi, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => handlePOIClick(poi)}
//                 disabled={animating}
//                 className={`w-full text-left p-3 rounded-lg transition-all ${
//                   selectedPOI?.name === poi.name
//                     ? 'bg-purple-600 text-white'
//                     : 'bg-slate-800/50 text-purple-300 hover:bg-slate-700/50'
//                 } disabled:opacity-50`}
//               >
//                 <div className="font-medium text-sm">{poi.name}</div>
//                 <div className="text-xs opacity-70 line-clamp-2">{poi.description}</div>
//                 <div className="text-xs opacity-50 mt-1">
//                   {poi.latitude.toFixed(2)}°, {poi.longitude.toFixed(2)}°
//                 </div>
//               </button>
//             ))}
//           </div>
//           <button
//             onClick={resetView}
//             disabled={animating || !selectedPOI}
//             className="mt-3 w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-purple-300 disabled:opacity-50"
//           >
//             Reset View
//           </button>
//         </div>
//       )}

//       {/* Enhanced Info Panel with Wikipedia Link */}
//       <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30 max-w-md">
//         <h2 className="text-2xl font-bold text-purple-300 mb-2">
//           {currentPlanet?.name}
//         </h2>
        
//         {selectedPOI ? (
//           <div className="mt-3 pt-3 border-t border-purple-500/30">
//             <div className="flex items-start justify-between mb-2">
//               <h3 className="text-lg font-semibold text-purple-200">
//                 {selectedPOI.name}
//               </h3>
//               {selectedPOI.wiki && (
//                 <a
//                   href={selectedPOI.wiki}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="ml-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 shrink-0"
//                 >
//                   Read More
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
//                   </svg>
//                 </a>
//               )}
//             </div>
            
//             <p className="text-sm text-purple-300 leading-relaxed mb-3">
//               {selectedPOI.description}
//             </p>
            
//             <div className="flex gap-2 text-xs text-purple-400 mb-3">
//               <span className="bg-slate-800/50 px-2 py-1 rounded">
//                 Lat: {selectedPOI.latitude.toFixed(2)}°
//               </span>
//               <span className="bg-slate-800/50 px-2 py-1 rounded">
//                 Lon: {selectedPOI.longitude.toFixed(2)}°
//               </span>
//             </div>
            
//             {isRoverView && (
//               <div className="mb-3 flex items-center gap-2 text-xs bg-green-900/30 p-2 rounded-lg border border-green-500/30">
//                 <span className="text-2xl animate-pulse">🚗</span>
//                 <div>
//                   <div className="text-green-400 font-semibold">Live Rover View</div>
//                   <div className="text-green-300 text-[10px]">Zoom and rotate to explore details</div>
//                 </div>
//               </div>
//             )}
            
//             <div className="flex items-center gap-2 text-xs text-purple-400 bg-slate-800/30 p-2 rounded-lg">
//               <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span>Use mouse wheel to zoom, drag to rotate around the point</span>
//             </div>
//           </div>
//         ) : (
//           <div className="mt-3 pt-3 border-t border-purple-500/30">
//             <p className="text-sm text-purple-400">
//               Select a point of interest to explore detailed information
//             </p>
//             {currentPlanet.name === "Mars" && showRover && (
//               <div className="mt-2 flex items-center gap-2 text-xs text-green-400 bg-green-900/20 p-2 rounded-lg">
//                 <span className="text-lg">🚗</span>
//                 <span>Click on Curiosity Rover to zoom in!</span>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* 3D Canvas */}
//       <Canvas 
//         camera={{ 
//           position: [0, 0, 10],
//           fov: 50 
//         }}
//         gl={{
//           antialias: true,
//           toneMapping: THREE.ACESFilmicToneMapping,
//           toneMappingExposure: 1.0,
//           outputColorSpace: THREE.SRGBColorSpace
//         }}
//       >
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
//         <directionalLight position={[-10, -10, -5]} intensity={0.5} />
//         <hemisphereLight
//           color={new THREE.Color(0xffffff)}
//           groundColor={new THREE.Color(0x444444)}
//           intensity={0.6}
//         />
        
//         <Suspense fallback={null}>
//           {currentPlanet?.model && (
//             <>
//               <PlanetModel url={currentPlanet.model} />
              
//               {showMarkers && currentPOIs.map((poi, idx) => (
//                 <LocationMarker
//                   key={idx}
//                   position={latLonToVector3(poi.latitude, poi.longitude, 3)}
//                   label={poi.name}
//                   color={selectedPOI?.name === poi.name ? "#00ff00" : "#ff0000"}
//                   isSelected={selectedPOI?.name === poi.name}
//                 />
//               ))}
              
//               {showRover && currentPlanet.name === "Mars" && (
//                 <RoverModel 
//                   position={latLonToVector3(-4.59, 137.44, 3)}
//                   onRoverClick={handleRoverClick}
//                 />
//               )}
//             </>
//           )}
//         </Suspense>
        
//         <CameraController
//           targetPOI={selectedPOI}
//           planetRadius={3}
//           isRoverView={isRoverView}
//           onComplete={() => setAnimating(false)}
//         />
        
//         <Environment preset="night" />
//       </Canvas>
//     </div>
//   );
// };

// export default PlanetViewer;

// app/astro-exposure/page.tsx

// 'use client';
// import React, { useState } from 'react';
// import { GoogleGenAI } from "@google/genai";
// import ReactMarkdown from 'react-markdown';

// function AstronomyChat() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const ai = new GoogleGenAI({
//     apiKey: "AIzaSyBxOPdPssI1e8osqqHZzY8ZmfwKCVNG_wk", // 🔑 Replace this
//   });

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const newMessage = { sender: "user", text: input };
//     setMessages((prev) => [...prev, newMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await ai.models.generateContent({
//         model: "gemini-2.5-pro",
//         contents: `
//           You are an astronomy expert.
//           Explain the term "${input}" in a concise, well-formatted markdown format.
//           Format should include:
//           - **Term Name**
//           - **Definition** (2-3 lines)
//           - **Key Facts** (bullet points)
//           - **Significance** (1-2 lines)
//           Keep it factual and avoid extra fluff.
//         `,
//       });

//       const text =
//         response?.text ||
//         response?.candidates?.[0]?.content?.parts?.[0]?.text ||
//         "Sorry, no response.";

//       const botMessage = { sender: "bot", text };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch (err) {
//       console.error(err);
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "⚠️ Something went wrong." },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-900 to-gray-800 text-white p-4">
//       <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col">
//         <h1 className="text-2xl font-semibold text-center mb-4 text-blue-400">
//           🔭 AstroBot — Learn Astronomy Terms
//         </h1>

//         <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[400px] scrollbar-thin scrollbar-thumb-gray-600">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`p-3 rounded-xl ${
//                 msg.sender === "user"
//                   ? "bg-blue-600 ml-auto text-right"
//                   : "bg-gray-700 text-left"
//               }`}
//             >
//               {msg.sender === "bot" ? (
//                 <ReactMarkdown
//                   components={{
//                     p: ({ children }) => (
//                       <p className="text-gray-200 leading-relaxed mb-2">{children}</p>
//                     ),
//                     strong: ({ children }) => (
//                       <strong className="text-blue-400 font-semibold">{children}</strong>
//                     ),
//                     ul: ({ children }) => (
//                       <ul className="list-disc ml-5 space-y-1 text-gray-300">{children}</ul>
//                     ),
//                     li: ({ children }) => (
//                       <li className="text-gray-300">{children}</li>
//                     ),
//                   }}
//                 >
//                   {msg.text}
//                 </ReactMarkdown>
//               ) : (
//                 msg.text
//               )}
//             </div>
//           ))}
//           {loading && (
//             <div className="text-gray-400 text-sm italic">Thinking...</div>
//           )}
//         </div>

//         <div className="flex items-center gap-2">
//           <input
//             type="text"
//             placeholder="Ask about any astronomy term..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSend()}
//             className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <button
//             onClick={handleSend}
//             disabled={loading}
//             className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AstronomyChat;

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaSun } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { GoogleGenAI } from '@google/genai';

type ChatMessage = { sender: 'user' | 'bot'; text: string; ts: number };

const STORAGE_KEY = 'astrobot_session_messages_v1';

export default function AstronomyChat() {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Restore from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {}
  }, []);

  // Persist to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const ai = useMemo(() => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || " ";
    console.log(key)
    return new GoogleGenAI({ apiKey: key });
  }, []);

  const send = async () => {
    const term = input.trim();
    if (!term || loading) return;

    const newMessage: ChatMessage = { sender: 'user', text: term, ts: Date.now() };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `
You are an astronomy expert.
Explain the term "${term}" in a concise, well-formatted markdown format.
Format should include:
- **Term Name**
- **Definition** (2-3 lines)
- **Key Facts** (bullet points)
- **Significance** (1-2 lines)
Keep it factual and avoid extra fluff.
        `,
      });

      const text =
        response?.text ||

        response?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'Sorry, no response.';

      const botMessage: ChatMessage = { sender: 'bot', text, ts: Date.now() };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      const botMessage: ChatMessage = { sender: 'bot', text: '⚠️ Something went wrong.', ts: Date.now() };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <>
      {/* Floating Sun Launcher */}
      <div
        className="fixed bottom-6 right-6 z-[60]"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {/* Tooltip left-above of icon */}
        {hover && (
          <div className="absolute -top-10 -left-4 translate-x-[-100%] bg-gray-900 text-white text-xs px-3 py-1 rounded-md shadow-lg pointer-events-none">
            Ask astronomy terms
          </div>
        )}
        <button
          aria-label="Open AstroBot"
          className="relative h-14 w-14 rounded-full bg-amber-400 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          onClick={() => setOpen(true)}
        >
          {/* Pulsing ring to hint interactivity */}
          <span className="absolute inset-0 rounded-full animate-ping bg-amber-300 opacity-30"></span>
          <FaSun className="relative text-white text-2xl drop-shadow" />
        </button>
      </div>

      {/* Right-side Modal / Drawer */}
      <div
        className={`fixed inset-0 z-[70] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        {/* Panel */}
        <aside
          className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-gray-900 text-white shadow-2xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col`}
          role="dialog"
          aria-modal="true"
          aria-label="AstroBot Chat"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <FaSun className="text-amber-300" />
              <h2 className="font-semibold">AstroBot — Terms</h2>
            </div>
            <button
              aria-label="Close"
              className="p-2 rounded hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div ref={listRef} className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {messages.map((m, i) => (
              <div key={m.ts + '_' + i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-gray-700 text-gray-100 rounded-bl-sm'
                  }`}
                >
                  {m.sender === 'bot' ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="leading-relaxed mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => <strong className="text-amber-300">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc ml-5 space-y-1">{children}</ul>,
                        li: ({ children }) => <li>{children}</li>,
                        h1: ({ children }) => <h1 className="text-lg font-semibold mb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-semibold mb-1">{children}</h2>,
                        code: ({ children }) => (
                          <code className="bg-black/30 rounded px-1 py-0.5">{children}</code>
                        ),
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  ) : (
                    <span className="whitespace-pre-wrap">{m.text}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <span className="text-xl animate-bounce">🛰️</span>
                    <span className="relative inline-flex items-center">
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-typing-dot"></span>
                      <span className="w-2 h-2 bg-gray-300 rounded-full mr-1 animate-typing-dot [animation-delay:120ms]"></span>
                      <span className="w-2 h-2 bg-gray-300 rounded-full animate-typing-dot [animation-delay:240ms]"></span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about any astronomy term..."
                className="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={send}
                disabled={loading || !input.trim()}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {/* History controls */}
            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
              <button
                className="hover:text-gray-200"
                onClick={() => {
                  if (confirm('Clear this session chat?')) {
                    setMessages([]);
                    try {
                      sessionStorage.removeItem(STORAGE_KEY);
                    } catch {}
                  }
                }}
              >
                Clear session chat
              </button>
              <span>Session saved</span>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/*
Tailwind config additions (tailwind.config.js):
module.exports = {
  theme: {
    extend: {
      keyframes: {
        typingdot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'typing-dot': 'typingdot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

Notes:
- The launcher uses Tailwind’s animate-ping and a tooltip positioned left-above. [web:13][web:3]
- Chat bubbles align end/start to mimic WhatsApp; see Tailwind chat bubble examples for variations. [web:3][web:11]
- sessionStorage is used to persist the current session; data clears on browser close. [web:9][web:20]
- Move your API key to NEXT_PUBLIC_GEMINI_API_KEY and rotate the exposed key. [web:20][web:12]
*/


