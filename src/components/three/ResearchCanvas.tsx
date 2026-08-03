'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import ParticleField from './ParticleField';
import KnowledgeGraph from './KnowledgeGraph';

export default function ResearchCanvas() {
  return (
    <div className="absolute inset-0 z-0 bg-[#030712]"> {/* tailwind gray-950 */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          autoRotate={false}
          maxDistance={40}
          minDistance={2}
        />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

        <ParticleField />
        <KnowledgeGraph />

        <EffectComposer enableNormalPass={false}>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
          <ToneMapping />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
