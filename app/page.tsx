"use client"

import { GameProvider } from "@/context/game-context"
import GameScreen from "@/components/game-screen"
import seedrandom from "seedrandom"
import { useMemo } from "react"

function generateStars(seed: string, count: number) {
  const rng = seedrandom(seed)
  return Array.from({ length: count }).map((_, i) => {
    const size = rng() * 4 + 1
    const top = rng() * 100
    const left = rng() * 100
    const delay = rng() * 5
    const duration = rng() * 5 + 5

    return (
      <div
        key={i}
        className="absolute rounded-full bg-white/10 animate-twinkle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${top}%`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    )
  })
}

export default function Home() {
  const stars = useMemo(() => generateStars("reversenater", 20), [])

  return (
    <GameProvider>
      <main className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-800 to-blue-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stars}
        </div>
        <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
          <GameScreen />
        </div>
      </main>
    </GameProvider>
  )
}
