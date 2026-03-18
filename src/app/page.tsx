"use client";

import { BalanceSummary } from "@/components/dashboard/balance-summary";
import { ExpenseList } from "@/components/dashboard/expense-list";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { HistoryView } from "@/components/dashboard/history-view";
import { ChartsView } from "@/components/dashboard/charts-view";
import { MoodEmoji } from "@/components/three/mood-emoji";
import { useExpenseStore } from "@/hooks/use-expense-store";
import { Search, Bell, LogOut } from "lucide-react";
import dynamic from "next/dynamic";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { LoginView } from "@/components/auth/login-view";

const SceneView = dynamic(() => import("@/components/three/scene-view"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-white/10 border-t-white/30 rounded-full animate-spin" />
    </div>
  ),
});

export default function Home() {
  const { userName, userAvatar, setProfile } = useExpenseStore();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'history' | 'charts' | 'profile'>('home');

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
      setLoading(false);
    });

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar, salary')
        .eq('user_id', userId)
        .single();

      if (data) {
        setProfile(data.name, data.avatar || '');
        // Se quiser salvar o budget também:
        useExpenseStore.getState().setBudget(data.salary || 0);
      }
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#090b0e] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  return (
    <main className="min-h-screen bg-[#090b0e] text-white px-4 pt-8 pb-32 relative overflow-hidden">
      {/* Glow Effects de Fundo */}
      <div className="absolute -top-40 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-[100px] -z-10" />
      <div className="absolute top-60 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-md mx-auto space-y-7">
        {/* Header High Fidelity */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-accent/30 shadow-md">
              <img
                src={userAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"}
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
              onClick={() => supabase.auth.signOut()}
              className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/10 hover:bg-rose-500/20 transition-colors"
              title="Sair"
            >
              <LogOut size={18} className="text-rose-400" />
            </button>
          </div>
        </div>

        {activeTab === 'home' && (
          <>
            {/* Card de Saldo */}
            <BalanceSummary />

            {/* Elemento Central 3D (Emoji Reativo) */}
            <div className="relative h-56 w-56 mx-auto group">
              {/* Plataforma Isométrica Glassmorphism sutil no fundo */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-44 h-10 bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-[50%] backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] pointer-events-none" />
              
              <SceneView>
                <MoodEmoji />
              </SceneView>
            </div>

            {/* Lista de Gastos */}
            <ExpenseList />
          </>
        )}

        {activeTab === 'history' && <HistoryView />}
        {activeTab === 'charts' && <ChartsView />}
        {activeTab === 'profile' && (
          <div className="text-center py-10 text-white/60">
            <p>Configurações do Perfil (Em desenvolvimento)</p>
            <button 
              onClick={() => supabase.auth.signOut()}
              className="mt-4 px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-400 text-sm"
            >
              Sair da Conta
            </button>
          </div>
        )}

        {/* Navegação Inferior */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </main>
  );
}
