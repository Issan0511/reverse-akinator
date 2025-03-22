"use client"

import { useGame } from "@/context/game-context"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import WizardCharacter from "@/components/wizard-character"

export default function ResultScreen() {
  const { selectedCharacter, resetGame, questions } = useGame()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4"></h1>
        <p className="text-xl text-white/80"></p>
        <br />
        <p className="text-xl text-white/80"></p>
      </motion.div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <WizardCharacter emotion="excited" />
      </motion.div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">ゲーム終了！</h1>
        <p className="text-xl text-white/80">魔人が考えていたキャラクターは...</p>
      </motion.div>



      {/* キャラクター情報のブロックを質問履歴表示に差し替え */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-8 bg-white/20 p-6 rounded-xl max-w-md w-full"
      >
        <div className="text-6xl mb-4">{selectedCharacter?.emoji}</div>
        <h2 className="text-2xl font-bold text-white mb-2">{selectedCharacter?.name}</h2>
        <p className="text-white/90 mb-4">{selectedCharacter?.description}</p>
        <h3 className="text-xl font-bold text-white mb-4">質問履歴</h3>
        <ul className="space-y-2">
          {questions.map((q, index) => (
            <li key={index} className="text-white/90">
              <div>
                <span className="font-semibold">Q:</span> {q.question}
              </div>
              <div>
                <span className="font-semibold">A:</span> {q.answer}
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mb-6"
      >
        <p className="text-white/90">{questions.length}回の質問で終了しました！</p>
      </motion.div>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}>
        <Button
          onClick={resetGame}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          もう一度遊ぶ
        </Button>
      </motion.div>
    </motion.div>
  )
}
 