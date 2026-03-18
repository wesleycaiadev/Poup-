"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group } from "three";
import { useExpenseStore } from "@/hooks/use-expense-store";

export const MoodEmoji = () => {
  const groupRef = useRef<Group>(null);

  const { expenses, budget } = useExpenseStore();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingPercent = budget > 0 ? ((budget - totalExpenses) / budget) * 100 : 0;

  // Lógica de humor
  let mood: "happy" | "neutral" | "worried" | "panic" = "happy";
  if (remainingPercent >= 80) mood = "happy";
  else if (remainingPercent >= 50) mood = "neutral";
  else if (remainingPercent >= 30) mood = "worried";
  else mood = "panic";

  useFrame((state) => {
    if (groupRef.current) {
      // Pequeno balanço
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.08;
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime()) * 0.12;
    }
  });

  const getMoodColor = () => {
    switch (mood) {
      case "happy": return "#f59e0b"; // Amarelo Vibrante
      case "neutral": return "#eab308"; // Amarelo Neutro
      case "worried": return "#ea580c"; // Laranja
      case "panic": return "#dc2626"; // Vermelho
    }
  };

  return (
    <group ref={groupRef}>
      {/* Corpo / Cabeça */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshPhysicalMaterial
          color={getMoodColor()}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Olhos - FORA DA ESFERA (Z > 0.7) */}
      <group position={[0, 0.15, 0.71]}>
        <mesh position={[-0.22, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#111827" />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#111827" />
        </mesh>
      </group>

      {/* Boca - FORA DA ESFERA (Z > 0.7) */}
      <group position={[0, -0.15, 0.71]}>
        {mood === "happy" && (
          <mesh rotation={[0, 0, Math.PI]}> {/* Curva para cima */}
            <torusGeometry args={[0.16, 0.04, 8, 24, Math.PI]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
        )}
        {(mood === "neutral" || mood === "worried") && (
          <mesh>
            <boxGeometry args={[0.25, 0.03, 0.02]} /> {/* Um pouco maior e visível */}
            <meshBasicMaterial color="#111827" />
          </mesh>
        )}
        {mood === "panic" && (
          <mesh rotation={[0, 0, 0]}> {/* Curva para baixo */}
            <torusGeometry args={[0.16, 0.04, 8, 24, Math.PI]} />
            <meshBasicMaterial color="#111827" />
          </mesh>
        )}
      </group>
    </group>
  );
};
