"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import ParticleField from "./ParticleField";
import AgentStateOrb from "./AgentStateOrb";
import CitationConstellation from "./CitationConstellation";
import CameraController from "./CameraController";

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#38bdf8" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#a855f7" />

      {/* Ambient Particle Field */}
      <ParticleField count={200} />

      {/* Central Agent Orb */}
      <AgentStateOrb />

      {/* 3D Citation Constellation of retrieved papers */}
      <CitationConstellation />

      {/* Smooth Camera Controller */}
      <CameraController />
    </>
  );
}

export default function ResearchCanvas() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950/80">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
