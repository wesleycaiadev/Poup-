"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { useExpenseStore } from '@/hooks/use-expense-store';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    // Buscar sessão atual
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile(session.user.id);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('name, avatar, salary')
        .eq('user_id', userId)
        .single();

      if (data) {
        useExpenseStore.getState().setProfile(data.name, data.avatar || '');
        useExpenseStore.getState().setBudget(data.salary || 0);
      }
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    }
  };

  const signOut = async () => {
    try {
      // 1. Limpa cookies no servidor via API para garantir remoção
      await fetch('/api/auth/clear-session', { method: 'POST' });
      // 2. Limpa no client
      await supabase.auth.signOut();
      
      setUser(null);
      setSession(null);
      useExpenseStore.getState().setProfile('', '');
      
      // Forçar reload hard para limpar cache
      window.location.href = '/login';
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
