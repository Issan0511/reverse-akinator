"use client"

import { useEffect, useRef, useState } from "react"
import { useGame } from "@/context/game-context"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import WizardCharacter from "@/components/wizard-character"
import type { Category } from "@/types/character"
import { db } from "@/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

export default function CategoryScreen() {
  const { selectedCategory, setStage, setCategory, setWizardEmotion, selectRandomCharacter, user } = useGame()
  const [isGekiMuzuPlayed, setIsGekiMuzuPlayed] = useState(false)
  
  const isFirstRender = useRef(true)

  // selectedCategory の変更を監視し、更新されたらキャラクター選択を実行
  useEffect(() => {
    if (selectedCategory) {
      selectRandomCharacter()
    }
    // 依存配列は selectedCategory のみ
  }, [selectedCategory])

  // 激ムズモードのプレイ状況を取得
  useEffect(() => {
    const checkGekiMuzuStatus = async () => {
      if (!user) return

      const docRef = doc(db, "gekiMuzuStatus", user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        const lastPlayed = data.lastPlayed?.toDate()
        const today = new Date()

        if (lastPlayed && lastPlayed.toDateString() === today.toDateString()) {
          setIsGekiMuzuPlayed(true)
        }
      }
    }

    checkGekiMuzuStatus()
  }, [user])

  // カテゴリーを選択したときに呼び出される関数
  const handleCategorySelect = async (category: Category) => {
    // ウィザードの感情を "excited" に変更
    setWizardEmotion("excited")
    // 選択されたカテゴリーをセット
    setCategory(category)

    if (category === "gekiMuzu") {
      if (!user) return

      const docRef = doc(db, "gekiMuzuStatus", user.uid)
      await setDoc(docRef, { lastPlayed: serverTimestamp() }, { merge: true })
    }

    // 1秒後にゲーム画面へ進む
    setTimeout(() => {
      setStage("playing")
    }, 1000)
  }

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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">カテゴリー選択</h1>
        <p className="text-xl text-white/80">遊びたいカテゴリーを選んでください</p>
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
          <WizardCharacter emotion="neutral" />
        </motion.div>

        {/* カテゴリーボタン */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full md:w-2/3 max-w-md flex flex-col space-y-4 mt-8 md:mt-0"
        >
          <Button
            onClick={() => handleCategorySelect("prefecture")}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            都道府県　(初級)
          </Button>
          <Button
            onClick={() => handleCategorySelect("animals")}
            className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            動物　(初級)
          </Button>
          <Button
            onClick={() => handleCategorySelect("characters")}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            キャラクター　(初中級)
          </Button>
          <Button
            onClick={() => handleCategorySelect("countries")}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            国　(中級)
          </Button>
          <Button
            onClick={() => handleCategorySelect("persons")}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            人物　(上級)
          </Button>
          <Button
            onClick={() => handleCategorySelect("scienceWords")}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            理系用語　(超上級)
          </Button>
          <Button
            onClick={() => handleCategorySelect("gekiMuzu")}
            className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-900 hover:to-gray-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
            disabled={isGekiMuzuPlayed}
          >
            激ムズモード
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
