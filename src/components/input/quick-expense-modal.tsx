"use client";

import { useState } from "react";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { Keypad } from "./keypad";
import { CATEGORIES } from "@/constants/categories";
import { CategoryId } from "@/types/expense";
import { useExpenseStore } from "@/hooks/use-expense-store";
import { formatCurrency } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import * as Icons from "lucide-react";

interface QuickExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickExpenseModal = ({ isOpen, onClose }: QuickExpenseModalProps) => {
  const [amountStr, setAmountStr] = useState("0");
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [description, setDescription] = useState("");
  const addExpense = useExpenseStore((state) => state.addExpense);

  const handleAddDigit = (digit: string) => {
    if (amountStr === "0" && digit !== "00") {
      setAmountStr(digit);
    } else if (amountStr !== "0") {
      setAmountStr((prev) => prev + digit);
    }
  };

  const handleDelete = () => {
    setAmountStr((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const handleConfirm = () => {
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0 || !selectedCategory) return;

    addExpense({
      amount,
      category: selectedCategory,
      description: description.trim() || CATEGORIES[selectedCategory].label,
    });

    setAmountStr("0");
    setSelectedCategory(null);
    setDescription("");
    onClose();
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-5">
        {/* Display do Valor Centralizado (Gigante) */}
        <div className="text-center py-4 relative">
          <div className="absolute inset-x-0 top-2 h-20 bg-accent/5 blur-[40px] rounded-full pointer-events-none" />
          <p className="text-4xl font-extralight text-white/90 tracking-tight">
            {formatCurrency(parseFloat(amountStr) || 0)}
          </p>
        </div>

        {/* Lista de Categorias Minimalista (Borda Redonda Fina) */}
        <div className="flex gap-4 overflow-x-auto pb-2 px-2 scrollbar-none">
          {Object.values(CATEGORIES).map((category) => {
            const IconComponent = (Icons as any)[category.icon] || Icons.HelpCircle;
            const isSelected = selectedCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="flex flex-col items-center gap-2 min-w-[70px]"
              >
                <div
                  className={cn(
                    "p-3 rounded-full border transition-all aspect-square flex items-center justify-center w-12 h-12",
                    isSelected
                      ? `border-white bg-white/10 text-white`
                      : `border-white/10 bg-transparent hover:bg-white/5 text-white/40`
                  )}
                >
                  <IconComponent size={20} />
                </div>
                <span className={cn("text-[11px] font-light", isSelected ? "text-white" : "text-white/40")}>
                  {category.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Input Descrição */}
        <div className="px-2">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição (Opcional)"
            className="w-full bg-white/3 border border-white/5 rounded-xl p-3 text-center text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/10 transition-colors"
          />
        </div>

        {/* Keypad Minimal */}
        <Keypad
          onAddDigit={handleAddDigit}
          onDelete={handleDelete}
          className="mx-auto max-w-sm"
        />

        {/* Confirmar */}
        <button
          onClick={handleConfirm}
          disabled={!selectedCategory || parseFloat(amountStr) <= 0}
          className={cn(
            "w-full py-4 rounded-xl font-medium text-center transition-all text-base shadow-lg",
            selectedCategory && parseFloat(amountStr) > 0
              ? "bg-white text-black hover:bg-white/90 active:scale-[0.98]"
              : "bg-white/10 text-white/30 cursor-not-allowed"
          )}
        >
          Confirmar
        </button>
      </div>
    </BottomSheet>
  );
};
