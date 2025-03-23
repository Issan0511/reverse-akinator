// app/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import GameScreen from "@/components/game-screen";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ローディングが終わって、かつ未ログインならログイン画面へ飛ばす
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // まだユーザー情報が取れていない場合
  if (loading) {
    return <p>Loading...</p>;
  }

  // 未ログインなら画面を返さず何も描画しない
  if (!user) {
    return null;
  }

  // ログイン済みならGameScreenを表示
  return <GameScreen />;
}
