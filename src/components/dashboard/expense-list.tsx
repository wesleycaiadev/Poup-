"use client";

import { useExpenseStore } from "@/hooks/use-expense-store";
import { CATEGORIES } from "@/constants/categories";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

export const ExpenseList = () => {
  const expenses = useExpenseStore((state) => state.expenses);

  if (expenses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
          <Icons.Inbox size={28} className="text-white/40" />
        </div>
        <p className="text-white/60 font-semibold">Nenhum gasto registrado</p>
        <p className="text-white/30 text-sm mt-1">Toque no "+" para adicionar</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3 pb-24"> {/* Bottom padding para o botão flutuante */}
      <h2 className="text-sm font-semibold text-white/50 px-1">Últimos Gastos</h2>
      <div className="space-y-2">
        <AnimatePresence>
          {expenses.map((expense) => {
            const category = CATEGORIES[expense.category];
            const IconComponent = (Icons as any)[category?.icon || 'HelpCircle'] || Icons.HelpCircle;

            return (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                <GlassCard className="p-4 flex items-center justify-between border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2.5 rounded-2xl shadow-inner", category?.color || 'bg-slate-500')}>
                      <IconComponent size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">{expense.description}</p>
                      <p className="text-xs text-white/40 mt-0.5">{formatDate(expense.date)}</p>
                    </div>
                  </div>
                  <p className="font-black text-rose-400 text-lg">
                    -{formatCurrency(expense.amount)}
                  </p>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
