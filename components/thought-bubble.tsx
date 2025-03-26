"use client";

import React from "react";
import { motion } from "framer-motion";

interface ThoughtBubbleProps {
  message: string;
  className?: string;
  type?: "thinking" | "speaking";
}

export default function ThoughtBubble({
  message,
  className = "",
  type = "thinking",
}: ThoughtBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white/20 backdrop-blur-lg p-6 rounded-2xl border border-white/30 shadow-lg ${className}`}
    >
      <div className="text-white text-lg">{message}</div>

      {/* 吹き出しの尻尾（小さい丸を3つに） */}
      {type === "thinking" && (
        <div className="absolute -left-16 top-1/2 flex items-center space-x-2">
          <div className="w-3 h-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full" />
          <div className="w-4 h-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full" />
          <div className="w-6 h-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full" />
        </div>
      )}

      {/* 会話の吹き出し尻尾 */}
      {type === "speaking" && (
        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2">
          <div className="w-6 h-6 bg-white/20 backdrop-blur-lg border-l border-t border-white/30 rotate-45" />
        </div>
      )}
    </motion.div>
  );
}
