'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import * as THREE from 'three';
import ParticleField from './ParticleField';
import KnowledgeGraph from './KnowledgeGraph';
import AgentStateOrb from './AgentStateOrb';
import { useResearchStore } from '@/store/researchStore';

function CameraController() {
  const { camera } = useThree();
  const targetPos = useResearchStore((s) => s.targetCameraPosition);
  const activeNodeId = useResearchStore((s) => s.activeNodeId);

  useFrame((_, delta) => {
    if (targetPos && activeNodeId) {
      const targetVec = new THREE.Vector3(...targetPos);
      camera.position.lerp(targetVec, delta * 3);
    }
  });

  return null;
}

export default function ResearchCanvas() {
  return (
    <div className="absolute inset-0 z-0 bg-[#030712]">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 16]} fov={50} />
        <CameraController />
        
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxDistance={45}
          minDistance={2}
        />
        
        <ambientLight intensity={0.3} />
        <pointLight position={[12, 12, 12]} intensity={1.2} color="#ffffff" />
        <pointLight position={[-12, -12, -12]} intensity={0.6} color="#a855f7" />

        <AgentStateOrb />
        <ParticleField />
        <KnowledgeGraph />

        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.4} />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
