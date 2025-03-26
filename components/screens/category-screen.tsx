"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/context/game-context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WizardCharacter from "@/components/wizard-character";
import type { Category } from "@/types/character";
import { Sparkles, MapPin, Cat, Tv, Globe, User, Atom } from "lucide-react";

export default function CategoryScreen() {
  const {
    selectedCategory,
    setStage,
    setCategory,
    setWizardEmotion,
    selectRandomCharacter,
  } = useGame();

  const isFirstRender = useRef(true);

  // selectedCategory の変更を監視し、更新されたらキャラクター選択を実行
  useEffect(() => {
    if (selectedCategory) {
      selectRandomCharacter();
    }
    // 依存配列は selectedCategory のみ
  }, [selectedCategory]);

  // カテゴリーを選択したときに呼び出される関数
  const handleCategorySelect = (category: Category) => {
    // ウィザードの感情を "excited" に変更
    setWizardEmotion("excited");
    // 選択されたカテゴリーをセット
    setCategory(category);
    // 1秒後にゲーム画面へ進む
    setTimeout(() => {
      setStage("playing");
    }, 1000);
  };

  // カテゴリーデータ
  const categories = [
    {
      id: "prefecture",
      name: "都道府県",
      level: "初級",
      icon: <MapPin className="h-5 w-5" />,
      gradient:
        "from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700",
    },
    {
      id: "animals",
      name: "動物",
      level: "初級",
      icon: <Cat className="h-5 w-5" />,
      gradient:
        "from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700",
    },
    {
      id: "characters",
      name: "キャラクター",
      level: "初中級",
      icon: <Tv className="h-5 w-5" />,
      gradient:
        "from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700",
    },
    {
      id: "countries",
      name: "国",
      level: "中級",
      icon: <Globe className="h-5 w-5" />,
      gradient:
        "from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700",
    },
    {
      id: "persons",
      name: "人物",
      level: "上級",
      icon: <User className="h-5 w-5" />,
      gradient:
        "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
    },
    {
      id: "scienceWords",
      name: "理系用語",
      level: "超上級",
      icon: <Atom className="h-5 w-5" />,
      gradient:
        "from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center p-6 relative"
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

      {/* タイトルと説明文 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
        className="text-center mb-8 pt-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 game-font tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-glow">
          カテゴリー選択
        </h1>
        <motion.p
          className="text-xl text-white/90 game-font"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="inline-flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-300 animate-pulse" />
            遊びたいカテゴリーを選んでください
            <Sparkles className="h-5 w-5 ml-2 text-yellow-300 animate-pulse" />
          </span>
        </motion.p>
      </motion.div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl mt-4 md:mt-0">
        {/* ウィザードキャラクター */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          className="w-full md:w-1/3 flex justify-center"
        >
          <WizardCharacter emotion="thinking" />
        </motion.div>

        {/* カテゴリーボタン */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full md:w-2/3 max-w-md flex flex-col space-y-4 mt-4 md:mt-0"
        >
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg mb-4">
            <p className="text-white/90 game-font mb-2">
              魔法使いが選んだカテゴリーから1つのお題を考えます。
              あなたは質問をして、そのお題が何かを当てましょう！
            </p>
          </div>

          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                onClick={() => handleCategorySelect(category.id as Category)}
                className={`bg-gradient-to-r ${category.gradient} text-white px-8 py-6 rounded-xl text-lg font-medium shadow-lg hover:shadow-xl transition-all w-full game-font border border-white/20 flex items-center justify-between`}
              >
                <div className="flex items-center">
                  <span className="bg-white/20 p-2 rounded-full mr-3">
                    {category.icon}
                  </span>
                  <span>{category.name}</span>
                </div>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {category.level}
                </span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
