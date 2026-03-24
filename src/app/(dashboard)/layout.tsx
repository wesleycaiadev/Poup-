"use client";

import { AuthProvider, useAuth } from '@/components/providers/auth-provider';
import { BottomNav } from '@/components/dashboard/bottom-nav';
import { Search, Bell, LogOut } from 'lucide-react';
import { useExpenseStore } from '@/hooks/use-expense-store';

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useAuth();
  const { userName, userAvatar } = useExpenseStore();

  return (
    <main className="min-h-screen bg-[#090b0e] text-white px-4 pt-8 pb-32 relative overflow-hidden">
      {/* Glow Effects de Fundo */}
      <div className="absolute -top-40 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-60 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md mx-auto space-y-7">
        {/* Header */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-accent/30 shadow-md">
              <img
                src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs text-white/40">Bem-vindo de volta,</span>
              <p className="font-bold tracking-tight text-white/90 text-base">{userName}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors">
              <Search size={18} className="text-white/60" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5 hover:bg-white/10 transition-colors">
              <Bell size={18} className="text-white/60" />
            </button>
            <button
              onClick={signOut}
              className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/10 hover:bg-rose-500/20 transition-colors"
              title="Sair"
            >
              <LogOut size={18} className="text-rose-400" />
            </button>
          </div>
        </div>

        {/* Conteúdo da Página */}
        {children}

        {/* Navegação Inferior */}
        <BottomNav />
      </div>
    </main>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </AuthProvider>
  );
}
