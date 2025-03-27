"use client";

import { useGame } from "@/context/game-context";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";
import { Sparkles, MessageCircle, LightbulbIcon } from "lucide-react";

export default function QuestionHistory() {
  const { questions } = useGame();
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const lastQuestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (questions.length > 0 && lastQuestionRef.current) {
      // 最後の質問要素を表示するためにスクロール
      lastQuestionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [questions]);

  if (questions.length === 0) {
    return (
      <div className="text-left p-6 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg game-font">
        <div className="flex items-center gap-2 mb-4">
          <LightbulbIcon className="h-6 w-6 text-yellow-300 animate-pulse" />
          <h3 className="fancy-heading text-xl">ヒント</h3>
        </div>
        <div className="space-y-3">
          <p className="leading-relaxed flex items-start gap-2">
            <span className="badge badge-q mt-1 flex-shrink-0">1</span>
            <span>「はい」か「いいえ」かで答えられる質問をしましょう</span>
          </p>
          <p className="leading-relaxed flex items-start gap-2">
            <span className="badge badge-q mt-1 flex-shrink-0">2</span>
            <span>質問を重ねて情報を集めていきましょう</span>
          </p>
          <p className="leading-relaxed flex items-start gap-2">
            <span className="badge badge-q mt-1 flex-shrink-0">3</span>
            <span>答えが分かったら「答えは～ですか？」と質問しましょう</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-font">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="h-5 w-5 text-purple-300" />
        <h3 className="fancy-heading text-lg">質問履歴</h3>
        <span className="ml-auto text-sm text-white/70">
          {questions.length}問目
        </span>
      </div>

      <ScrollArea className="h-80 rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm shadow-xl">
        <ScrollAreaPrimitive.Viewport
          ref={scrollViewportRef}
          className="h-full w-full"
        >
          <div className="space-y-4 p-4">
            <AnimatePresence>
              {questions.map((q, index) => (
                <motion.div
                  key={index}
                  // ここで最後の要素にだけrefを設定
                  ref={
                    index === questions.length - 1 ? lastQuestionRef : undefined
                  }
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="question-card p-4"
                >
                  <p className="font-medium text-white mb-3 flex items-center">
                    <span className="badge badge-q">Q</span>
                    {q.question}
                  </p>
                  <p
                    className={`
                    font-bold flex items-center text-indigo-400
                    ${q.answer === "はい" ? "text-green-400" : ""} 
                    ${q.answer === "いいえ" ? "text-red-400" : ""} 
                    ${q.answer === "わからない" ? "text-yellow-400" : ""}
                  `}
                  >
                    <span
                      className={`
                      badge
                      ${q.answer === "はい" ? "badge-a-yes" : ""} 
                      ${q.answer === "いいえ" ? "badge-a-no" : ""} 
                      ${q.answer === "わからない" ? "badge-a-unknown" : ""}
                    `}
                    >
                      A
                    </span>
                    {q.answer}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollAreaPrimitive.Viewport>
      </ScrollArea>
    </div>
  );
}
