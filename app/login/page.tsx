"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/login/LoginButton"; // ← ログインボタンのコンポーネント（Googleログイン等）
import LoadingScreen from "@/components/loading-screen";

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
    return <LoadingScreen />;
  }

  if (user) {
    // ログイン済みなら / にリダイレクト中
    return null;
  }

  // 未ログインなら ログインボタンなどを表示
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-200 via-indigo-100 to-blue-200 flex items-center justify-center p-4">
      {/* 背景の装飾要素 */}
      <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-5"></div>
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-purple-300/20 to-pink-200/20 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-300/20 to-indigo-200/20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

      {/* コンテンツ */}
      <div className="relative z-10 max-w-md w-full glass-card p-10 rounded-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-light text-purple-800 mb-2">
            逆アキネーター
          </h1>
          <p className="text-xl text-purple-600/80 mb-8 font-light">
            AIの考えているキャラクターを当ててみよう！
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-white/30 backdrop-blur-sm p-6 rounded-xl border border-white/40 shadow-inner">
            <h2 className="text-lg font-medium text-purple-700 mb-4">遊び方</h2>
            <ul className="space-y-3 text-purple-600/90">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                AIが考えているキャラクターについて質問をします
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                AIは「はい」「いいえ」で答えてくれます
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></span>
                質問を重ねて、正解を導き出しましょう！
              </li>
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
