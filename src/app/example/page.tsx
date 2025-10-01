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
function FixedModel({ url, position, scale = [1, 1, 1], name, onFocus }) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.geometry.center();
        child.userData.clickable = true;

        // Fix material rendering issues
        if (child.material) {
          child.material.needsUpdate = true;
          // Enable shadows if needed
          child.castShadow = true;
          child.receiveShadow = true;
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

function OrbitPath({ center, radius }: { center: THREE.Vector3; radius: number }) {
  const points = useMemo(() => {
    const segments = 128;
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      const x = center.x + radius * Math.cos(theta);
      const z = center.z + radius * Math.sin(theta);
      pts.push(new THREE.Vector3(x, center.y, z));
    }
    return pts;
  }, [center, radius]);

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

function RevolvingModel({
  url,
  center,
  radius,
  speed,
  scale = [1, 1, 1],
  name,
  onFocus,
}) {
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
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.userData.clickable = true;

        // Fix material rendering issues
        if (child.material) {
          child.material.needsUpdate = true;
          // Enable shadows if needed
          child.castShadow = true;
          child.receiveShadow = true;

          // Fix common texture/material issues
          if (child.material.map) {
            child.material.map.needsUpdate = true;
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
function Controls({ focusedObject }) {
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

    controls.current.addEventListener("start", handleStart);
    controls.current.addEventListener("end", handleEnd);

    return () => {
      controls.current?.removeEventListener("start", handleStart);
      controls.current?.removeEventListener("end", handleEnd);
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
          skyColor={new THREE.Color(0xffffff)}
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
            scale={[10, 10, 10]}
            name="Sun"
            onFocus={handleFocus}
          />

          {/* Mercury */}
          <RevolvingModel
            url="/SampleData/PlanetModels/mercury.glb"
            center={fixedPosition}
            radius={50}
            speed={0}
            scale={[2, 2, 2]}
            name="Mercury"
            onFocus={handleFocus}
          />

          {/* Venus */}
          <RevolvingModel
            url="/SampleData/PlanetModels/venus.glb"
            center={fixedPosition}
            radius={90}
            speed={0}
            scale={[3, 3, 3]}
            name="Venus"
            onFocus={handleFocus}
          />

        
          {/* Orbits */}
          <OrbitPath center={fixedPosition} radius={50} />
          <OrbitPath center={fixedPosition} radius={90} />

          <Controls focusedObject={focusedObject} />
        </Suspense>
      </Canvas>
    </div>
  );
}
