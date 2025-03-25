"use client";

import { useGame } from "@/context/game-context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WizardCharacter from "@/components/wizard-character";
import ThoughtBubble from "@/components/thought-bubble";

export default function IntroScreen() {
  const { setStage, setWizardEmotion } = useGame();

  const handleStart = () => {
    setWizardEmotion("excited");
    setTimeout(() => {
      setStage("category");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full"
    >
      {/* タイトル前のテキスト */}
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

      {/* ウィザードキャラクターと吹き出し */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-8 relative"
      >
        <div className="flex items-center justify-center space-x-12">
          <WizardCharacter emotion="neutral" />
          <ThoughtBubble />
        </div>
      </motion.div>

      {/* ゲームタイトルとサブタイトル */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">逆ネーター</h1>
        <p className="text-xl text-white/80">魔法使いの考えるキャラクターを当てよう！</p>
      </motion.div>

      {/* ゲームの説明文 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-8 max-w-md"
      >
        <p className="text-white/90 mb-4">
          魔法使いがこれから選ぶカテゴリーの中から何か1つを思い浮かべます。
          質問をして、誰・何なのかを当ててみましょう！
        </p>
        <p className="text-white/90">
          質問は20回まで可能です。賢く質問して、魔法使いの考えるキャラクターを見つけ出しましょう！
        </p>
      </motion.div>

      {/* ゲーム開始ボタン */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Button
          onClick={handleStart}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          ゲームを始める
        </Button>
      </motion.div>
    </motion.div>
  );
}
