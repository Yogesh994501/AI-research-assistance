'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useResearchStore } from '@/store/researchStore';

interface ConnectionLineProps {
  sourceNodeId: string;
  targetNodeId: string;
  strength: number;
}

export default function ConnectionLine({ sourceNodeId, targetNodeId, strength }: ConnectionLineProps) {
  const nodes = useResearchStore((s) => s.nodes);
  const activeNodeId = useResearchStore((s) => s.activeNodeId);
  const hoveredNodeId = useResearchStore((s) => s.hoveredNodeId);

  const sourceNode = nodes.find((n) => n.id === sourceNodeId);
  const targetNode = nodes.find((n) => n.id === targetNodeId);

  const isActive = activeNodeId === sourceNodeId || activeNodeId === targetNodeId;
  const isHovered = hoveredNodeId === sourceNodeId || hoveredNodeId === targetNodeId;

  const points = useMemo(() => {
    if (!sourceNode || !targetNode) return [];
    return [
      [sourceNode.x, sourceNode.y, sourceNode.z] as [number, number, number],
      [targetNode.x, targetNode.y, targetNode.z] as [number, number, number]
    ];
  }, [sourceNode, targetNode]);

  if (!sourceNode || !targetNode || points.length !== 2) return null;

  return (
    <Line
      points={points}
      color={isActive ? '#a855f7' : isHovered ? '#06b6d4' : '#6366f1'}
      lineWidth={isActive ? 2 : 1}
      transparent
      opacity={isActive ? 0.8 : isHovered ? 0.6 : Math.max(0.15, strength * 0.4)}
    />
  );
}
