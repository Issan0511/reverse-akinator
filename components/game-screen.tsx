"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/context/game-context";
import IntroScreen from "@/components/screens/intro-screen";
import PlayingScreen from "@/components/screens/playing-screen";
import ResultScreen from "@/components/screens/result-screen";
import CategoryScreen from "@/components/screens/category-screen";
import RankScreen from "@/components/screens/rank-screen";
import { AnimatePresence } from "framer-motion";
import UserMenu from "@/components/user-menu";

export default function GameScreen() {
  const { user, loading } = useAuth();
  const { stage } = useGame();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* ユーザーメニュー */}
      <div className="fixed top-4 right-4 z-50">
        <UserMenu />
      </div>

      <AnimatePresence mode="wait">
        {stage === "intro" && <IntroScreen key="intro" />}
        {stage === "playing" && <PlayingScreen key="playing" />}
        {stage === "result" && <ResultScreen key="result" />}
        {stage === "category" && <CategoryScreen key="category" />}
        {stage === "rank" && <RankScreen key="rank" />}
      </AnimatePresence>
    </div>
  );
}
