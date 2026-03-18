"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const BottomSheet = ({ isOpen, onClose, children, title }: BottomSheetProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[#0c0f14] border-t border-[rgba(255,255,255,0.08)] rounded-t-[32px] z-50 p-6 safe-area-bottom shadow-[0_-10px_40px_0_rgba(0,0,0,0.5)]"
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-center mb-6">
              {title && <h2 className="text-xl font-bold">{title}</h2>}
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Fechar"
              >
                <X size={20} className="text-white/70" />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[75vh]">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
