"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';
import { Mail, Lock, User, ArrowRight, Camera, Eye, EyeOff } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ERROR_MESSAGES: Record<string, string> = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'Confirme seu e-mail antes de fazer login.',
  'User already registered': 'Este e-mail já está cadastrado.',
  'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
  'Signup requires a valid password': 'Informe uma senha válida.',
  'Unable to validate email address: invalid format': 'Formato de e-mail inválido.',
  'Email rate limit exceeded': 'Muitas tentativas. Aguarde alguns minutos.',
  'auth_callback_failed': 'Erro na confirmação do e-mail. Tente novamente.',
};

function translateError(message: string): string {
  return ERROR_MESSAGES[message] || message;
}

export const LoginView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(searchParams.get('error') ? translateError(searchParams.get('error')!) : '');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  const supabase = getSupabaseBrowserClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('A imagem deve ter menos de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;
        router.push('/');
        router.refresh();
      } else {
        const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || email.split('@')[0])}&background=6366f1&color=fff`;
        
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              name: name || email.split('@')[0],
              avatar: avatar || defaultAvatar,
            }
          }
        });
        
        if (signUpError) throw signUpError;
        setSuccess('Conta criada! Verifique sua caixa de entrada (ou spam) para confirmar o e-mail.');
        // Limpar os campos após criar a conta
        setEmail('');
        setPassword('');
        setName('');
        setAvatar('');
      }
    } catch (err: any) {
      setError(translateError(err.message || 'Ocorreu um erro inesperado.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#090b0e] px-4 overflow-y-auto py-10">
      <div className="fixed top-1/4 left-1/4 w-80 h-80 bg-accent/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md my-auto"
      >
        <GlassCard className="p-8 border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">
              {isLogin ? 'Bem-vindo de volta' : 'Criar Conta'}
            </h1>
            <p className="text-sm text-white/50">
              {isLogin
                ? 'Acesse seus gastos e controle suas finanças.'
                : 'Comece a organizar seu dinheiro de forma inteligente.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs text-center font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Nome</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                    required={!isLogin}
                    maxLength={50}
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs text-white/60 ml-1">E-mail</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-white/60 ml-1">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white focus:outline-none focus:border-accent/40 transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs text-white/60 ml-1">Foto de Perfil (Opcional, Máx 5MB)</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatar-upload"
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="w-full bg-white/5 border border-white/10 border-dashed rounded-xl py-3 px-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    {avatar ? (
                      <div className="flex items-center gap-2">
                        <img src={avatar} alt="Preview" className="w-8 h-8 rounded-full object-cover border border-accent/50" />
                        <span className="text-xs text-white/80">Alterar foto selecionada</span>
                      </div>
                    ) : (
                      <>
                        <Camera size={16} className="text-white/40" />
                        <span className="text-xs text-white/60">Escolher foto do dispositivo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent/90 text-black font-bold h-11 rounded-xl flex items-center justify-center gap-2 mt-6 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-xs text-accent hover:underline font-medium"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
            </button>
          </div>

        </GlassCard>
      </motion.div>
    </div>
  );
};
