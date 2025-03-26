"use client";

import { useGame } from "@/context/game-context";

export default function ProgressBar() {
  const { questions, remainingQuestions, maxQuestions } = useGame();
  const progress = (questions.length / maxQuestions) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-purple-700/80 text-sm mb-2 font-light">
        <span>
          質問: {questions.length}/{maxQuestions}
        </span>
        <span>残り質問: {remainingQuestions}</span>
      </div>
      <div className="w-full h-2 bg-white/30 backdrop-blur-sm rounded-full overflow-hidden border border-white/40 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-purple-400/80 to-indigo-500/80 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
