"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/context/game-context";
import IntroScreen from "@/components/screens/intro-screen";
import PlayingScreen from "@/components/screens/playing-screen";
import ResultScreen from "@/components/screens/result-screen";
import CategoryScreen from "@/components/screens/category-screen";
import RankScreen from "@/components/screens/rank-screen";
import LoadingScreen from "@/components/loading-screen";
import { AnimatePresence } from "framer-motion";
import UserMenu from "@/components/user-menu";

export default function GameScreen() {
  const { user, loading } = useAuth();
  const { stage } = useGame();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700/90 via-indigo-700/90 to-blue-700/90">
      {/* ユーザーメニュー - playing画面以外で表示 */}
      {stage !== "playing" && (
        <div className="fixed top-6 right-6 z-50">
          <UserMenu />
        </div>
      )}

      <div className="game-container">
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
