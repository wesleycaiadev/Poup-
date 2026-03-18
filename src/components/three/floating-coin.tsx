"use client";

import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

export const FloatingCoin = () => {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime()) * 0.2;
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => {
        setHovered(true);
        if (typeof document !== "undefined") document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        if (typeof document !== "undefined") document.body.style.cursor = "default";
      }}
      scale={hovered ? 1.15 : 1}
      rotation={[Math.PI / 2, 0, 0]} // Deita o cilindro para parecer uma moeda
    >
      <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
      <meshPhysicalMaterial
        color="#fbbf24" // Ouro/Dourado
        roughness={0.1}
        metalness={0.9} // Visual altamente metálico
        clearcoat={1}
      />
    </mesh>
  );
};
