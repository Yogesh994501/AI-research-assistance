"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import type { Paper } from "@/types";
import { useResearchStore } from "@/store/researchStore";

interface CitationNodeProps {
  paper: Paper;
  index: number;
  position: [number, number, number];
}

export default function CitationNode({ paper, index, position }: CitationNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { selectedPaper, setSelectedPaper } = useResearchStore();

  const isSelected = selectedPaper?.id === paper.id;

  // Scale node based on citation count / relevance
  const baseScale = Math.min(0.8, Math.max(0.3, 0.25 + Math.log10(paper.citationCount + 1) * 0.15));

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() + index;
    // Gentle floating bob
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.12;

    if (hovered || isSelected) {
      meshRef.current.rotation.y += 0.03;
    }
  });

  const nodeColor = isSelected ? "#06b6d4" : hovered ? "#38bdf8" : "#818cf8";
  const emissiveColor = isSelected ? "#0891b2" : hovered ? "#0284c7" : "#4f46e5";

  return (
    <group position={position}>
      {/* 3D Sphere Node */}
      <mesh
        ref={meshRef}
        scale={isSelected ? baseScale * 1.3 : hovered ? baseScale * 1.15 : baseScale}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPaper(paper);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 1.2 : hovered ? 0.9 : 0.4}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Floating Citation Badge Number Label */}
      <Text
        position={[0, baseScale + 0.35, 0]}
        fontSize={0.28}
        color={isSelected ? "#22d3ee" : "#e0e7ff"}
        anchorX="center"
        anchorY="middle"
      >
        {`[${index + 1}]`}
      </Text>

      {/* Title label on hover or selection */}
      {(hovered || isSelected) && (
        <Text
          position={[0, -(baseScale + 0.4), 0]}
          fontSize={0.22}
          maxWidth={4}
          color="#f8fafc"
          anchorX="center"
          anchorY="top"
          textAlign="center"
        >
          {paper.title.slice(0, 45) + (paper.title.length > 45 ? "..." : "")}
        </Text>
      )}
    </group>
  );
}
