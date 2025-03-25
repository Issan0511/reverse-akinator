"use client";

import React from "react";
import { motion } from "framer-motion";

interface ThoughtBubbleProps {
  className?: string;
}

export default function ThoughtBubble({ className = "" }: ThoughtBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6 }}
      className={`relative ${className}`}
    >
      {/* メインの吹き出し */}
      <div className="w-48 h-48 bg-white/10 backdrop-blur-lg rounded-full border-2 border-white/20 shadow-lg relative">
        {/* シルエットと？マーク */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-white/5 rounded-full animate-pulse flex items-center justify-center">
            <span className="text-white/30 text-6xl font-bold">?</span>
          </div>
        </div>
      </div>
      
      {/* 吹き出しの尻尾（小さい丸を3つに） */}
      <div className="absolute -left-16 top-1/2 flex items-center space-x-2">
        <div className="w-3 h-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full" />
        <div className="w-4 h-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full" />
        <div className="w-6 h-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full" />
      </div>
    </motion.div>
  );
} 