"use client"

import { motion } from "framer-motion"

type WizardEmotion = "neutral" | "thinking" | "happy" | "excited" | "confused"

interface WizardCharacterProps {
  emotion: WizardEmotion
}

export default function WizardCharacter({ emotion }: WizardCharacterProps) {
  const getEmotionStyles = () => {
    switch (emotion) {
      case "thinking":
        return {
          body: "rotate-3",
          eyes: "animate-pulse",
          mouth: "w-4 h-1 rounded-full",
          eyebrows: "-translate-y-1",
        }
      case "happy":
        return {
          body: "scale-105",
          eyes: "h-4 w-4",
          mouth: "h-3 w-8 border-t-4 rounded-t-full",
          eyebrows: "rotate-0",
        }
      case "excited":
        return {
          body: "scale-110 rotate-3",
          eyes: "h-5 w-5 animate-pulse",
          mouth: "h-5 w-10 border-t-4 rounded-t-full",
          eyebrows: "rotate-12 -translate-y-1",
        }
      case "confused":
        return {
          body: "rotate-2",
          eyes: "h-4 w-4",
          mouth: "w-6 h-1 rotate-12 rounded-full",
          eyebrows: "rotate-12",
        }
      default:
        return {
          body: "",
          eyes: "",
          mouth: "w-6 h-1 rounded-full",
          eyebrows: "",
        }
    }
  }

  const styles = getEmotionStyles()

  return (
    <motion.div
      className={`relative ${styles.body} transition-all duration-300`}
      animate={{ scale: [1, 1.05, 1], rotate: emotion === "thinking" ? [0, 3, 0, -3, 0] : 0 }}
      transition={{
        repeat: emotion === "thinking" ? Number.POSITIVE_INFINITY : 0,
        duration: 2,
      }}
    >
      {/* Wizard hat */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-indigo-800 z-10">
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-80 h-10 bg-indigo-800 rounded-full -z-10"></div>
        {/* Stars on hat */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-yellow-300 rounded-full"
            style={{
              top: `${10 + i * 15}px`,
              left: i % 2 === 0 ? "10px" : "-20px",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Wizard face */}
      <div className="w-40 h-40 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full flex flex-col items-center justify-center relative overflow-hidden border-4 border-indigo-800">
        {/* Eyebrows */}
        <div className="flex w-full justify-center gap-8 mb-2">
          <motion.div
            className={`w-6 h-1 bg-indigo-900 rounded-full ${styles.eyebrows}`}
            animate={{ rotate: emotion === "thinking" ? [0, 15, 0] : 0 }}
            transition={{ repeat: emotion === "thinking" ? Number.POSITIVE_INFINITY : 0, duration: 2 }}
          />
          <motion.div
            className={`w-6 h-1 bg-indigo-900 rounded-full ${styles.eyebrows}`}
            animate={{ rotate: emotion === "thinking" ? [0, 15, 0] : 0 }}
            transition={{ repeat: emotion === "thinking" ? Number.POSITIVE_INFINITY : 0, duration: 2 }}
          />
        </div>

        {/* Eyes */}
        <div className="flex w-full justify-center gap-8 mb-4">
          <motion.div
            className={`h-4 w-4 bg-indigo-900 rounded-full ${styles.eyes}`}
            animate={{
              scaleY: emotion === "thinking" ? [1, 0.2, 1] : 1,
            }}
            transition={{
              repeat: emotion === "thinking" ? Number.POSITIVE_INFINITY : 0,
              duration: 2,
            }}
          />
          <motion.div
            className={`h-4 w-4 bg-indigo-900 rounded-full ${styles.eyes}`}
            animate={{
              scaleY: emotion === "thinking" ? [1, 0.2, 1] : 1,
            }}
            transition={{
              repeat: emotion === "thinking" ? Number.POSITIVE_INFINITY : 0,
              duration: 2,
            }}
          />
        </div>

        {/* Mouth */}
        <motion.div
          className={`bg-indigo-900 ${styles.mouth} transition-all duration-300`}
          animate={{
            width: emotion === "thinking" ? [16, 24, 16] : undefined,
            height: emotion === "happy" || emotion === "excited" ? 12 : undefined,
            borderTopWidth: emotion === "happy" || emotion === "excited" ? 4 : 0,
          }}
          transition={{
            repeat: emotion === "thinking" ? Number.POSITIVE_INFINITY : 0,
            duration: 2,
          }}
        />

        {/* Beard */}
        <div className="absolute bottom-0 w-full h-16 bg-white rounded-t-full" />
      </div>

      {/* Wizard body/robe */}
      <div className="w-60 h-40 bg-gradient-to-b from-indigo-600 to-indigo-800 -mt-10 rounded-t-full relative">
        {/* Stars on robe */}
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-yellow-300 rounded-full"
            style={{
              top: `${20 + i * 15}px`,
              left: i % 2 === 0 ? `${20 + i * 10}px` : `${40 - i * 5}px`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}

