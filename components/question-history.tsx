"use client"

import { useGame } from "@/context/game-context"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { useEffect, useRef } from "react"

export default function QuestionHistory() {
  const { questions } = useGame()
  const scrollViewportRef = useRef<HTMLDivElement>(null)
  const lastQuestionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (questions.length > 0 && lastQuestionRef.current) {
      // 最後の質問要素を表示するためにスクロール
      lastQuestionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [questions])
  
  if (questions.length === 0) {
    return <div className="text-left p-4 text-white/70">「はい」か「いいえ」かで答えられる質問をして、<br/>お題について情報を集めましょう！<br/>答えが分かったら、<br/>「答えは～ですか？」と質問しましょう！ </div>
  }

  return (
    <ScrollArea className="h-80">
      <ScrollAreaPrimitive.Viewport ref={scrollViewportRef} className="h-full w-full">
        <div className="space-y-4 p-2">
          <AnimatePresence>
            {questions.map((q, index) => (
              <motion.div
                key={index}
                // ここで最後の要素にだけrefを設定
                ref={index === questions.length - 1 ? lastQuestionRef : undefined}
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
      </ScrollAreaPrimitive.Viewport>
    </ScrollArea>
  )
}
