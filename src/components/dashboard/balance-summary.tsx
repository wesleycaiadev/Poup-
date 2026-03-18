"use client";

import { useExpenseStore } from "@/hooks/use-expense-store";
import { formatCurrency } from "@/lib/formatters";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";

export const BalanceSummary = () => {
  const { expenses, budget, setBudget } = useExpenseStore();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = budget - totalExpenses;

  const [mounted, setMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(budget.toString());

  useEffect(() => {
    setMounted(true);
    setTempBudget(budget.toString());
  }, [budget]);

  const handleSave = () => {
    const parsed = parseFloat(tempBudget);
    if (!isNaN(parsed) && parsed >= 0) {
      setBudget(parsed);
      setIsEditing(false);
    }
  };

  if (!mounted) {
    return <div className="h-32 bg-white/3 rounded-2xl animate-pulse" />;
  }

  return (
    <div className="space-y-4">
      {/* Saldo Principal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-1"
      >
        <span className="text-sm text-white/50">Saldo Disponível</span>
        <h1 className="text-4xl font-black tracking-tight mt-1 text-white">
          {formatCurrency(balance)}
        </h1>
      </motion.div>

      {/* Grid de Resumo */}
      <div className="grid grid-cols-2 gap-4">
        {/* Salário (Editável) */}
        <GlassCard className="p-4 bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/10 relative group">
          <div className="flex justify-between items-center">
            <span className="text-xs text-white/50">Salário</span>
            {!isEditing && (
              <button
                onClick={() => {
                  setTempBudget(budget.toString());
                  setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-full bg-white/5 hover:bg-white/10 transition-all"
              >
                <Edit2 size={12} className="text-white/60" />
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="flex items-center gap-1 mt-1">
              <input
                type="number"
                value={tempBudget}
                onChange={(e) => setTempBudget(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg p-1 text-base font-black text-white focus:outline-none"
                autoFocus
              />
              <button onClick={handleSave} className="p-1 text-emerald-400">
                <Check size={16} />
              </button>
              <button onClick={() => setIsEditing(false)} className="p-1 text-rose-400">
                <X size={16} />
              </button>
            </div>
          ) : (
            <p className="text-xl font-black text-emerald-400 mt-1">
              {formatCurrency(budget)}
            </p>
          )}
        </GlassCard>

        {/* Saídas */}
        <GlassCard className="p-4 bg-gradient-to-br from-rose-500/5 to-transparent border-rose-500/10">
          <span className="text-xs text-white/50">Saídas</span>
          <p className="text-xl font-black text-rose-400 mt-1">
            {formatCurrency(totalExpenses)}
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
[1/1]
