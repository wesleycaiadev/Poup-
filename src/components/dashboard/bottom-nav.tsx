"use client";

import { motion } from "framer-motion";
import { Plus, Home, FileText, BarChart3, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { QuickExpenseModal } from "@/components/input/quick-expense-modal";
import { GlassCard } from "@/components/ui/glass-card";

const tabs = [
  { id: 'home', href: '/', icon: Home, label: 'Dashboard' },
  { id: 'history', href: '/history', icon: FileText, label: 'Histórico' },
  { id: 'charts', href: '/charts', icon: BarChart3, label: 'Estatísticas' },
  { id: 'profile', href: '/profile', icon: User, label: 'Perfil' },
] as const;

export const BottomNav = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === '/history') return 'history';
    if (pathname === '/charts') return 'charts';
    if (pathname === '/profile') return 'profile';
    return 'home';
  };

  const activeTab = getActiveTab();

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
        <GlassCard className="flex justify-around items-center px-4 py-2.5 rounded-3xl border-white/5 shadow-[0_12px_44px_0_rgba(0,0,0,0.5)] bg-[#0c0f14]/80 backdrop-blur-xl">
          {/* Tab Home */}
          <Link
            href={tabs[0].href}
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'home' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title={tabs[0].label}
          >
            <Home size={20} />
          </Link>

          {/* Tab Histórico */}
          <Link
            href={tabs[1].href}
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'history' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title={tabs[1].label}
          >
            <FileText size={20} />
          </Link>

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
          <Link
            href={tabs[2].href}
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'charts' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title={tabs[2].label}
          >
            <BarChart3 size={20} />
          </Link>

          {/* Tab Perfil */}
          <Link
            href={tabs[3].href}
            className={`p-2.5 rounded-xl transition-colors ${activeTab === 'profile' ? 'text-accent' : 'text-white/40 hover:text-white/60'}`}
            title={tabs[3].label}
          >
            <User size={20} />
          </Link>
        </GlassCard>
      </div>

      <QuickExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
