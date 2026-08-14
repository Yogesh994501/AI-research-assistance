"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls as DreiOrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";
import { useResearchStore } from "@/store/researchStore";

export default function CameraController() {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { selectedPaper, papers } = useResearchStore();

  const targetVec = useRef(new THREE.Vector3(0, 0, 10));

  useEffect(() => {
    if (!selectedPaper || papers.length === 0) {
      targetVec.current.set(0, 0, 10);
      return;
    }

    const index = papers.findIndex((p) => p.id === selectedPaper.id);
    if (index === -1) return;

    // Calculate node position based on Fibonacci lattice
    const total = papers.length;
    const radius = 5.5;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (index / Math.max(1, total - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;

    const x = Math.cos(theta) * radiusAtY * radius;
    const z = Math.sin(theta) * radiusAtY * radius;
    const posY = y * (radius * 0.7);

    // Zoom in toward selected node
    targetVec.current.set(x * 1.35, posY * 1.35, z * 1.35 + 2.5);
  }, [selectedPaper, papers]);

  useFrame(() => {
    // Smooth camera lerping
    camera.position.lerp(targetVec.current, 0.05);
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={25}
      dampingFactor={0.05}
    />
  );
}
