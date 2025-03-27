"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import GameScreen from "@/components/game-screen";
import LoadingScreen from "@/components/loading-screen";
import CustomTopicScreen from "@/components/screens/custom-topic-screen";

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

  // カスタムURLの処理
  const { pathname } = router;
  const customUrlMatch = pathname.match(
    /\/custom\/Category="([^"]+)"selectedCharacter="([^"]+)"/
  );

  if (customUrlMatch) {
    const [, category, selectedCharacter] = customUrlMatch;
    return (
      <CustomTopicScreen
        initialCategory={category}
        initialSelectedCharacter={selectedCharacter}
      />
    );
  }

  // ログイン済みならゲーム画面を表示
  return <GameScreen />;
}
