"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useGame } from "@/context/game-context"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import WizardCharacter from "@/components/wizard-character"
import QuestionHistory from "@/components/question-history"
import ProgressBar from "@/components/progress-bar"
import TopicListModal from "@/components/topic-list-modal"
import { List } from "lucide-react"
import { characters } from "@/data/characters"
import { animals } from "@/data/animals"
import { countries } from "@/data/countries"
import { persons } from "@/data/persons"
import { scienceWords } from "@/data/scienceWords"
import type { Character } from "@/types/character"

// カテゴリー名の日本語マッピング
const categoryNameMapping: Record<string, string> = {
  "characters": "キャラクター",
  "animals": "動物",
  "foods": "食べ物",
  "places": "場所",
  "objects": "物",
  "countries": "国",
  "persons": "人物",
  "scienceWords": "理系用語",
  "prefecture": "都道府県"
}

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
    selectedCategory,
    remainingAnswerAttempts,
    decrementAnswerAttempts,
  } = useGame()

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("初期状態")
  const [remainingTime, setRemainingTime] = useState(300)
  const [isTopicListOpen, setIsTopicListOpen] = useState(false)

  // コンポーネントマウント時にトップにスクロール
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isLoading) return;
  
    const timerId = setInterval(() => {
      setRemainingTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  
    return () => clearInterval(timerId);
  }, [isLoading]);
  
  // remainingTime の更新を監視し、0 になったときに giveUp() を呼ぶ
  useEffect(() => {
    if (remainingTime === 0) {
      giveUp();
    }
  }, [remainingTime, giveUp]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim() || isLoading) return

    // 現在のカテゴリーのお題リストを取得
    let topicList: string[] = [];
    switch (selectedCategory) {
      case "animals":
        topicList = animals.map((item: Character) => item.name);
        break;
      case "countries":
        topicList = countries.map((item: Character) => item.name);
        break;
      case "scienceWords":
        topicList = scienceWords.map((item: Character) => item.name);
        break;
      case "persons":
        topicList = persons.map((item: Character) => item.name);
        break;
      case "characters":
      default:
        topicList = characters.map((item: Character) => item.name);
        break;
    }

    // 質問文に具体的なお題の名前が含まれているかをチェック
    const isAnswerAttempt = question.includes("ですか") && 
      topicList.some(name => question.includes(name));

    // 回答権が0の状態で回答を試みた場合は処理を中断
    if (isAnswerAttempt && remainingAnswerAttempts <= 0) {
      alert("回答権を使い切りました。")
      return
    }

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
      const { judgement, "thinking-process": thinkingProcess } = data.answer;
      const newAnswer = judgement
      const reason = thinkingProcess

      // 回答権を消費する条件：
      // 1. 具体的なお題の名前を含む質問をした場合
      // 2. 「答えに到達」と判定された場合
      if (isAnswerAttempt || newAnswer === "答えに到達") {
        decrementAnswerAttempts()
      }

      setAnswer(newAnswer)
      setTimeout(() => {
        addQuestion(question, newAnswer, reason)
        setQuestion("")

        if (newAnswer === "はい") {
          setWizardEmotion("happy")
        } else if (newAnswer === "いいえ") {
          setWizardEmotion("neutral")
        } else if (newAnswer === "答えに到達") {
          setWizardEmotion("excited")
        } else {
          setWizardEmotion("confused")
        }
        setIsLoading(false)
        
        // 残りの質問がなくなったか、答えに到達したか、回答権がなくなった場合は結果画面へ
        if (remainingQuestions <= 1 || newAnswer === "答えに到達" || remainingAnswerAttempts <= 0) {
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

  // ★ 3) 残り時間の表示用フォーマット
  //    分:秒 の形式にしたい場合は以下のように加工
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen pt-4"
    >
      <div className="px-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <div className="text-white/80">
              カテゴリー: <span className="font-bold text-white">{categoryNameMapping[selectedCategory] || selectedCategory}</span>
            </div>
            <div className="text-white/80">
              残り回答権: <span className={`font-bold ${remainingAnswerAttempts > 0 ? 'text-white' : 'text-red-500'}`}>{remainingAnswerAttempts}</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTopicListOpen(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            <List className="w-4 h-4 mr-2" />
            お題一覧
          </Button>
        </div>
        <ProgressBar />
      </div>

      <div className="flex flex-col md:flex-row flex-1 p-4 gap-8">
        <div className="w-full md:w-1/2 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            <QuestionHistory />
          </div>

          {/* 残り時間を表示 */}
          <div className="text-white text-center mb-4">
            残り時間: {minutes}分{String(seconds).padStart(2, "0")}秒
          </div>

          <form onSubmit={handleSubmitQuestion} className="mb-4">
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
          
          <div className="text-center mb-4">
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

        <div className="w-full md:w-1/2 flex items-center justify-center mt-16 md:mt-8">
          <div className="relative">
            <WizardCharacter emotion={wizardEmotion} />
          </div>
        </div>
      </div>

      <TopicListModal
        isOpen={isTopicListOpen}
        onClose={() => setIsTopicListOpen(false)}
        category={selectedCategory}
      />
    </motion.div>
  )
}
