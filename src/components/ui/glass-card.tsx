"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard = ({ children, className, onClick }: GlassCardProps) => {
  return (
    <motion.div
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        "relative rounded-3xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]",
        onClick && "cursor-pointer active:bg-[rgba(255,255,255,0.05)]",
        className
      )}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      {children}
    </motion.div>
  );
};
