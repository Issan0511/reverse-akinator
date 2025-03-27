"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/context/game-context";
import IntroScreen from "@/components/screens/intro-screen";
import PlayingScreen from "@/components/screens/playing-screen";
import ResultScreen from "@/components/screens/result-screen";
import CategoryScreen from "@/components/screens/category-screen";
import RankScreen from "@/components/screens/rank-screen";
import LoadingScreen from "@/components/loading-screen";
import { AnimatePresence, motion } from "framer-motion";
import UserMenu from "@/components/user-menu";

export default function GameScreen() {
  const { user, loading } = useAuth();
  const { stage } = useGame();
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number; speed: number }>
  >([]);

  // 魔法の粒子を生成
  useEffect(() => {
    const particleCount = 50;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        speed: Math.random() * 1 + 0.5,
      });
    }

    setParticles(newParticles);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* 魔法の背景 */}
      <div className="magical-bg">
        {/* 魔法の粒子 */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="magic-particle"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
            animate={{
              y: ["0%", `${particle.speed * 100}%`],
              x: [
                `${particle.x}%`,
                `${particle.x + (Math.random() * 10 - 5)}%`,
                `${particle.x}%`,
              ],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 10 + particle.speed * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* ユーザーメニュー - playing画面以外で表示 */}
      {stage !== "playing" && (
        <div className="fixed top-6 right-6 z-50">
          <UserMenu />
        </div>
      )}

      <div className="game-container relative z-10">
        <AnimatePresence mode="wait">
          {stage === "intro" && <IntroScreen key="intro" />}
          {stage === "playing" && <PlayingScreen key="playing" />}
          {stage === "result" && <ResultScreen key="result" />}
          {stage === "category" && <CategoryScreen key="category" />}
          {stage === "rank" && <RankScreen key="rank" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
