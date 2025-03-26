"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useCallback } from "react"
import { useAuth } from "@/hooks/useAuth";
import { characters } from "@/data/characters"
import type { Character } from "@/types/character"
import { countries } from "@/data/countries"
import type { Country } from "@/types/character"
import { animals } from "@/data/animals"
import type { Animal } from "@/types/character"
import { persons } from "@/data/persons"
import type { Person } from "@/types/character"
import { scienceWords } from "@/data/scienceWords"
import type { ScienceWord } from "@/types/character"
import { prefectures } from "@/data/prefectures"
import type { prefecture } from "@/types/character"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { auth } from "@/firebase/firebaseConfig"
import { db } from "@/firebase/firebaseConfig"

// 選択可能なカテゴリーを定義（必要に応じて追加してください）
export type Category = "characters" | "animals" | "countries"| "programs" | "scienceWords" | "persons" | "prefecture"

type GameStage = "intro" | "playing" | "result"| "category"| "rank"

// selectedCharacter をユニオン型にする
type SelectedCharacter = Character | Animal | Country | prefecture | null

interface GameContextType {
  stage: GameStage
  setStage: (stage: GameStage) => void
  selectedCharacter: SelectedCharacter
  selectRandomCharacter: () => void
  questions: { question: string; answer: string; reason?: string }[]
  addQuestion: (question: string, answer: string, reason?: string ) => void
  resetGame: () => void
  wizardEmotion: "neutral" | "thinking" | "happy" | "excited" | "confused"
  setWizardEmotion: (emotion: "neutral" | "thinking" | "happy" | "excited" | "confused") => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  maxQuestions: number
  remainingQuestions: number
  selectedCategory: Category
  setCategory: (category: Category) => void
  isSuccess: boolean
  // ギブアップフラグを追加
  didGiveUp: boolean

  giveUp: () => void
  // ここで user, loading を追加
  user: any;
  loading: boolean;
  // 回答権の状態を追加
  remainingAnswerAttempts: number
  decrementAnswerAttempts: () => void
  usedHint: boolean
  setUsedHint: (used: boolean) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<GameStage>("intro")
  const { user, loading } = useAuth(); // ★ ここでFirebaseのユーザー情報を取得
  // 選択されたキャラクターをユニオン型で扱う
  const [selectedCharacter, setSelectedCharacter] = useState<SelectedCharacter>(null)
  const [questions, setQuestions] = useState<{ question: string; answer: string ; reason? : string}[]>([])
  const [wizardEmotion, setWizardEmotion] = useState<"neutral" | "thinking" | "happy" | "excited" | "confused">(
    "neutral",
  )
  const [isLoading, setIsLoading] = useState(false)
  // カテゴリー選択状態とその更新関数を追加（初期値は "characters"）
  const [selectedCategory, setCategory] = useState<Category>("characters")
  const [isSuccess, setIsSuccess] = useState(true)

  const [didGiveUp, setDidGiveUp] = useState(false)
  // 回答権の状態を追加（無限大に設定）
  const [remainingAnswerAttempts, setRemainingAnswerAttempts] = useState(Infinity)
  const [usedHint, setUsedHint] = useState(false)

  const maxQuestions = 20
  const remainingQuestions = maxQuestions - questions.length

  useEffect(() => {
    resetGame()
  }, [])

  const selectRandomCharacter = () => {
    let dataSource: (
      | Character
      | Animal
      | Country
      | ScienceWord
      | Person
      | prefecture
    )[];
  
    switch (selectedCategory) {
      case "animals":
        dataSource = animals;
        break;
      case "countries":
        dataSource = countries;
        break;
      case "scienceWords":
        dataSource = scienceWords;
        break;
      case "persons":
        dataSource = persons;
        break;
      case "prefecture":
        dataSource = prefectures;
        break;
      case "characters":
      default:
        dataSource = characters;
        break;
    }
  
    const randomIndex = Math.floor(Math.random() * dataSource.length);
    setSelectedCharacter(dataSource[randomIndex] || null);
  };
  
  
  
  
  
  

  const addQuestion = async (question: string, answer: string, reason?: string) => {
    console.log("addQuestion開始:", { question, answer, reason, usedHint });
    setQuestions([...questions, { question, answer, reason }])

    // デバッグログを追加
    console.log("デバッグ情報:", {
      usedHint,
      answer,
      willRegisterRanking: !usedHint && answer === "答えに到達"
    });

    // 「答えに到達」の場合は成功として明示的に設定
    if (answer === "答えに到達") {
      setIsSuccess(true)
      console.log("答えに到達しました。usedHint:", usedHint);
    }

    // ヒントを使用していない場合のみランキングに登録
    if (!usedHint && answer === "答えに到達") {
      console.log("ランキング登録条件を満たしています。登録処理を開始します。");
      try {
        const user = auth.currentUser
        if (!user) {
          console.log("ランキングに登録するにはログインが必要です")
          return
        }

        if (!selectedCategory || !selectedCharacter) {
          console.error("カテゴリーまたはキャラクターが選択されていません")
          return
        }

        console.log("ランキング登録開始:", {
          userId: user.uid,
          category: selectedCategory,
          characterId: selectedCharacter.id,
          questionCount: questions.length
        })

        const rankingRef = collection(db, "rankings")
        const newRanking = {
          userId: user.uid,
          category: selectedCategory,
          characterId: selectedCharacter.id,
          questionCount: questions.length,
          createdAt: serverTimestamp(),
        }
        await addDoc(rankingRef, newRanking)
        console.log("ランキングに登録しました")
      } catch (error) {
        console.error("ランキング登録エラー:", error)
        if (error instanceof Error) {
          console.error("エラーの詳細:", error.message)
        }
      }
    } else if (answer === "答えに到達") {
      console.log("ヒントを使用したため、ランキングには登録されません")
    }

    // Check if game should end
    if (questions.length + 1 >= maxQuestions) {
      setIsSuccess(false)
      setStage("result")
    }
  }

  const giveUp = () => {
    setDidGiveUp(true)    // ギブアップフラグをtrueにする
    setIsSuccess(false)   // 成功フラグはfalse
    setStage("result")
  }

  // 回答権を減らす関数（無効化）
  const decrementAnswerAttempts = () => {
    // 何もしない（回答権は減らない）
  }

  const resetGame = () => {
    // selectRandomCharacter()
    setQuestions([])
    setStage("intro")
    setWizardEmotion("neutral")
    setIsSuccess(true)
    setDidGiveUp(false) // ギブアップフラグをリセット
    setRemainingAnswerAttempts(Infinity) // 回答権をリセット
    setUsedHint(false) // ゲームリセット時にヒント使用状態もリセット
  }

  return (
    <GameContext.Provider
      value={{
        stage,
        setStage,
        selectedCharacter,
        selectedCategory,
        setCategory,
        questions,
        addQuestion,
        resetGame,
        wizardEmotion,
        setWizardEmotion,
        isLoading,
        setIsLoading,
        maxQuestions,
        remainingQuestions,

        selectRandomCharacter, // ここで公開する

        isSuccess,
        giveUp,
        didGiveUp, // 追加公開

        // ★ userとloadingも一緒に提供
        user,
        loading,
        // 回答権の状態を追加
        remainingAnswerAttempts,
        decrementAnswerAttempts,
        usedHint,
        setUsedHint,

      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

