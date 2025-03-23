"use client"

import type React from "react"
import { useState } from "react"
import { useGame } from "@/context/game-context"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import WizardCharacter from "@/components/wizard-character"
import QuestionHistory from "@/components/question-history"
import ProgressBar from "@/components/progress-bar"

export default function PlayingScreen() {
  const {
    addQuestion,
    wizardEmotion,
    setWizardEmotion,
    isLoading,
    setIsLoading,
    selectedCharacter,
    remainingQuestions,
    setStage,
    giveUp,
  } = useGame()

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("初期状態")

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || isLoading) return

    setIsLoading(true)
    setWizardEmotion("thinking")

    try {
      const response = await fetch("/api/answer-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
          character: selectedCharacter,
        }),
      })
      const data = await response.json()
      console.log("Answer:", data)
      // ここで data.answer は次のような形式を想定：
      // { "thinking-process": "～", "judgement": "いいえ" }
      const { judgement, "thinking-process": thinkingProcess } = data.answer;
      console.log("judgement:", judgement);
      console.log("thinkingProcess:", thinkingProcess);
      const newAnswer = judgement
      const reason = thinkingProcess
      setAnswer(newAnswer)
      // 例として、思考過程も履歴に残したい場合は addQuestion を拡張する
      setTimeout(() => {
        // addQuestion(question, judgement) の代わりに、必要なら思考過程も渡す
        addQuestion(question, 
          newAnswer  ,reason      )
        setQuestion("")

        // ウィザードの表情は judgement によって変化
        if (newAnswer === "はい") {
          setWizardEmotion("happy")
        } else if (newAnswer === "いいえ") {
          setWizardEmotion("neutral")
        } else if (newAnswer === "答えに到達") {
          setWizardEmotion("excited") // お好みで変更
        } else {
          setWizardEmotion("confused")
        }
        setIsLoading(false)
        
        // 残りの質問がなくなったら結果画面へ
        if (remainingQuestions <= 1||newAnswer === "答えに到達") {
          setTimeout(() => {
            setStage("result")
          }, 1000)
        }
      }, 1500)
    } catch (error) {
      console.error("Error getting answer:", error)
      setWizardEmotion("confused")
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <div className="p-4 border-b border-white/20">
        <ProgressBar />
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-1/2 p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <QuestionHistory />
          </div>

          <form onSubmit={handleSubmitQuestion} className="mt-4">
            <div className="flex gap-2">
              <Input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="質問を入力してください..."
                disabled={isLoading}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
              />
              <Button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
              >
                質問する
              </Button>
            </div>
          </form>
          
          <div className="mt-3 text-center">
            <Button
              onClick={giveUp}
              variant="outline"
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              ギブアップする
            </Button>
          </div>
        </div>

        <div className="mt-9 w-full md:w-1/2 p-4 flex items-center justify-center">
          <WizardCharacter emotion={wizardEmotion} />
        </div>
      </div>
    </motion.div>
  )
}
