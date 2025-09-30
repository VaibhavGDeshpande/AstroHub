"use client";

import React, { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Fixed stationary model (e.g. Sun)
// Fixed stationary model (Sun) with geometry centered
function FixedModel({ url, position, onClick, scale = [1, 1, 1] }) {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Center all meshes inside the GLB so pivot is in the middle
    gltf.scene.traverse((child: any) => {
      if (child.isMesh) {
        child.geometry.center();
      }
    });
  }, [gltf]);

  return (
    <group ref={groupRef} position={position} onClick={onClick} scale={scale}>
      <primitive object={gltf.scene} />
    </group>
  );
}


// Orbit path (yellow circle)
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
      <lineBasicMaterial attach="material" color="yellow" linewidth={2} />
    </line>
  );
}

function RevolvingModel({
  url,
  center,
  radius,
  speed,
  onClick,
  refCallback,
}) {
  const gltf = useGLTF(url);
  const ref = useRef<THREE.Object3D>(null);
  const angle = useRef(0);

  useFrame(() => {
    if (!ref.current) return;

    // Keep angle bounded [0, 2π]
    angle.current = (angle.current + speed) % (Math.PI * 2);

    // Orbit around center in XZ plane
    const x = center.x + radius * Math.cos(angle.current);
    const z = center.z + radius * Math.sin(angle.current);
    ref.current.position.set(x, center.y, z);

    // Self-rotation
    ref.current.rotation.y += 0.002;
  });

  useEffect(() => {
    if (ref.current && refCallback) refCallback(ref.current);
  }, [refCallback]);

  return <primitive object={gltf.scene} ref={ref} onClick={onClick} />;
}

// Dynamic OrbitControls (focuses on active object)
function Controls({ targetObject }) {
  const controls = useRef<any>();
  const { camera, gl } = useThree();

  useFrame(() => {
    if (targetObject && controls.current) {
      controls.current.target.copy(targetObject.position);
      controls.current.update();
    }
  });

  return <OrbitControls ref={controls} args={[camera, gl.domElement]} />;
}

export default function RevolveRotateFocus() {
  const [activeModel, setActiveModel] = useState<string>("fixed");
  const fixedPosition = new THREE.Vector3(0, 0, 0);
  const revolvingRef = useRef<THREE.Object3D | null>(null);

  const getTargetObject = () => {
    if (activeModel === "fixed") {
      const dummy = new THREE.Object3D();
      dummy.position.copy(fixedPosition);
      return dummy;
    } else if (activeModel === "revolve") {
      return revolvingRef.current;
    }
    return null;
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 5, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />

        <Suspense fallback={null}>
          {/* Sun (Fixed Model) */}
          <FixedModel
            url="/SampleData/PlanetModels/the_sun.glb"
            position={[0, 0, 0]}
            scale={[2, 2, 2]}   // big sun
            onClick={() => setActiveModel("fixed")}
          />

          {/* Mercury (Revolving Model) */}
          <RevolvingModel
            url="/SampleData/PlanetModels/mercury.glb"
            center={fixedPosition}
            radius={50} // ✅ must match OrbitPath
            speed={0.001}
            onClick={() => setActiveModel("revolve")}
            refCallback={(ref) => {
              revolvingRef.current = ref;
            }}
          />

          {/* Orbit Path */}
          <OrbitPath center={fixedPosition} radius={50} />
        </Suspense>

        {/* Camera Controls */}
        <Controls targetObject={getTargetObject()} />
      </Canvas>
    </div>
  );
}
