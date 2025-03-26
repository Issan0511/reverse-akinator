// rank-screen.tsx
"use client";
import { useEffect, useState } from "react";
import { useGame } from "@/context/game-context";
import { db } from "@/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
};

export default function RankScreen() {
  const { selectedCategory, resetGame } = useGame();
  const [rankings, setRankings] = useState<LeaderboardData[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "leaderboard"),
      where("category", "==", selectedCategory),
      where("didGiveUp", "==", false),
      orderBy("questionsCount", "asc"),
      limit(10)
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as LeaderboardData);
      setRankings(data);
    });
  
    return () => unsubscribe();
  }, [selectedCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center p-6 bg-gradient-to-b from-gray-900 to-gray-800"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">ランキング</h1>
        <p className="text-xl text-white/80">カテゴリー：{categoryNames[selectedCategory] || selectedCategory}</p>
      </motion.div>

      <div className="w-full max-w-3xl space-y-4">
        {rankings.map((item, index) => (
          <motion.div
            key={item.userId}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-gray-800 border-gray-700">
              <div className="flex items-center gap-4">
                <div className={`w-16 text-center font-bold text-lg ${
                  index === 0 ? 'text-yellow-400' :
                  index === 1 ? 'text-gray-400' :
                  index === 2 ? 'text-amber-600' :
                  'text-white/80'
                }`}>
                  {index + 1}位
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">
                    {item.userName}
                  </h3>
                  <p className="text-emerald-400">{item.questionsCount}問で到達</p>
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
            className="text-center text-white/60 py-8"
          >
            まだ記録がありません
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Button
          onClick={resetGame}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          もう一度遊ぶ
        </Button>
      </motion.div>
    </motion.div>
  );
}
