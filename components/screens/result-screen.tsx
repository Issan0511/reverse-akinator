"use client";
import { useEffect } from "react";

import { useGame } from "@/context/game-context";

// --- Firebase 関連 ---
import { db } from "@/firebase"; // あなたの Firebase 初期化ファイル
import {
  doc,
  setDoc,
  serverTimestamp,
  query,
  getDoc,
} from "firebase/firestore";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import WizardCharacter from "@/components/wizard-character";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Share2,
  RefreshCw,
  BarChart3,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ResultScreen() {
  // 例：GameContext からカテゴリーやユーザー情報を取得できる想定
  const {
    selectedCharacter,
    resetGame,
    questions,
    isSuccess,
    selectedCategory, // 取り組んだカテゴリをここで受け取る
    user,
    setStage, // ログインしているユーザー情報がある前提
    didGiveUp,
    usedHint
  } = useGame();

  // 成功時にconfettiを発射
  useEffect(() => {
    const saveResultToFirestore = async () => {
      try {
        if (!user || !selectedCategory) return;
  
        // ドキュメントIDを「カテゴリ+ユーザーID」で固定（最高記録のみを保存）
        const docRef = doc(
          db,
          "leaderboard",
          `${selectedCategory}-${user.uid}`
        );
  
        // ギブアップまたはヒント使用の場合はランキング対象外とする
        const isDisqualified = didGiveUp || usedHint;
  
        if (isDisqualified) {
          // 除外の場合は、既存の記録がない場合のみ保存（既に記録があればそのまま）
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            await setDoc(
              docRef,
              {
                category: selectedCategory,
                userId: user.uid,
                userName: user.displayName ?? "Anonymous",
                questionsCount: 999,  // 高い数値を入れてランキングから外す
                didGiveUp: didGiveUp,      // 既存のフィールドをそのまま利用
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        } else {
          // 正常なクリア・失敗時は、既存の記録と比較して良い方のみ保存
          const docSnap = await getDoc(docRef);
          const currentRecord = docSnap.exists() ? docSnap.data() : null;
  
          if (
            !currentRecord ||
            (currentRecord.didGiveUp && !isDisqualified) ||
            (currentRecord.questionsCount > questions.length && !isDisqualified)
          ) {
            await setDoc(
              docRef,
              {
                category: selectedCategory,
                userId: user.uid,
                userName: user.displayName ?? "Anonymous",
                questionsCount: questions.length,
                didGiveUp: false,
                updatedAt: serverTimestamp(),
              },
              { merge: true }
            );
          }
        }
      } catch (error) {
        console.error("Error saving result to Firestore:", error);
      }
    };
  
    saveResultToFirestore();
  }, [questions.length, selectedCategory, user, didGiveUp, usedHint]);
  

  const tweetText = isSuccess
    ? `「逆ネーター」で ${questions.length} 問以内に『${selectedCharacter?.name}』を当てられた！\nあなたもプレイしてみよう👇`
    : `「逆ネーター」で『${selectedCharacter?.name}』を当てられなかった...\nあなたも挑戦してみよう👇`;

  const gptprompt = `${selectedCharacter?.name}についてのTipsを教えてください`;

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    tweetText
  )}&url=${encodeURIComponent("https://reverse-akinator-eight.vercel.app/")}`;
  const gptUrl = `https://chatgpt.com/?q=${encodeURIComponent(
    gptprompt
  )}&hints=search&ref=ext&temporary-chat=true`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full relative"
    >
      {/* 背景の魔法エフェクト */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 2,
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="mb-6"
      >
        <WizardCharacter emotion={isSuccess ? "excited" : "confused"} />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
        className="text-center mb-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 game-font tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-glow">
          {isSuccess ? "クリア成功！" : "クリア失敗..."}
        </h1>
        <motion.p
          className="text-xl text-white/90 game-font"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="inline-flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-300 animate-pulse" />
            魔法使いが考えていたキャラクターは...
            <Sparkles className="h-5 w-5 ml-2 text-yellow-300 animate-pulse" />
          </span>
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-8 bg-white/10 backdrop-blur-sm p-6 rounded-xl max-w-md w-full border border-white/20 shadow-lg"
      >
        <motion.div
          className="text-7xl mb-4"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          {selectedCharacter?.emoji}
        </motion.div>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 mb-3 game-font fancy-heading">
          {selectedCharacter?.name}
        </h2>

        <div className="bg-white/10 p-4 rounded-lg mb-4">
          <p className="text-white/90 mb-2 game-font">
            {selectedCharacter?.description}
          </p>
          <p className="text-white/90 game-font">{selectedCharacter?.tips}</p>
        </div>

        <Link
          href={gptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-full text-md font-medium shadow-lg hover:shadow-xl transition-all game-font border border-white/20 mb-6"
        >
          <ExternalLink className="h-4 w-4" />
          もっと詳しく知る
        </Link>

        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 mb-4 game-font">
          質問履歴
        </h3>

        <div className="max-h-[300px] overflow-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          <ul className="space-y-3 text-left">
            {questions.map((q, index) => (
              <motion.li
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.05, duration: 0.3 }}
              >
                <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-colors">
                  <CardContent className="p-3">
                    <div className="text-white/90 game-font">
                      <div className="mb-2 flex items-start">
                        <span className="badge badge-q mr-2 flex-shrink-0 mt-1">
                          Q
                        </span>
                        <span>{q.question}</span>
                      </div>
                      <div className="mb-1 flex items-start">
                        <span
                          className={`
                          badge mr-2 flex-shrink-0 mt-1
                          ${q.answer === "はい" ? "badge-a-yes" : ""} 
                          ${q.answer === "いいえ" ? "badge-a-no" : ""} 
                          ${q.answer === "わからない" ? "badge-a-unknown" : ""}
                        `}
                        >
                          A
                        </span>
                        <span>{q.answer}</span>
                      </div>
                      <div className="text-xs text-white/60 ml-8">
                        {q.reason}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-6 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20"
      >
        <p className="text-white/90 game-font flex items-center justify-center">
          {isSuccess ? (
            <>
              <Trophy className="h-5 w-5 text-yellow-300 mr-2" />
              <span className="text-yellow-300 font-bold">
                {questions.length}回
              </span>
              の質問で正解しました！
            </>
          ) : (
            "残念ながら当てられませんでした。また挑戦してください！"
          )}
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href={tweetUrl} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3 rounded-full text-md font-medium shadow-lg hover:shadow-xl transition-all game-font border border-white/20 flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              結果をXでシェアする
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={resetGame}
            variant="outline"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-full text-md font-medium shadow-lg hover:shadow-xl transition-all game-font border border-white/20 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            もう一度遊ぶ
          </Button>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {selectedCategory !== "customTopic" && (
          <Button
            onClick={() => setStage("rank")}
            variant="outline"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-full text-md font-medium shadow-lg hover:shadow-xl transition-all game-font border border-white/20 flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            ランキングをみる
          </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
