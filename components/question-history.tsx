"use client";

import { useGame } from "@/context/game-context";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

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
      <div className="text-left p-6 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
          <h3 className="font-bold text-lg text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
            ヒント
          </h3>
        </div>
        <p className="leading-relaxed">
          「はい」か「いいえ」かで答えられる質問をして、
          <br />
          お題について情報を集めましょう！
          <br />
          答えが分かったら、
          <br />
          「答えは～ですか？」と質問しましょう！
        </p>
      </div>
    );
  }

  return (
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
                className="bg-white/10 p-4 rounded-lg border border-white/10 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/15"
              >
                <p className="font-medium text-white mb-2 flex items-center">
                  <span className="inline-block bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                    Q
                  </span>
                  {q.question}
                </p>
                <p
                  className={`
                  font-bold flex items-center
                  ${q.answer === "はい" ? "text-green-400" : ""} 
                  ${q.answer === "いいえ" ? "text-red-400" : ""} 
                  ${q.answer === "わからない" ? "text-yellow-400" : ""}
                `}
                >
                  <span
                    className={`
                    inline-block text-xs font-bold px-2 py-1 rounded-full mr-2
                    ${q.answer === "はい" ? "bg-green-600" : ""} 
                    ${q.answer === "いいえ" ? "bg-red-600" : ""} 
                    ${q.answer === "わからない" ? "bg-yellow-600" : ""}
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
  );
}
