"use client";

import { motion } from "framer-motion";
import { Plus, Home, FileText, BarChart3, User } from "lucide-react";
import { useState } from "react";
import { QuickExpenseModal } from "@/components/input/quick-expense-modal";
import { GlassCard } from "@/components/ui/glass-card";

interface BottomNavProps {
  activeTab: 'home' | 'history' | 'charts' | 'profile';
  onTabChange: (tab: 'home' | 'history' | 'charts' | 'profile') => void;
}

export const BottomNav = ({ activeTab, onTabChange }: BottomNavProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
        <GlassCard className="flex justify-around items-center px-4 py-2.5 rounded-3xl border-white/5 shadow-[0_12px_44px_0_rgba(0,0,0,0.5)] bg-[#0c0f14]/80 backdrop-blur-xl">
          {/* Tab Home */}
          <button 
            onClick={() => onTabChange('home')} 
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'home' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title="Dashboard"
          >
            <Home size={20} />
          </button>

          {/* Tab Histórico */}
          <button 
            onClick={() => onTabChange('history')} 
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'history' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title="Histórico"
          >
            <FileText size={20} />
          </button>

          {/* Botão de Adicionar (Central) */}
          <div className="-mt-8 relative">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsModalOpen(true)}
              className="relative w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_4px_20px_0_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 rounded-full bg-white blur-md opacity-20 -z-10 animate-pulse" />
              <Plus size={24} className="stroke-[3]" />
            </motion.button>
          </div>

          {/* Tab Gráficos */}
          <button 
            onClick={() => onTabChange('charts')} 
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'charts' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title="Estatísticas"
          >
            <BarChart3 size={20} />
          </button>

          {/* Tab Perfil / Sair */}
          <button 
            onClick={() => onTabChange('profile')} 
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'profile' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title="Perfil"
          >
            <User size={20} />
          </button>
        </GlassCard>
      </div>

      <QuickExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
