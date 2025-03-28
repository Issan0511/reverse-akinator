"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import GameScreen from "@/components/game-screen";
import LoadingScreen from "@/components/loading-screen";
import ScrollToTop from "@/components/scroll-to-top";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 認証チェックが終わった後、未ログインなら /login へ
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingScreen />;
  }

  // 未ログインなら上のuseEffectでリダイレクト -> ここでは nullを返すだけ
  if (!user) {
    return null;
  }

  // ログイン済みならゲーム画面を表示
  return (
    <>
      <ScrollToTop />
      <GameScreen />
    </>
  );
}
