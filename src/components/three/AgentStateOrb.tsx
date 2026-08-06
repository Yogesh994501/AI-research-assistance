'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResearchStore } from '@/store/researchStore';

export default function AgentStateOrb() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const innerMeshRef = useRef<THREE.Mesh>(null!);

  const agentState = useResearchStore((s) => s.agentState);

  // Dynamic visual configurations based on agentState
  const getColor = () => {
    switch (agentState) {
      case 'searching': return { color: '#a855f7', emissive: '#c084fc', speed: 2.5 }; // Fast violet
      case 'synthesizing': return { color: '#eab308', emissive: '#fde047', speed: 1.8 }; // Gold/amber
      case 'complete': return { color: '#22c55e', emissive: '#4ade80', speed: 0.8 }; // Emerald pulse
      default: return { color: '#06b6d4', emissive: '#38bdf8', speed: 0.5 }; // Soft cyan idle
    }
  };

  const { color, emissive, speed } = getColor();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Rotate outer wireframe sphere
    meshRef.current.rotation.x += delta * speed * 0.4;
    meshRef.current.rotation.y += delta * speed * 0.6;

    // Pulsate inner sphere
    if (innerMeshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * speed * 3) * 0.15;
      innerMeshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 4, 0]}>
      {/* Outer Wireframe Icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={agentState === 'searching' ? 2.5 : 1.2}
          wireframe
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Inner Glowing Core Sphere */}
      <mesh ref={innerMeshRef}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={agentState === 'searching' ? 3 : 1.8}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}
