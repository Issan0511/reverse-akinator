"use client"

import { useEffect, useRef } from "react"
import { useGame } from "@/context/game-context"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import WizardCharacter from "@/components/wizard-character"
import type { Category } from "@/types/character"



export default function CategoryScreen() {
  const { selectedCategory, setStage, setCategory, setWizardEmotion, selectRandomCharacter } = useGame()
  
  const isFirstRender = useRef(true)

  // selectedCategory の変更を監視し、更新されたらキャラクター選択を実行
  useEffect(() => {
    if (selectedCategory) {
      selectRandomCharacter()
    }
    // 依存配列は selectedCategory のみ
  }, [selectedCategory])
  


  // カテゴリーを選択したときに呼び出される関数
  const handleCategorySelect = (category: Category) => {
    // ウィザードの感情を "excited" に変更
    setWizardEmotion("excited")
    // 選択されたカテゴリーをセット
    setCategory(category)
    // カテゴリー選択後にキャラクターをランダムに選ぶ
    // selectRandomCharacter() ここでは呼ばない
    // 1秒後にゲーム画面へ進む
    setTimeout(() => {
      setStage("playing")
    }, 1000)
  }

  return (
    <motion.div
      // 初期表示アニメーション
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full"
    >
      {/* タイトルと説明文 */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">カテゴリー選択</h1>
        <p className="text-xl text-white/80">遊びたいカテゴリーを選んでください</p>
      </motion.div>

      {/* ウィザードキャラクター */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <WizardCharacter emotion="neutral" />
      </motion.div>

      {/* カテゴリーボタン */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        <Button
          onClick={() => handleCategorySelect("characters")}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          キャラクター
        </Button>
        <Button
          onClick={() => handleCategorySelect("animals")}
          className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          動物
        </Button>
        <Button
          onClick={() => handleCategorySelect("countries")}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          国
        </Button>

        <Button
          onClick={() => handleCategorySelect("persons")}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          人物
        </Button>

        <Button
          onClick={() => handleCategorySelect("scienceWords")}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          理科の用語
        </Button>


      </motion.div>
    </motion.div>
  )
}
