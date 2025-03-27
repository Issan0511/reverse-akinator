"use client";

import { useEffect } from "react";
import { useGame } from "@/context/game-context";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import WizardCharacter from "@/components/wizard-character";
import ThoughtBubble from "@/components/thought-bubble";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function IntroScreen() {
  const { setStage, setWizardEmotion, setCustomTopic } = useGame();
  const pathname = usePathname();

  // ページ読み込み時にURLパラメータとセッションストレージを確認
  useEffect(() => {
    // URLからのカスタムトピック検出（既存処理を残す）
    const checkCustomTopic = () => {
      if (!pathname) return;
      
      try {
        const decodedPath = decodeURIComponent(pathname);
        const match = decodedPath.match(/\/custom\/encodedData=([^/]+)/);
        
        if (match && match.length === 2) {
          const encodedData = match[1];
          const decodedData = atob(encodedData);
          const [category, character] = decodedData.split(":").map(decodeURIComponent);
          console.log("URLからカスタムトピック検出:", { category, character });
          
          // カスタムトピックをセット
          setCustomTopic(category, character);
          
          // 直接プレイ画面に遷移
          setWizardEmotion("excited");
          setTimeout(() => {
            setStage("playing");
          }, 1000);
          return true;
        }
      } catch (error) {
        console.error("URLカスタムトピック処理エラー:", error);
      }
      return false;
    };
    
    // セッションストレージからのカスタムトピック検出
    const checkSessionStorage = () => {
      const hasCustomTopic = sessionStorage.getItem("hasCustomTopic");
      
      if (hasCustomTopic === "true") {
        const category = sessionStorage.getItem("customTopicCategory");
        const character = sessionStorage.getItem("customTopicCharacter");
        
        if (category && character) {
          console.log("セッションストレージからカスタムトピック検出:", { category, character });
          
          // 使用したらセッションストレージから削除
          sessionStorage.removeItem("hasCustomTopic");
          sessionStorage.removeItem("customTopicCategory");
          sessionStorage.removeItem("customTopicCharacter");
          
          // カスタムトピックをセット
          setCustomTopic(category, character);
          
          // 直接プレイ画面に遷移
          setWizardEmotion("excited");
          setTimeout(() => {
            setStage("playing");
          }, 1000);
          return true;
        }
      }
      return false;
    };
    
    // URLとセッションストレージの両方をチェック
    if (!checkCustomTopic()) {
      checkSessionStorage();
    }
  }, [pathname, setCustomTopic, setStage]);

  const handleStart = () => {
    setWizardEmotion("excited");
    setTimeout(() => {
      setStage("category");
    }, 1000);
  };

  const handleCustomTopic = () => {
    setWizardEmotion("excited");
    setTimeout(() => {
      setStage("customTopic");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center p-6 h-full"
    >
      {/* ウィザードキャラクターと吹き出し */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
        className="mb-8 relative w-full max-w-4xl px-4"
      >
        <div className="flex items-center justify-center space-x-4 md:space-x-12 scale-75 md:scale-100">
          <WizardCharacter emotion="thinking" />
          <ThoughtBubble />
        </div>
      </motion.div>

      {/* ゲームタイトルとサブタイトル */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 50 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-4 game-font tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-yellow-300 text-glow">
          逆アキネーター
        </h1>
        <motion.p
          className="text-xl md:text-2xl text-white/90 game-font"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="inline-flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-yellow-300 animate-pulse" />
            魔法使いの考えるキャラクターを当てよう！
            <Sparkles className="h-5 w-5 ml-2 text-yellow-300 animate-pulse" />
          </span>
        </motion.p>
      </motion.div>

      {/* ゲームの説明文 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-10 max-w-md px-4 game-font"
      >
        <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 shadow-lg">
          <p className="text-white/90 mb-4 leading-relaxed">
            魔法使いがこれから選ぶカテゴリーの中から何か1つを思い浮かべます。
            質問をして、誰・何なのかを当ててみましょう！
          </p>
          <p className="text-white/90 leading-relaxed">
            質問は<span className="text-yellow-300 font-bold">20回まで</span>
            可能です。賢く質問して、魔法使いの考えるキャラクターを見つけ出しましょう！
          </p>
        </div>
      </motion.div>

      {/* ゲーム開始ボタン */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={handleStart}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-10 py-6 rounded-full text-xl font-medium shadow-xl hover:shadow-2xl transition-all game-font border-2 border-white/20 flex items-center gap-2"
        >
          <Sparkles className="h-5 w-5 text-yellow-300" />
          ゲームを始める
        </Button>
      </motion.div>

      {/* カスタムお題追加ボタン */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-4"
      >
        <Button
          onClick={handleCustomTopic}
          className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white px-10 py-6 rounded-full text-xl font-medium shadow-xl hover:shadow-2xl transition-all game-font border-2 border-white/20 flex items-center gap-2"
        >
          <Sparkles className="h-5 w-5 text-yellow-300" />
          カスタムお題追加
        </Button>
      </motion.div>

      {/* 背景の魔法エフェクト */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 backdrop-blur-sm"
          style={{
            width: Math.random() * 60 + 20,
            height: Math.random() * 60 + 20,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1],
            x: [0, Math.random() * 20 - 10, 0],
            y: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: Math.random() * 5 + 5,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </motion.div>
  );
}
