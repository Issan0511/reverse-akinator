"use client"

import { useGame } from "@/context/game-context"
import IntroScreen from "@/components/screens/intro-screen"
import PlayingScreen from "@/components/screens/playing-screen"
import ResultScreen from "@/components/screens/result-screen"
import { AnimatePresence } from "framer-motion"

export default function GameScreen() {
  const { stage } = useGame()

  return (
    <AnimatePresence mode="wait">
      {stage === "intro" && <IntroScreen key="intro" />}
      {stage === "playing" && <PlayingScreen key="playing" />}
      {stage === "result" && <ResultScreen key="result" />}
    </AnimatePresence>
  )
}

