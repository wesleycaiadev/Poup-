"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { useExpenseStore } from "@/hooks/use-expense-store";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { User, Mail, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { userName, userAvatar } = useExpenseStore();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-1"
      >
        <span className="text-sm text-white/50">Sua Conta</span>
        <h1 className="text-3xl font-black mt-1 text-white">Perfil</h1>
      </motion.div>

      {/* Card de Perfil */}
      <GlassCard className="p-6 bg-gradient-to-br from-accent/5 to-transparent border-accent/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent/30 shadow-lg">
            <img
              src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{userName}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Mail size={12} className="text-white/40" />
              <p className="text-xs text-white/40">{user?.email || ''}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Informações da Conta */}
      <GlassCard className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
            <User size={18} className="text-white/60" />
          </div>
          <div>
            <p className="text-xs text-white/40">Membro desde</p>
            <p className="text-sm font-bold text-white">
              {user?.created_at
                ? new Intl.DateTimeFormat('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  }).format(new Date(user.created_at))
                : '—'}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* Botão de Logout */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={signOut}
        className="w-full py-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-500/20 transition-colors"
      >
        <LogOut size={18} />
        Sair da Conta
      </motion.button>
    </div>
  );
}
