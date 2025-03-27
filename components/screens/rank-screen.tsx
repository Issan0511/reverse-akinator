// rank-screen.tsx
"use client";
import { useEffect, useState } from "react";
import { useGame } from "@/context/game-context";
import { db } from "@/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Crown, Award, RefreshCw, Sparkles } from "lucide-react";

type LeaderboardData = {
  userId: string;
  userName: string;
  questionsCount: number;
  category: string;
};

// カテゴリー名の日本語マッピング
const categoryNames: { [key: string]: string } = {
  characters: "キャラクター",
  animals: "動物",
  countries: "国",
  programs: "プログラム",
  scienceWords: "理科の用語",
  persons: "人物",
  prefecture: "都道府県",
  gekiMuzu: "激ムズ",
};

export default function RankScreen() {
  const { selectedCategory, resetGame } = useGame();
  const [rankings, setRankings] = useState<LeaderboardData[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "leaderboard"),
      where("category", "==", selectedCategory),
      where("questionsCount", "<", 100),
      orderBy("questionsCount", "asc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as LeaderboardData);
      setRankings(data);
    });

    return () => unsubscribe();
  }, [selectedCategory]);

  // ランクに応じたアイコンを取得
  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-400" />;
    if (index === 1) return <Trophy className="h-6 w-6 text-gray-300" />;
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center p-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 game-font tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-glow fancy-heading">
          ランキング
        </h1>
        <motion.p
          className="text-xl text-white/80 game-font"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="inline-flex items-center">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-300 animate-pulse" />
            カテゴリー：{categoryNames[selectedCategory] || selectedCategory}
            <Sparkles className="h-4 w-4 ml-2 text-yellow-300 animate-pulse" />
          </span>
        </motion.p>
      </motion.div>

      <div className="w-full max-w-3xl space-y-4">
        {rankings.map((item, index) => (
          <motion.div
            key={item.userId}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <Card className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg hover:border-white/30 transition-all duration-300">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 text-center font-bold text-lg flex items-center justify-center ${
                    index === 0
                      ? "text-yellow-400"
                      : index === 1
                      ? "text-gray-300"
                      : index === 2
                      ? "text-amber-600"
                      : "text-white/80"
                  }`}
                >
                  {getRankIcon(index)}
                  <span className="ml-1">{index + 1}位</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white game-font">
                    {item.userName}
                  </h3>
                  <p className="text-emerald-400 flex items-center">
                    <Sparkles className="h-3 w-3 mr-1 text-emerald-300" />
                    {item.questionsCount}問で到達
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {rankings.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/60 py-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10"
          >
            <p className="text-xl game-font">まだ記録がありません</p>
            <p className="mt-2 text-white/40">
              あなたが最初の挑戦者になりましょう！
            </p>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={resetGame}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all game-font border border-white/20 flex items-center gap-2"
        >
          <RefreshCw className="h-5 w-5 text-white" />
          もう一度遊ぶ
        </Button>
      </motion.div>
    </motion.div>
  );
}
