"use client";

import { useState } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { useExpenseStore } from "@/hooks/use-expense-store";
import { getSupabaseBrowserClient } from "@/lib/supabase-browser";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { User, Mail, LogOut, Camera, Save, Loader2 } from "lucide-react";

// Limite aumentado para 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; 

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { userName, userAvatar, setProfile } = useExpenseStore();
  const supabase = getSupabaseBrowserClient();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editAvatar, setEditAvatar] = useState(userAvatar);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('A imagem deve ter menos de 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditAvatar(reader.result as string);
        setError(""); // Limpa o erro se a imagem for válida
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    if (!editName.trim()) {
      setError("O nome não pode ficar vazio.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // 1. Atualizar no Supabase Profiles
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: editName,
          avatar: editAvatar,
          updated_at: new Date().toISOString(),
        });

      if (dbError) throw dbError;

      // 2. Atualizar user_metadata no Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { name: editName, avatar: editAvatar }
      });

      if (authError) throw authError;

      // 3. Atualizar Zustand Store local
      setProfile(editName, editAvatar);
      
      setSuccess("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao atualizar o perfil. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditName(userName);
    setEditAvatar(userAvatar);
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=6366f1&color=fff`;

  return (
    <div className="space-y-6 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-1 flex justify-between items-end"
      >
        <div>
          <span className="text-sm text-white/50">Sua Conta</span>
          <h1 className="text-3xl font-black mt-1 text-white">Perfil</h1>
        </div>
        {!isEditing && (
          <button 
            onClick={() => {
              setIsEditing(true);
              setSuccess("");
              setError("");
            }}
            className="text-accent text-sm font-semibold hover:text-accent/80 transition-colors"
          >
            Editar
          </button>
        )}
      </motion.div>

      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
          {success}
        </div>
      )}

      <GlassCard className="p-6 bg-gradient-to-br from-accent/5 to-transparent border-accent/10">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-accent/30 shadow-lg bg-white/5 flex-shrink-0">
              <img
                src={(isEditing ? editAvatar : userAvatar) || defaultAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            
            {isEditing && (
              <label 
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-accent/90 transition-transform active:scale-95 z-10"
              >
                <Camera size={14} className="text-black" />
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>
          
          <div className="flex-1 min-w-[200px]">
            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full bg-white/10 border border-white/20 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-accent/50"
                  maxLength={50}
                />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-white truncate">{userName || 'Usuário'}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <Mail size={12} className="text-white/40" />
                  <p className="text-xs text-white/40 truncate">{user?.email || 'email@não.encontrado'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={cancelEdit}
              className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={loading}
              className="flex-1 py-2.5 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-black transition-colors"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar
            </button>
          </div>
        )}
      </GlassCard>

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
