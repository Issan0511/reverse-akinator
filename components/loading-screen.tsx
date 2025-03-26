"use client";

import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700/90 via-indigo-700/90 to-blue-700/90 flex flex-col items-center justify-center pt-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Loading</h2>
        <motion.div
          className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
}
