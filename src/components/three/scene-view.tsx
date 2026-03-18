"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { motion as motionDom } from "framer-motion";

interface SceneViewProps {
  children: React.ReactNode;
}

const SceneView = ({ children }: SceneViewProps) => {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <motionDom.div
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-purple-500 flex items-center justify-center shadow-lg border border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="8" cy="16" r="5"/><circle cx="16" cy="8" r="5"/><path d="m11.5 12.5-3.5 3.5"/><path d="M11.5 12.5 15 9"/></svg>
        </motionDom.div>
        <p className="text-xs text-white/40 mt-3 font-medium">Modo Economia / Sem WebGL</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <pointLight position={[10, 10, 10]} intensity={2.5} />
        <directionalLight position={[-5, 5, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          {children}
          <Environment preset="city" />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
};

export default SceneView;
[1/1]
