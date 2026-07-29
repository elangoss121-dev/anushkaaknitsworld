"use client";

import React from "react";
import { useShop } from "@/context/ShopContext";
import { CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Toast: React.FC = () => {
  const { toastMessage } = useShop();

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#111111] dark:bg-[#1A1A1A] text-white px-5 py-3.5 rounded-full shadow-2xl border border-[#C8A24D]/30 backdrop-blur-md"
        >
          <CheckCircle2 className="w-5 h-5 text-[#C8A24D] shrink-0 animate-bounce" />
          <span className="text-sm font-medium tracking-wide">{toastMessage}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
