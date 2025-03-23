"use client";

import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGame } from "@/context/game-context";
import IntroScreen from "@/components/screens/intro-screen";
import PlayingScreen from "@/components/screens/playing-screen";
import ResultScreen from "@/components/screens/result-screen";
import CategoryScreen from "@/components/screens/category-screen";
import { AnimatePresence } from "framer-motion";
import LogoutButton from "@/components/login/LogoutButton";

export default function GameScreen() {
  const { user, loading } = useAuth();
  const { stage } = useGame();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user && (
        <>
          <h2 className="text-xl text-white/80">
            ようこそ {user.displayName ? user.displayName : "ゲスト"} さん
          </h2>
          {/* ここにログアウトボタンを表示 */}
          <LogoutButton />
        </>
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
