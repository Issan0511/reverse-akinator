"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type WizardEmotion =
  | "neutral"
  | "thinking"
  | "happy"
  | "excited"
  | "confused"
  | "yes"
  | "no"
  | "partially";

interface WizardCharacterProps {
  emotion: WizardEmotion;
  size?: "small" | "medium" | "large";
}

export default function WizardCharacter({
  emotion = "neutral",
  size = "medium",
}: WizardCharacterProps) {
  // サイズに基づいた寸法を設定
  const dimensions = {
    small: { width: 180, height: 180 },
    medium: { width: 280, height: 280 },
    large: { width: 380, height: 380 },
  };

  // 魔法のエフェクトを表示するかどうか
  const showMagicEffect = ["excited", "yes"].includes(emotion);

  // 感情に応じた画像パスを取得
  const getWizardImagePath = () => {
    // デバッグ用にコンソール出力
    return `/wizard/${emotion}.png`;
  };

  return (
    <div className="relative" style={dimensions[size]}>
      <motion.div
        className="relative z-10 w-full h-full" // ここに幅と高さを追加
        initial="initial"
        animate="animate"
        variants={{
          initial: { y: 0 },
          animate: {
            y: [0, -5, 0],
            transition: {
              repeat: Infinity,
              duration: 3,
              ease: "easeInOut",
            },
          },
        }}
      >
        <motion.div
          className="w-full h-full" // ここに幅と高さを追加
          animate={{
            scale: [1, 1.02, 1],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            },
          }}
        >
          {/* 画像を使用する実装 */}
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <Image
              src={getWizardImagePath()}
              alt={`Wizard with ${emotion} emotion`}
              fill
              style={{ objectFit: 'contain' }}
              priority
              onError={(e) => {
                console.error('画像読み込みエラー:', getWizardImagePath());
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* 魔法のパーティクル */}
      {showMagicEffect && (
        <div className="absolute inset-0 z-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#fcd34d',
                boxShadow: '0 0 8px 2px rgba(252, 211, 77, 0.7)',
              }}
              animate={{
                x: [0, Math.cos((i * Math.PI) / 6) * 60 - 4],
                y: [0, Math.sin((i * Math.PI) / 6) * 60 - 4],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>
      )}


      {/* 感情に応じたテキストバブル */}
      <AnimatePresence>
        {["yes", "no", "partially"].includes(emotion) && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute -top-16 right-0"
          >
            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-purple-200 relative">
              <div className="text-lg font-bold text-purple-900">
                {emotion === "yes" && "はい！"}
                {emotion === "no" && "いいえ"}
                {emotion === "partially" && "部分的にはい"}
              </div>
              <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-4 h-4 bg-white border-r border-b border-purple-200"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
