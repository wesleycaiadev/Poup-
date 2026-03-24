"use client";

import { BalanceSummary } from "@/components/dashboard/balance-summary";
import { ExpenseList } from "@/components/dashboard/expense-list";
import { MoodEmoji } from "@/components/three/mood-emoji";
import dynamic from "next/dynamic";

const SceneView = dynamic(() => import("@/components/three/scene-view"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
    </div>
  ),
});

export default function HomePage() {
  return (
    <>
      {/* Card de Saldo */}
      <BalanceSummary />

      {/* Elemento Central 3D (Emoji Reativo) */}
      <div className="relative h-56 w-56 mx-auto group">
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-10 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[50%] backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] pointer-events-none" />
        <SceneView>
          <MoodEmoji />
        </SceneView>
      </div>

      {/* Lista de Gastos */}
      <ExpenseList />
    </>
  );
}
