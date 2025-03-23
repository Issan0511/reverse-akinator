"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { characters } from "@/data/characters"
import type { Character } from "@/types/character"
import { countries } from "@/data/countries"
import type { Country } from "@/types/character"
import { animals } from "@/data/animals"
import type { Animal } from "@/types/character"


// 選択可能なカテゴリーを定義（必要に応じて追加してください）
export type Category = "characters" | "animals" | "countries"


type GameStage = "intro" | "playing" | "result"| "category"

// selectedCharacter をユニオン型にする
type SelectedCharacter = Character | Animal | Country | null

interface GameContextType {
  stage: GameStage
  setStage: (stage: GameStage) => void
  selectedCharacter: SelectedCharacter
  questions: { question: string; answer: string }[]
  addQuestion: (question: string, answer: string) => void
  resetGame: () => void
  wizardEmotion: "neutral" | "thinking" | "happy" | "excited" | "confused"
  setWizardEmotion: (emotion: "neutral" | "thinking" | "happy" | "excited" | "confused") => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  maxQuestions: number
  remainingQuestions: number
  selectedCategory: Category
  setCategory: (category: Category) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<GameStage>("intro")
  // 選択されたキャラクターをユニオン型で扱う
  const [selectedCharacter, setSelectedCharacter] = useState<SelectedCharacter>(null)
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([])
  const [wizardEmotion, setWizardEmotion] = useState<"neutral" | "thinking" | "happy" | "excited" | "confused">(
    "neutral",
  )
  const [isLoading, setIsLoading] = useState(false)
  // カテゴリー選択状態とその更新関数を追加（初期値は "person"）
  const [selectedCategory, setCategory] = useState<Category>("characters")
  const maxQuestions = 25
  const remainingQuestions = maxQuestions - questions.length

  useEffect(() => {
    resetGame()
  }, [])

  const selectRandomCharacter = () => {
    let dataSource: (Character | Animal | Country)[]
    switch (selectedCategory) {
      case "animals":
        dataSource = animals
        break
      case "countries":
        dataSource = countries
        break
      default:
        // "characters" の場合
        dataSource = characters
        break
    }
    const randomIndex = Math.floor(Math.random() * dataSource.length)
    setSelectedCharacter(dataSource[randomIndex] || null)
  }

  const addQuestion = (question: string, answer: string) => {
    setQuestions([...questions, { question, answer }])

    // Check if game should end
    if (questions.length + 1 >= maxQuestions) {
      setStage("result")
    }
  }

  const resetGame = () => {
    selectRandomCharacter()
    setQuestions([])
    setStage("intro")
    setWizardEmotion("neutral")
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

