"use client"

import { useGame } from "@/context/game-context"
import { motion, AnimatePresence } from "framer-motion"

export default function QuestionHistory() {
  const { questions } = useGame()

  if (questions.length === 0) {
    return <div className="text-center p-4 text-white/70">はいかいいえかで答えられる質問をして、キャラクターについて情報を集めましょう！<br/>答えが分かったら、「答えは～ですか？」と質問しましょう！ </div>
  }

  return (
    <div className="space-y-4 p-2">
      <AnimatePresence>
        {questions.map((q, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 p-4 rounded-lg"
          >
            <p className="font-medium text-white mb-2">Q: {q.question}</p>
            <p
              className={`
              font-bold 
              ${q.answer === "はい" ? "text-green-400" : ""} 
              ${q.answer === "いいえ" ? "text-red-400" : ""} 
              ${q.answer === "わからない" ? "text-yellow-400" : ""}
            `}
            >
              A: {q.answer}
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

