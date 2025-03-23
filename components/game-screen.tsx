// components/game-screen.tsx
"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/context/game-context";
import IntroScreen from "@/components/screens/intro-screen";
import PlayingScreen from "@/components/screens/playing-screen";
import ResultScreen from "@/components/screens/result-screen";
import CategoryScreen from "@/components/screens/category-screen";
import { AnimatePresence } from "framer-motion";

export default function GameScreen() {
  const { user, loading } = useAuth();
  const { stage } = useGame();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user && (
        <h2>ようこそ {user.displayName ? user.displayName : "ゲスト"} さん</h2>
      )}
      <AnimatePresence mode="wait">
        {stage === "intro" && <IntroScreen key="intro" />}
        {stage === "playing" && <PlayingScreen key="playing" />}
        {stage === "result" && <ResultScreen key="result" />}
        {stage === "category" && <CategoryScreen key="category" />}
      </AnimatePresence>
    </div>
  );
}
