"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/context/game-context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WizardCharacter from "@/components/wizard-character";
import type { Category } from "@/types/character";
import { characters } from "@/data/characters";
import { animals } from "@/data/animals";
import { countries } from "@/data/countries";
import { techItems } from "@/data/program";
import { scienceWords } from "@/data/scienceWords";
import { persons } from "@/data/persons";
import { prefectures } from "@/data/prefectures";

export default function CategoryScreen() {
  const { setStage, setCharacter } = useGame();
  const [wizardEmotion, setWizardEmotion] = useState<
    | "neutral"
    | "thinking"
    | "happy"
    | "excited"
    | "confused"
    | "yes"
    | "no"
    | "partially"
  >("neutral");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const isFirstRender = useRef(true);

  // ランダムなキャラクターを選択する関数
  const selectRandomCharacter = () => {
    if (!selectedCategory) return;

    let characterPool;

    switch (selectedCategory) {
      case "characters":
        characterPool = characters;
        break;
      case "animals":
        characterPool = animals;
        break;
      case "countries":
        characterPool = countries;
        break;
      case "programs":
        characterPool = techItems;
        break;
      case "scienceWords":
        characterPool = scienceWords;
        break;
      case "persons":
        characterPool = persons;
        break;
      case "prefecture":
        characterPool = prefectures;
        break;
      default:
        characterPool = characters;
    }

    if (characterPool.length === 0) {
      console.error("Character pool is empty");
      return;
    }

    const randomIndex = Math.floor(Math.random() * characterPool.length);
    const randomCharacter = characterPool[randomIndex];

    setCharacter(randomCharacter);
    setWizardEmotion("excited");

    setTimeout(() => {
      setStage("playing");
    }, 1000);
  };

  // selectedCategory の変更を監視し、更新されたらキャラクター選択を実行
  useEffect(() => {
    if (selectedCategory) {
      selectRandomCharacter();
    }
    // 依存配列は selectedCategory のみ
  }, [selectedCategory]);

  // カテゴリーを選択したときに呼び出される関数
  const handleSelectCategory = (category: Category) => {
    setSelectedCategory(category);
    setWizardEmotion("thinking");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center p-6"
    >
      {/* タイトルと説明文 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-12 pt-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          カテゴリー選択
        </h1>
        <p className="text-xl text-white/80">
          AIが考えるキャラクターのカテゴリーを選んでください
        </p>
      </motion.div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-6xl mt-8 md:mt-0">
        {/* ウィザードキャラクター */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full md:w-1/3 flex justify-center"
        >
          <WizardCharacter emotion={wizardEmotion} />
        </motion.div>

        {/* カテゴリーボタン */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full md:w-2/3 max-w-md flex flex-col space-y-4 mt-8 md:mt-0"
        >
          <Button
            onClick={() => handleSelectCategory("prefecture")}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            都道府県　(初級)
          </Button>
          <Button
            onClick={() => handleSelectCategory("animals")}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            動物　(初級)
          </Button>
          <Button
            onClick={() => handleSelectCategory("characters")}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            キャラクター　(初中級)
          </Button>
          <Button
            onClick={() => handleSelectCategory("countries")}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            国　(中級)
          </Button>
          <Button
            onClick={() => handleSelectCategory("persons")}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            人物　(上級)
          </Button>
          <Button
            onClick={() => handleSelectCategory("scienceWords")}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            理科の用語　(超上級)
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
