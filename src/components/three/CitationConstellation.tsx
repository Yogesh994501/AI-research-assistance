"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useResearchStore } from "@/store/researchStore";
import CitationNode from "./CitationNode";

export default function CitationConstellation() {
  const { papers } = useResearchStore();

  // Compute 3D Fibonacci spiral positions for paper nodes
  const { nodes, linePositions } = useMemo(() => {
    const total = papers.length;
    const computedNodes: Array<{ position: [number, number, number]; index: number }> = [];
    const lines: number[] = [];

    if (total === 0) return { nodes: computedNodes, linePositions: new Float32Array() };

    const radius = 5.5;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < total; i++) {
      const y = 1 - (i / Math.max(1, total - 1)) * 2; // from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY * radius;
      const z = Math.sin(theta) * radiusAtY * radius;
      const posY = y * (radius * 0.7);

      computedNodes.push({ position: [x, posY, z], index: i });
    }

    // Connect sequential and nearby neighbors with subtle lines
    for (let i = 0; i < computedNodes.length; i++) {
      // Connect to next node in relevance
      if (i + 1 < computedNodes.length) {
        const p1 = computedNodes[i].position;
        const p2 = computedNodes[i + 1].position;
        lines.push(p1[0], p1[1], p1[2], p2[0], p2[1], p2[2]);
      }
      // Connect to root orb if top 3
      if (i < 3) {
        const p = computedNodes[i].position;
        lines.push(0, 0, 0, p[0], p[1], p[2]);
      }
    }

    return {
      nodes: computedNodes,
      linePositions: new Float32Array(lines),
    };
  }, [papers]);

  return (
    <group>
      {/* Constellation Connection Lines */}
      {linePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[linePositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.25}
            blending={THREE.AdditiveBlending}
          />
        </lineSegments>
      )}

      {/* 3D Paper Nodes */}
      {nodes.map((node) => (
        <CitationNode
          key={papers[node.index].id}
          paper={papers[node.index]}
          index={node.index}
          position={node.position}
        />
      ))}
    </group>
  );
}
