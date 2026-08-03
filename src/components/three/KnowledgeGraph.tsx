'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useResearchStore } from '@/store/researchStore';
import GraphNode3D from './GraphNode3D';
import ConnectionLine from './ConnectionLine';

export default function KnowledgeGraph() {
  const nodes = useResearchStore((s) => s.nodes);
  const edges = useResearchStore((s) => s.edges);
  
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle overall rotation
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Render Edges */}
      {edges.map((edge) => (
        <ConnectionLine
          key={edge.id}
          sourceNodeId={edge.source}
          targetNodeId={edge.target}
          strength={edge.strength}
        />
      ))}

      {/* Render Nodes */}
      {nodes.map((node) => (
        <GraphNode3D key={node.id} node={node} />
      ))}
    </group>
  );
}
