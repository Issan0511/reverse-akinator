"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-200 via-indigo-100 to-blue-200 flex flex-col items-center justify-center">
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-300/20 to-pink-200/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-300/20 to-indigo-200/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      {/* コンテンツ */}
      <div className="relative z-10 glass-card p-8 rounded-2xl">
        <div className="text-center">
          <h2 className="text-2xl font-light text-purple-800 mb-6">Loading</h2>
          <motion.div
            className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}
