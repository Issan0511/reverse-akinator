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
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";

export default function GameScreen() {
  const { user, loading } = useAuth();
  const { stage } = useGame();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* ナビゲーションメニュー */}
      <div className="fixed top-4 left-4 z-50">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md">
                  ホーム
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/about" legacyBehavior passHref>
                <NavigationMenuLink className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md ml-2">
                  遊び方
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* ユーザーメニュー - playing画面以外で表示 */}
      {stage !== "playing" && (
        <div className="fixed top-4 right-4 z-50">
          <UserMenu />
        </div>
      )}

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
