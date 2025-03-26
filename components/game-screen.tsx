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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-500 via-indigo-400 to-blue-400">
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-600/40 to-pink-400/40 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-500/40 to-indigo-500/40 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      {/* コンテンツラッパー - 背景効果の上に配置 */}
      <div className="relative z-10">
        {/* ナビゲーションメニュー */}
        <div className="fixed top-4 left-4 z-50">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-purple-800 px-4 py-2 rounded-md border border-purple-200/30 shadow-sm">
                    ホーム
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-purple-800 px-4 py-2 rounded-md ml-2 border border-purple-200/30 shadow-sm">
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
    </div>
  );
}
