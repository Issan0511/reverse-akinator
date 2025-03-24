// rank-screen.tsx
"use client";
import { useEffect, useState } from "react";
import { useGame } from "@/context/game-context";

// Firebase
import { db } from "@/firebase";
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

type LeaderboardData = {
  userId: string;
  userName: string;
  questionsCount: number;
  category: string;
};

export default function RankScreen() {
  const { selectedCategory,
          resetGame,
  } = useGame(); // ★ コンテキストから直接取得
  const [rankings, setRankings] = useState<LeaderboardData[]>([]);
  

  useEffect(() => {
    // Firestore から該当カテゴリだけを昇順取得し、上位10件に限定
    const q = query(
      collection(db, "leaderboard"),
      where("category", "==", selectedCategory),
      where("didGiveUp", "==", false),   // ギブアップ勢を除外
      orderBy("questionsCount", "asc"),
      limit(10)
    );
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data() as LeaderboardData);
      setRankings(data);
    });
  
    // コンポーネントのアンマウント時にクリーンアップする
    return () => unsubscribe();
  }, [selectedCategory]);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">ランキング （カテゴリ: {selectedCategory}）</h1>
      <ul className="space-y-2">
        {rankings.map((item, index) => (
          <li key={item.userId} className="flex items-center gap-4">
            <span className="font-bold">{index + 1}位</span>
            <span>{item.userName}</span>
            <span>( {item.questionsCount} 問 )</span>
          </li>
        ))}
      </ul>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
        <Button
          onClick={resetGame}
          variant="outline"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          もう一度遊ぶ
        </Button>
      </motion.div>

    </div>
  );
}
