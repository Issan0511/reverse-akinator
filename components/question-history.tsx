"use client";

import { useGame } from "@/context/game-context";
import { motion, AnimatePresence } from "framer-motion";

export default function QuestionHistory() {
  const { questions, answers } = useGame();

  if (questions.length === 0) {
    return (
      <div className="text-left p-4 text-white/70">
        「はい」か「いいえ」かで答えられる質問をして、
        <br />
        お題について情報を集めましょう！
        <br />
        答えが分かったら、
        <br />
        「答えは～ですか？」と質問しましょう！
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2">
      <AnimatePresence>
        {questions.map((question, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div className="bg-purple-500/80 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                Q
              </div>
              <div className="text-white flex-1">{question}</div>
            </div>

            {answers[index] && (
              <div className="flex items-start gap-3 mt-2 pl-9">
                <div className="bg-indigo-500/80 text-white p-1 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  A
                </div>
                <div className="text-white/90 flex-1">
                  <span className="font-medium">
                    {answers[index].judgement}
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
