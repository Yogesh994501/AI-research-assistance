'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useResearchStore } from '@/store/researchStore';
import type { GraphNode } from '@/types';

interface GraphNode3DProps {
  node: GraphNode;
}

export default function GraphNode3D({ node }: GraphNode3DProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  
  const selectNode = useResearchStore((s) => s.selectNode);
  const hoverNode = useResearchStore((s) => s.hoverNode);
  const activeNodeId = useResearchStore((s) => s.activeNodeId);

  const isActive = activeNodeId === node.id;
  const targetScale = isActive || hovered ? 1.5 : 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    
    // Smooth scaling
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    
    // Subtle rotation
    meshRef.current.rotation.x += delta * 0.2;
    meshRef.current.rotation.y += delta * 0.3;
  });

  const getGeometryArgs = () => {
    switch (node.type) {
      case 'query': return [0.8, 32, 32] as const; // Sphere
      case 'concept': return [0.5, 1] as const;   // Icosahedron
      case 'source': return [0.4, 32, 32] as const; // Sphere
      case 'document': return [0.6, 0] as const;  // Dodecahedron
      default: return [0.5, 32, 32] as const;
    }
  };

  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          selectNode(node.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          hoverNode(node.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setHovered(false);
          hoverNode(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {node.type === 'concept' ? (
          <icosahedronGeometry args={getGeometryArgs() as [number, number]} />
        ) : node.type === 'document' ? (
          <dodecahedronGeometry args={getGeometryArgs() as [number, number]} />
        ) : (
          <sphereGeometry args={getGeometryArgs() as [number, number, number]} />
        )}
        
        <meshStandardMaterial
          color={node.color || '#fff'}
          emissive={node.color || '#fff'}
          emissiveIntensity={isActive ? 2 : hovered ? 1 : 0.5}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* HTML Tooltip Overlay */}
      <Html distanceFactor={15} center zIndexRange={[100, 0]} style={{ pointerEvents: 'none' }}>
        <div 
          className={`px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/10 transition-all duration-300 whitespace-nowrap
            ${hovered || isActive ? 'opacity-100 translate-y-[-30px]' : 'opacity-0 translate-y-0'}
            ${node.type === 'query' ? 'bg-cyan-500/20 text-cyan-100' : 
              node.type === 'concept' ? 'bg-violet-500/20 text-violet-100' :
              node.type === 'document' ? 'bg-yellow-500/20 text-yellow-100' :
              'bg-green-500/20 text-green-100'}
          `}
        >
          <div className="text-xs font-medium tracking-wide drop-shadow-md">
            {node.label}
          </div>
        </div>
      </Html>
    </group>
  );
}
