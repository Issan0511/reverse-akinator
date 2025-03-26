"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/login/LoginButton"; // ← ログインボタンのコンポーネント（Googleログイン等）
import LoadingScreen from "@/components/loading-screen";
import WizardCharacter from "@/components/wizard-character";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 背景の魔法エフェクト */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 backdrop-blur-md"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 relative z-10">
        <div className="text-center">
          <motion.h1
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 mb-2 game-font tracking-wider"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            逆アキネーター
          </motion.h1>
          <motion.p
            className="text-xl text-white/90 mb-8 game-font"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            AIの考えているキャラクターを当ててみよう！
          </motion.p>
        </div>

        <div className="flex justify-center -mt-4 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <WizardCharacter emotion="excited" />
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            className="bg-white/5 p-6 rounded-xl border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <h2 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-3 game-font fancy-heading">
              遊び方
            </h2>
            <ul className="space-y-3 text-white/90 game-font">
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 }}
              >
                <span className="badge badge-q mr-2 flex-shrink-0">1</span>
                AIが考えているキャラクターについて質問をします
              </motion.li>
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.1 }}
              >
                <span className="badge badge-q mr-2 flex-shrink-0">2</span>
                AIは「はい」「いいえ」で答えてくれます
              </motion.li>
              <motion.li
                className="flex items-start"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              >
                <span className="badge badge-q mr-2 flex-shrink-0">3</span>
                質問を重ねて、正解を導き出しましょう！
              </motion.li>
            </ul>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            whileHover={{ scale: 1.05 }}
          >
            <LoginButton />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
