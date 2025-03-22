"use client"

import { useGame } from "@/context/game-context"

export default function ProgressBar() {
  const { questions, remainingQuestions,maxQuestions } = useGame()
  const progress = (questions.length / maxQuestions) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between text-white/80 text-sm mb-1">
        <span>
          質問: {questions.length}/{maxQuestions}
        </span>
        <span>残り質問: {remainingQuestions}</span>
      </div>
      <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
