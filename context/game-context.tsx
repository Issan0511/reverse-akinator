"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { characters } from "@/data/characters"
import type { Character } from "@/types/character"

type GameStage = "intro" | "playing" | "result"

interface GameContextType {
  stage: GameStage
  setStage: (stage: GameStage) => void
  selectedCharacter: Character | null
  questions: { question: string; answer: string }[]
  addQuestion: (question: string, answer: string) => void
  resetGame: () => void
  wizardEmotion: "neutral" | "thinking" | "happy" | "excited" | "confused"
  setWizardEmotion: (emotion: "neutral" | "thinking" | "happy" | "excited" | "confused") => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  remainingQuestions: number
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<GameStage>("intro")
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null)
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([])
  const [wizardEmotion, setWizardEmotion] = useState<"neutral" | "thinking" | "happy" | "excited" | "confused">(
    "neutral",
  )
  const [isLoading, setIsLoading] = useState(false)
  const maxQuestions = 10
  const remainingQuestions = maxQuestions - questions.length

  useEffect(() => {
    resetGame()
  }, [])

  const selectRandomCharacter = () => {
    const randomIndex = Math.floor(Math.random() * characters.length)
    setSelectedCharacter(characters[randomIndex])
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
        questions,
        addQuestion,
        resetGame,
        wizardEmotion,
        setWizardEmotion,
        isLoading,
        setIsLoading,
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

