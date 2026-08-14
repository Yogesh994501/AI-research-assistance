"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useResearchStore } from "@/store/researchStore";
import type { AgentState } from "@/types";

const STATE_COLORS: Record<AgentState, { primary: string; emissive: string; distort: number; speed: number }> = {
  idle: { primary: "#52525b", emissive: "#27272a", distort: 0.2, speed: 1.0 },
  searching: { primary: "#06b6d4", emissive: "#0891b2", distort: 0.5, speed: 3.5 },
  synthesizing: { primary: "#a855f7", emissive: "#7e22ce", distort: 0.7, speed: 4.5 },
  complete: { primary: "#22c55e", emissive: "#15803d", distort: 0.3, speed: 1.5 },
  error: { primary: "#ef4444", emissive: "#b91c1c", distort: 0.8, speed: 6.0 },
};

export default function AgentStateOrb() {
  const { agentState } = useResearchStore();
  const orbRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const cfg = STATE_COLORS[agentState] || STATE_COLORS.idle;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (orbRef.current) {
      orbRef.current.rotation.y = t * 0.4;
      orbRef.current.rotation.x = t * 0.2;
    }
    if (glowRef.current) {
      const scale = 1.15 + Math.sin(t * cfg.speed) * 0.08;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Central Distorted Reactive Sphere */}
      <Sphere ref={orbRef} args={[1.2, 64, 64]}>
        <MeshDistortMaterial
          color={cfg.primary}
          emissive={cfg.emissive}
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.8}
          distort={cfg.distort}
          speed={cfg.speed}
        />
      </Sphere>

      {/* Ambient Pulsing Glow Mesh */}
      <Sphere ref={glowRef} args={[1.35, 32, 32]}>
        <meshBasicMaterial
          color={cfg.primary}
          transparent
          opacity={0.12}
          wireframe
        />
      </Sphere>
    </group>
  );
}
