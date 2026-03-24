"use client";

import { useExpenseStore } from "@/hooks/use-expense-store";
import { formatCurrency } from "@/lib/formatters";
import { CATEGORIES } from "@/constants/categories";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";

export const ChartsView = () => {
  const { expenses, budget } = useExpenseStore();
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = budget - totalExpenses;

  // Agrupar por categoria
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const categories = Object.entries(categoryTotals).map(([id, amount]) => ({
    id,
    amount,
    label: CATEGORIES[id]?.label || id.charAt(0).toUpperCase() + id.slice(1),
    color: CATEGORIES[id]?.color || 'bg-slate-500',
  }));

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-1"
      >
        <span className="text-sm text-white/50">Análise do Mês</span>
        <h1 className="text-3xl font-black mt-1 text-white">Estatísticas</h1>
      </motion.div>

      {/* Visão de Sobra */}
      <GlassCard className="p-5 bg-gradient-to-br from-indigo-500/5 to-transparent border-indigo-500/10">
        <span className="text-xs text-white/60">Sobrou no Mês</span>
        <p className={`text-3xl font-black mt-1 ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {formatCurrency(balance)}
        </p>
        <div className="w-full h-2 bg-white/5 rounded-full mt-4 overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (totalExpenses / budget) * 100)}%` }}
            className={`h-full ${totalExpenses > budget ? 'bg-rose-500' : 'bg-emerald-500'}`}
          />
        </div>
        <div className="flex justify-between text-xxs text-white/40 mt-1">
          <span>Gastou {((totalExpenses / budget) * 100).toFixed(0)}%</span>
          <span>Salário {formatCurrency(budget)}</span>
        </div>
      </GlassCard>

      {/* Gráfico de Categorias (Barras Simples e Lindas) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white/80 ml-1">Gastos por Categoria</h3>
        <GlassCard className="p-4 space-y-4">
          {categories.length === 0 ? (
            <p className="text-center text-sm text-white/40 py-8">Nenhum gasto registrado ainda.</p>
          ) : (
            categories.map((cat, index) => (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/80">{cat.label}</span>
                  <span className="font-bold text-white">{formatCurrency(cat.amount)}</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.amount / totalExpenses) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    className={`h-full ${cat.color} rounded-full`}
                  />
                </div>
              </div>
            ))
          )}
        </GlassCard>
      </div>
    </div>
  );
};
