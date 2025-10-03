"use client";

import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Background component
function Background({ url }: { url: string }) {
  const { scene } = useThree();
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(url, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
    });
  }, [scene, url]);
  return null;
}

// Fixed Model (e.g. Sun)
interface FixedModelProps {
  url: string;
  position: [number, number, number];
  scale?: [number, number, number];
  name: string;
  onFocus: (object: THREE.Object3D, name: string) => void;
}

function FixedModel({ url, position, scale = [1, 1, 1], name, onFocus }: FixedModelProps) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.center();
        }
        mesh.userData.clickable = true;

        // Fix material rendering issues
        if (mesh.material) {
          mesh.material.needsUpdate = true;
          // Enable shadows if needed
          mesh.castShadow = true;
          mesh.receiveShadow = true;
        }
      }
    });

    console.log(`Loaded ${name} model:`, gltf.scene);
  }, [gltf, name]);

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta <= 2 && groupRef.current) {
          onFocus(groupRef.current, name);
        }
      }}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

interface OrbitPathProps {
  center: THREE.Vector3;
  radius: number;
  pointOffsets?: THREE.Vector3[];
}

function OrbitPath({ center, radius, pointOffsets }: OrbitPathProps) {
  const points = useMemo(() => {
    const segments = 128;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      const x = center.x + radius * Math.cos(theta);
      const z = center.z + radius * Math.sin(theta);
      const base = new THREE.Vector3(x, center.y, z);
      // Add offset if exists
      if (pointOffsets && pointOffsets[i]) {
        base.add(pointOffsets[i]);
      }
      pts.push(base);
    }
    return pts;
  }, [center, radius, pointOffsets]);

  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints(points),
    [points]
  );

  return (
    <line geometry={geometry}>
      <lineBasicMaterial attach="material" color="white" linewidth={2} />
    </line>
  );
}

interface RevolvingModelProps {
  url: string;
  center: THREE.Vector3;
  radius: number;
  speed: number;
  scale?: [number, number, number];
  name: string;
  onFocus: (object: THREE.Object3D, name: string) => void;
}

function RevolvingModel({
  url,
  center,
  radius,
  speed,
  scale = [1, 1, 1],
  name,
  onFocus,
}: RevolvingModelProps) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const angle = useRef(0);

  useFrame(() => {
    if (!groupRef.current) return;
    // Orbit around center
    angle.current = (angle.current + speed) % (Math.PI * 2);
    const x = center.x + radius * Math.cos(angle.current);
    const z = center.z + radius * Math.sin(angle.current);
    groupRef.current.position.set(x, center.y, z);

    // Rotate around own axis
    gltf.scene.rotation.y += 0.00001;
  });

  useEffect(() => {
    // Make all meshes in the model clickable and fix rendering
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.userData.clickable = true;

        // Fix material rendering issues
        if (mesh.material) {
          mesh.material.needsUpdate = true;
          // Enable shadows if needed
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Fix common texture/material issues
          const material = mesh.material as THREE.MeshStandardMaterial;
          if (material.map) {
            material.map.needsUpdate = true;
          }
        }
      }
    });

    console.log(`Loaded ${name} model at radius ${radius}:`, gltf.scene);
  }, [gltf, name, radius]);

  return (
    <group
      ref={groupRef}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        if (e.delta <= 2 && groupRef.current) {
          onFocus(groupRef.current, name);
        }
      }}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}

// Dynamic OrbitControls that follows the focused planet
interface ControlsProps {
  focusedObject: THREE.Object3D | null;
}

function Controls({ focusedObject }: ControlsProps) {
  const controls = useRef<any>();
  const { camera } = useThree();
  const isUserInteracting = useRef(false);

  useEffect(() => {
    if (focusedObject && controls.current) {
      // Calculate bounding box to get the actual center of the model
      const boundingBox = new THREE.Box3().setFromObject(focusedObject);
      const center = boundingBox.getCenter(new THREE.Vector3());
      const size = boundingBox.getSize(new THREE.Vector3());

      // Get the maximum dimension of the object
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);

      // Calculate camera distance to fit the object in view
      const cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 0.6;

      // Get current camera direction or use default
      const currentDirection = new THREE.Vector3()
        .subVectors(camera.position, center)
        .normalize();

      // If camera is too close to target, use a default direction
      if (currentDirection.length() < 0.1) {
        currentDirection.set(0, 0.5, 1).normalize();
      }

      // Calculate new camera position
      const newCameraPos = new THREE.Vector3()
        .copy(center)
        .add(currentDirection.multiplyScalar(cameraDistance));

      // Smoothly move camera to new position
      const startPos = camera.position.clone();
      const startTarget = controls.current.target.clone();
      let progress = 0;

      const animateCamera = () => {
        progress += 0.05;
        if (progress < 1) {
          camera.position.lerpVectors(startPos, newCameraPos, progress);
          controls.current.target.lerpVectors(startTarget, center, progress);
          controls.current.update();
          requestAnimationFrame(animateCamera);
        } else {
          camera.position.copy(newCameraPos);
          controls.current.target.copy(center);
          controls.current.update();
        }
      };

      animateCamera();

      console.log(`Focusing on object at:`, center);
      console.log(`Camera distance:`, cameraDistance);
    }
  }, [focusedObject, camera]);

  useFrame(() => {
    if (!focusedObject || !controls.current || isUserInteracting.current) return;

    // Only update target to follow the object's center, don't move the camera
    const boundingBox = new THREE.Box3().setFromObject(focusedObject);
    const currentCenter = boundingBox.getCenter(new THREE.Vector3());

    // Calculate the delta (how much the object moved)
    const delta = new THREE.Vector3().subVectors(
      currentCenter,
      controls.current.target
    );

    // Move both target and camera by the same delta to maintain relative position
    controls.current.target.add(delta);
    camera.position.add(delta);

    controls.current.update();
  });

  // Track when user is interacting with controls
  useEffect(() => {
    if (!controls.current) return;

    const handleStart = () => {
      isUserInteracting.current = true;
    };

    const handleEnd = () => {
      isUserInteracting.current = false;
    };

    const currentControls = controls.current;
    currentControls.addEventListener("start", handleStart);
    currentControls.addEventListener("end", handleEnd);

    return () => {
      currentControls?.removeEventListener("start", handleStart);
      currentControls?.removeEventListener("end", handleEnd);
    };
  }, []);

  return (
    <OrbitControls
      ref={controls}
      enablePan={true}
      enableZoom={true}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}

export default function RevolveRotateFocus() {
  const [focusedObject, setFocusedObject] = useState<THREE.Object3D | null>(null);
  const fixedPosition = new THREE.Vector3(0, 0, 0);

  const handleFocus = (object: THREE.Object3D, name: string) => {
    setFocusedObject(object);
    console.log(`Focused on: ${name}`);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [0, 50, 200], fov: 60 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace
        }}
      >
        {/* Enhanced lighting for better model visibility */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        <hemisphereLight
          color={new THREE.Color(0xffffff)}
          groundColor={new THREE.Color(0x444444)}
          intensity={0.6}
        />

        <Suspense fallback={null}>
          {/* 🌌 Background */}
          <Background url="/SampleData/PlanetModels/milkyway.jpg" />

          {/* Sun */}
          <FixedModel
            url="/SampleData/PlanetModels/the_sun.glb"
            position={[0, 0, 0]}
            scale={[50, 50, 50]}
            name="Sun"
            onFocus={handleFocus}
          />

          {/* Mercury */}
          <RevolvingModel
            url="/SampleData/PlanetModels/mercury.glb"
            center={fixedPosition}
            radius={70}
            speed={0}
            scale={[2, 2, 2]}
            name="Mercury"
            onFocus={handleFocus}
          />

          {/* Venus */}
          <RevolvingModel
            url="/SampleData/PlanetModels/venus.glb"
            center={fixedPosition}
            radius={100}
            speed={0}
            scale={[2.5, 2.5, 2.5]}
            name="Venus"
            onFocus={handleFocus}
          />

          {/* Earth */}
          <RevolvingModel
            url="/SampleData/PlanetModels/earth (2).glb"
            center={fixedPosition}
            radius={150}
            speed={0}
            scale={[3, 3, 3]}
            name="Earth"
            onFocus={handleFocus}
          />

          {/* Mars */}
          <RevolvingModel
            url="/SampleData/PlanetModels/mars.glb"
            center={fixedPosition}
            radius={180}
            speed={0}
            scale={[2, 2, 2]}
            name="Mars"
            onFocus={handleFocus}
          />

          {/* Jupiter */}
          <RevolvingModel
            url="/SampleData/PlanetModels/jupiter.glb"
            center={fixedPosition}
            radius={260}
            speed={0}
            scale={[10, 10, 10]}
            name="Jupiter"
            onFocus={handleFocus}
          />

          {/* Saturn */}
          <RevolvingModel
            url="/SampleData/PlanetModels/saturn.glb"
            center={fixedPosition}
            radius={380}
            speed={0}
            scale={[8, 8, 8]}
            name="Saturn"
            onFocus={handleFocus}
          />

          {/*Neptune*/}
          <RevolvingModel
            url="/SampleData/PlanetModels/uranus.glb"
            center={fixedPosition}
            radius={500}
            speed={0}
            scale={[0.01, 0.01, 0.01]}
            name="Neptune"
            onFocus={handleFocus}
          />

          {/*Neptune*/}
          <RevolvingModel
            url="/SampleData/PlanetModels/neptune.glb"
            center={fixedPosition}
            radius={600}
            speed={0}
            scale={[0.3, 0.3, 0.3]}
            name="Neptune"
            onFocus={handleFocus}
          />

          {/* Orbits */}
          <OrbitPath
            center={fixedPosition}
            radius={73}
            pointOffsets={Array(129).fill(new THREE.Vector3(-0.5, 1.5, 0))}
          />

          <OrbitPath
            center={fixedPosition}
            radius={103}
            pointOffsets={Array(129).fill(new THREE.Vector3(0, 2, 0))}
          />

          <OrbitPath
            center={fixedPosition}
            radius={153}
            pointOffsets={Array(129).fill(new THREE.Vector3(1, 2.5, 0))}
          />

          <OrbitPath
            center={fixedPosition}
            radius={183}
            pointOffsets={Array(129).fill(new THREE.Vector3(-3, 2.5, 0))}
          />

          <OrbitPath
            center={fixedPosition}
            radius={280}
            pointOffsets={Array(129).fill(new THREE.Vector3(-9, 8, 0))}
          />

          <OrbitPath
            center={fixedPosition}
            radius={380}
            pointOffsets={Array(129).fill(new THREE.Vector3(0, 0, 0))}
          />

          <OrbitPath
            center={fixedPosition}
            radius={500}
            pointOffsets={Array(129).fill(new THREE.Vector3(0.5, 0.2, 0))}
          />

          <OrbitPath
            center={fixedPosition}
            radius={600}
            pointOffsets={Array(129).fill(new THREE.Vector3(0, 0, 0))}
          />

          <Controls focusedObject={focusedObject} />
        </Suspense>
      </Canvas>
    </div>
  );
}