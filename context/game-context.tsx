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
import type { Prefecture } from "@/types/character"
import { gekiMuzu } from "@/data/gekiMuzu";
import type { GekiMuzu } from "@/types/character";
import { db } from "@/firebase"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

// 選択可能なカテゴリーを定義（必要に応じて追加してください）
export type Category = "characters" | "animals" | "countries"| "programs" | "scienceWords" | "persons" | "prefecture" | "gekiMuzu"

type GameStage = "intro" | "playing" | "result"| "category"| "rank"

// selectedCharacter をユニオン型にする
type SelectedCharacter = Character | Animal | Country | Prefecture | null

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
  // 回答権の状態を追加（初期値3）
  const [remainingAnswerAttempts, setRemainingAnswerAttempts] = useState(3)

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
      | Prefecture
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
  
  const addQuestion = (question: string, answer: string, reason?:string) => {
    setQuestions([...questions, { question, answer, reason }])

    // 「答えに到達」の場合は成功として明示的に設定
    if (answer === "答えに到達") {
      setIsSuccess(true)
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

  // 回答権を減らす関数
  const decrementAnswerAttempts = () => {
    setRemainingAnswerAttempts((prev) => Math.max(0, prev - 1))
  }

  const resetGame = () => {
    // selectRandomCharacter()
    setQuestions([])
    setStage("intro")
    setWizardEmotion("neutral")
    setIsSuccess(true)
    setDidGiveUp(false) // ギブアップフラグをリセット
    setRemainingAnswerAttempts(3) // 回答権をリセット
  }

  
  // const getFixedGekiMuzuTopic = async () => {
  //   if (!user) return null;

  //   const docRef = doc(db, "gekiMuzuTopics", user.uid);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     const data = docSnap.data();
  //     const today = new Date().toDateString();

  //     if (data.date === today) {
  //       return data.topic;
  //     }
  //   }

  //   // トピックが存在しない場合、新しいトピックを設定
  //   const newTopic = characters[Math.floor(Math.random() * characters.length)];
  //   await setDoc(docRef, { topic: newTopic, date: new Date().toDateString() });

  //   return newTopic;
  // };
  // 激ムズモードの固定トピックを日付から計算する関数
  const caluculateFixedGekiMuzuTopic = (): GekiMuzu => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const total = (day + month*100 + year*10000)*day;
    const index = total % gekiMuzu.length;
    return gekiMuzu[index];
  };


  const handleCategorySelect = async (category: Category) => {
    setCategory(category);

    if (category === "gekiMuzu") {
      const fixedTopic = caluculateFixedGekiMuzuTopic();
      setSelectedCharacter(fixedTopic);
    } else {
      selectRandomCharacter();
    }
  };

  return (
    <GameContext.Provider
      value={{
        stage,
        setStage,
        selectedCharacter,
        selectedCategory,
        setCategory: handleCategorySelect,
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

