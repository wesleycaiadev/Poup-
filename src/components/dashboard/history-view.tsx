"use client";

import { useExpenseStore } from "@/hooks/use-expense-store";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar } from "lucide-react";

export const HistoryView = () => {
  const { expenses } = useExpenseStore();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Filtrar despesas
  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear;
  });

  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-1"
      >
        <span className="text-sm text-white/50">Registro de Gastos</span>
        <h1 className="text-3xl font-black mt-1 text-white">Histórico</h1>
      </motion.div>

      {/* Seletor de Mês */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {months.map((m, index) => (
          <button
            key={m}
            onClick={() => setSelectedMonth(index)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border border-white/5 transition-all
              ${selectedMonth === index 
                ? 'bg-accent text-black scale-105 shadow-lg' 
                : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredExpenses.length === 0 ? (
          <GlassCard className="p-8 text-center text-white/40 text-sm">
            Nenhum gasto encontrado para {months[selectedMonth]}.
          </GlassCard>
        ) : (
          filteredExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GlassCard className="p-4 flex justify-between items-center border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/5`}>
                    <Calendar size={18} className="text-white/60" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{expense.description}</h3>
                    <p className="text-xxs text-white/40">{formatDate(expense.date)}</p>
                  </div>
                </div>
                <p className="text-sm font-black text-rose-400">
                  - {formatCurrency(expense.amount)}
                </p>
              </GlassCard>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};
