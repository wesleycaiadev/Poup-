"use client";

import { motion } from "framer-motion";
import { Delete } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeypadProps {
  onAddDigit: (digit: string) => void;
  onDelete: () => void;
  className?: string;
}

export const Keypad = ({ onAddDigit, onDelete, className }: KeypadProps) => {
  const triggerHaptic = (type: "light" | "success") => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      if (type === "light") {
        navigator.vibrate(50);
      } else {
        navigator.vibrate([30, 50, 30]);
      }
    }
  };

  const handleDigit = (digit: string) => {
    triggerHaptic("light");
    onAddDigit(digit);
  };

  const handleDelete = () => {
    triggerHaptic("light");
    onDelete();
  };

  const buttons = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "00", "0", "delete"
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-y-1 gap-x-4 p-4", className)}>
      {buttons.map((btn, index) => {
        if (btn === "delete") {
          return (
            <motion.button
              key={index}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className="flex items-center justify-center py-5 rounded-2xl bg-transparent hover:bg-white/5 active:bg-white/10 text-white/80 text-3xl font-light transition-all"
            >
              <Delete size={28} />
            </motion.button>
          );
        }

        return (
          <motion.button
            key={index}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDigit(btn)}
            className="flex items-center justify-center py-5 rounded-2xl bg-transparent hover:bg-white/5 active:bg-white/10 text-white text-3xl font-light transition-all"
          >
            {btn}
          </motion.button>
        );
      })}
    </div>
  );
};
