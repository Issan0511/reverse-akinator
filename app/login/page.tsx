"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/login/LoginButton"; // ← ログインボタンのコンポーネント（Googleログイン等）

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ローディングが終わってログイン済みならトップページに飛ばす
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    // ログイン済みなら / にリダイレクト中
    return null;
  }

  // 未ログインなら ログインボタンなどを表示
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">逆アキネーター</h1>
          <p className="text-xl text-white/80 mb-8">AIの考えているキャラクターを当ててみよう！</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-3">遊び方</h2>
            <ul className="space-y-2 text-white/80">
              <li>• AIが考えているキャラクターについて質問をします</li>
              <li>• AIは「はい」「いいえ」で答えてくれます</li>
              <li>• 質問を重ねて、正解を導き出しましょう！</li>
            </ul>
          </div>

          <div className="flex justify-center">
            <LoginButton />
          </div>
        </div>
      </div>
    </div>
  );
}
