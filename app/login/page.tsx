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
    if (!loading && !user) {
      // 未ログインの場合はログインページへ
      router.replace("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    // ここはリダイレクト中なので何も描画しなくてもOK
    return null;
  }

  // ログイン済みならゲーム画面を表示
  return <GameScreen />;
}
