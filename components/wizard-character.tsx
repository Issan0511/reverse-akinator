"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // 目の表現を取得
  const getEyes = () => {
    switch (emotion) {
      case "happy":
      case "excited":
      case "yes":
        return (
          <>
            {/* 左目 */}
            <ellipse cx="85" cy="80" rx="8" ry="10" fill="#1e293b" />
            <circle cx="83" cy="77" r="2" fill="white" />
            <ellipse
              cx="85"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />

            {/* 右目 */}
            <ellipse cx="115" cy="80" rx="8" ry="10" fill="#1e293b" />
            <circle cx="113" cy="77" r="2" fill="white" />
            <ellipse
              cx="115"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />
          </>
        );
      case "confused":
        return (
          <>
            {/* 左目 */}
            <ellipse cx="85" cy="80" rx="8" ry="10" fill="#1e293b" />
            <circle cx="83" cy="77" r="2" fill="white" />
            <ellipse
              cx="85"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />

            {/* 右目 - 少し細め */}
            <ellipse cx="115" cy="80" rx="8" ry="7" fill="#1e293b" />
            <circle cx="113" cy="77" r="2" fill="white" />
            <ellipse
              cx="115"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />
          </>
        );
      case "thinking":
        return (
          <>
            {/* 左目 */}
            <ellipse cx="85" cy="80" rx="8" ry="8" fill="#1e293b" />
            <circle cx="83" cy="77" r="2" fill="white" />
            <ellipse
              cx="85"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />

            {/* 右目 - 上を見ている */}
            <ellipse cx="115" cy="78" rx="8" ry="8" fill="#1e293b" />
            <circle cx="113" cy="75" r="2" fill="white" />
            <ellipse
              cx="115"
              cy="78"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />
          </>
        );
      case "no":
        return (
          <>
            {/* 左目 - 少し細め */}
            <ellipse cx="85" cy="80" rx="8" ry="6" fill="#1e293b" />
            <circle cx="83" cy="77" r="2" fill="white" />
            <ellipse
              cx="85"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />

            {/* 右目 - 少し細め */}
            <ellipse cx="115" cy="80" rx="8" ry="6" fill="#1e293b" />
            <circle cx="113" cy="77" r="2" fill="white" />
            <ellipse
              cx="115"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />
          </>
        );
      default:
        return (
          <>
            {/* 左目 */}
            <ellipse cx="85" cy="80" rx="8" ry="10" fill="#1e293b" />
            <circle cx="83" cy="77" r="2" fill="white" />
            <ellipse
              cx="85"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />

            {/* 右目 */}
            <ellipse cx="115" cy="80" rx="8" ry="10" fill="#1e293b" />
            <circle cx="113" cy="77" r="2" fill="white" />
            <ellipse
              cx="115"
              cy="80"
              rx="8"
              ry="3"
              fill="#1e293b"
              opacity="0.7"
            />
          </>
        );
    }
  };

  // 口の表現を取得
  const getMouth = () => {
    switch (emotion) {
      case "happy":
      case "excited":
      case "yes":
        return (
          <path
            d="M 90 95 Q 100 105, 110 95"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case "confused":
        return (
          <path
            d="M 90 98 Q 100 95, 110 98"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      case "no":
        return (
          <path
            d="M 90 100 Q 100 95, 110 100"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d="M 90 98 Q 100 100, 110 98"
            fill="none"
            stroke="#64748b"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <div className="relative" style={dimensions[size]}>
      <motion.div
        className="relative z-10"
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
          animate={{
            scale: [1, 1.02, 1],
            transition: {
              repeat: Infinity,
              duration: 2,
              ease: "easeInOut",
            },
          }}
        >
          <svg
            viewBox="0 0 200 200"
            width="100%"
            height="100%"
            style={{ overflow: "visible" }}
          >
            <defs>
              {/* 複雑なフィルターとグラデーションの定義 */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter
                id="softShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="0"
                  dy="4"
                  stdDeviation="4"
                  floodColor="#00000033"
                />
              </filter>

              <filter
                id="complexShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="2"
                  dy="4"
                  stdDeviation="3"
                  floodColor="#00000055"
                />
                <feDropShadow
                  dx="-1"
                  dy="2"
                  stdDeviation="1"
                  floodColor="#00000033"
                />
              </filter>

              <radialGradient
                id="faceGradient"
                cx="50%"
                cy="50%"
                r="50%"
                fx="40%"
                fy="40%"
              >
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="70%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#f59e0b" />
              </radialGradient>

              <linearGradient
                id="hatGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>

              <linearGradient
                id="hatShadeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#7e22ce" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>

              <linearGradient
                id="robeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#9333ea" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>

              <linearGradient
                id="robeShadeGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#7e22ce" />
                <stop offset="100%" stopColor="#6b21a8" />
              </linearGradient>

              <linearGradient
                id="gemGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#0891b2" />
              </linearGradient>

              <radialGradient
                id="gemGlow"
                cx="50%"
                cy="50%"
                r="50%"
                fx="30%"
                fy="30%"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>

              <linearGradient
                id="starGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="50%" stopColor="#fcd34d" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              <radialGradient
                id="starGlow"
                cx="50%"
                cy="50%"
                r="50%"
                fx="30%"
                fy="30%"
              >
                <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fcd34d" stopOpacity="0" />
              </radialGradient>

              <radialGradient
                id="magicAura"
                cx="50%"
                cy="50%"
                r="50%"
                fx="50%"
                fy="50%"
              >
                <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 魔法のオーラ (excited状態のみ) */}
            {emotion === "excited" && (
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                fill="url(#magicAura)"
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
              />
            )}

            {/* ローブ */}
            <g>
              <path
                d="M 60 100 
                   C 60 100, 55 140, 50 180 
                   L 150 180 
                   C 145 140, 140 100, 140 100 
                   Z"
                fill="url(#robeGradient)"
                stroke="#7e22ce"
                strokeWidth="1"
                filter="url(#softShadow)"
              />

              {/* ローブの影と質感 */}
              <path
                d="M 60 100 
                   C 60 100, 58 120, 55 140 
                   L 145 140 
                   C 142 120, 140 100, 140 100 
                   Z"
                fill="url(#robeShadeGradient)"
                opacity="0.3"
              />

              {/* ローブの折り目 */}
              <path
                d="M 70 120 L 130 120"
                stroke="#7e22ce"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <path
                d="M 65 140 L 135 140"
                stroke="#7e22ce"
                strokeWidth="0.5"
                opacity="0.5"
              />
              <path
                d="M 60 160 L 140 160"
                stroke="#7e22ce"
                strokeWidth="0.5"
                opacity="0.5"
              />

              {/* 首元の装飾 */}
              <path
                d="M 70 100 
                   C 80 95, 120 95, 130 100"
                fill="none"
                stroke="#7e22ce"
                strokeWidth="5"
              />

              {/* 宝石 */}
              <circle
                cx="100"
                cy="100"
                r="7"
                fill="url(#gemGradient)"
                filter="url(#glow)"
              />
              <circle
                cx="100"
                cy="100"
                r="7"
                fill="url(#gemGlow)"
                opacity="0.7"
              />
              <circle cx="97" cy="97" r="2" fill="white" opacity="0.8" />
            </g>

            {/* 顔 */}
            <g>
              <ellipse
                cx="100"
                cy="80"
                rx="30"
                ry="35"
                fill="url(#faceGradient)"
                filter="url(#softShadow)"
              />

              {/* 頬の赤み */}
              <circle cx="80" cy="90" r="10" fill="#f87171" opacity="0.2" />
              <circle cx="120" cy="90" r="10" fill="#f87171" opacity="0.2" />

              {/* 目 */}
              {getEyes()}

              {/* 眉毛 */}
              <path
                d={
                  emotion === "confused"
                    ? "M 75 65 Q 85 60, 95 65"
                    : "M 75 65 Q 85 62, 95 65"
                }
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d={
                  emotion === "confused"
                    ? "M 105 65 Q 115 70, 125 65"
                    : "M 105 65 Q 115 62, 125 65"
                }
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* 口 */}
              {getMouth()}

              {/* 鼻 */}
              <path
                d="M 98 85 Q 100 88, 102 85"
                fill="none"
                stroke="#64748b"
                strokeWidth="1"
                opacity="0.7"
              />
            </g>

            {/* 帽子 */}
            <g>
              <path
                d="M 50 60 
                   C 60 30, 140 30, 150 60
                   C 140 50, 60 50, 50 60 Z"
                fill="url(#hatGradient)"
                stroke="#7e22ce"
                strokeWidth="1"
                filter="url(#softShadow)"
              />

              {/* 帽子の影と質感 */}
              <path
                d="M 50 60 
                   C 60 45, 140 45, 150 60"
                fill="url(#hatShadeGradient)"
                opacity="0.3"
              />

              {/* 帽子の装飾 */}
              <path
                d="M 60 55 
                   C 70 45, 130 45, 140 55"
                fill="none"
                stroke="#c084fc"
                strokeWidth="0.5"
                opacity="0.7"
              />

              {/* 星の装飾1 */}
              <motion.g
                animate={{
                  rotate: [0, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                }}
                style={{ transformOrigin: "80px 40px" }}
              >
                <path
                  d="M 80 30 L 84 40 L 95 42 L 87 50 L 89 60 L 80 55 L 71 60 L 73 50 L 65 42 L 76 40 Z"
                  fill="url(#starGradient)"
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                  filter="url(#glow)"
                />
                <circle
                  cx="80"
                  cy="40"
                  r="10"
                  fill="url(#starGlow)"
                  opacity="0.7"
                />
              </motion.g>

              {/* 星の装飾2 */}
              <motion.g
                animate={{
                  rotate: [0, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  delay: 1,
                }}
                style={{ transformOrigin: "120px 40px" }}
              >
                <path
                  d="M 120 35 L 123 42 L 130 43 L 125 48 L 126 55 L 120 52 L 114 55 L 115 48 L 110 43 L 117 42 Z"
                  fill="url(#starGradient)"
                  stroke="#f59e0b"
                  strokeWidth="0.5"
                  filter="url(#glow)"
                />
                <circle
                  cx="120"
                  cy="43"
                  r="7"
                  fill="url(#starGlow)"
                  opacity="0.7"
                />
              </motion.g>
            </g>

            {/* 魔法のパーティクル */}
            {showMagicEffect && (
              <>
                {[...Array(12)].map((_, i) => (
                  <motion.g key={i}>
                    <motion.circle
                      cx={100}
                      cy={100}
                      r={2}
                      fill="#fcd34d"
                      filter="url(#glow)"
                      animate={{
                        x: [0, Math.cos((i * Math.PI) / 6) * 60],
                        y: [0, Math.sin((i * Math.PI) / 6) * 60],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: i * 0.15,
                      }}
                    />
                    <motion.circle
                      cx={100}
                      cy={100}
                      r={1}
                      fill="white"
                      animate={{
                        x: [0, Math.cos((i * Math.PI) / 6) * 60],
                        y: [0, Math.sin((i * Math.PI) / 6) * 60],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        delay: i * 0.15 + 0.1,
                      }}
                    />
                  </motion.g>
                ))}
              </>
            )}

            {/* 思考バブル */}
            {emotion === "thinking" && (
              <g>
                <motion.circle
                  cx="145"
                  cy="40"
                  r="8"
                  fill="white"
                  stroke="#d1d5db"
                  strokeWidth="1"
                  animate={{
                    y: [0, -3, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 0.4,
                  }}
                />
                <motion.circle
                  cx="135"
                  cy="50"
                  r="6"
                  fill="white"
                  stroke="#d1d5db"
                  strokeWidth="1"
                  animate={{
                    y: [0, -2, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 0.2,
                  }}
                />
                <motion.circle
                  cx="128"
                  cy="58"
                  r="4"
                  fill="white"
                  stroke="#d1d5db"
                  strokeWidth="1"
                  animate={{
                    y: [0, -1, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 0,
                  }}
                />
              </g>
            )}
          </svg>
        </motion.div>
      </motion.div>

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
