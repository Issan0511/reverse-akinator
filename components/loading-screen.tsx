"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-6 relative overflow-hidden">
      {/* 背景エフェクト */}
      <div className="magical-bg"></div>

      {/* 魔法の円 */}
      <div className="relative z-10">
        <motion.div
          className="absolute -inset-20 rounded-full opacity-20 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-white mb-4 game-font tracking-wider flex items-center justify-center">
              <Sparkles className="h-5 w-5 mr-2 text-yellow-300" />
              Loading
              <Sparkles className="h-5 w-5 ml-2 text-yellow-300" />
            </h2>
          </motion.div>

          <div className="relative">
            <motion.div
              className="w-16 h-16 mx-auto relative"
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400"
                  style={{
                    top: "50%",
                    left: "50%",
                    marginLeft: "-6px",
                    marginTop: "-6px",
                    transformOrigin: "6px 30px",
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1, 0.8],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  initial={{
                    transform: `rotate(${i * 60}deg) translateY(-24px)`,
                  }}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
