"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { characters } from "@/data/characters"
import { animals } from "@/data/animals"
import { countries } from "@/data/countries"
import { persons } from "@/data/persons"
import { scienceWords } from "@/data/scienceWords"
import type { Category } from "@/context/game-context"

interface TopicListModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category
}

export default function TopicListModal({ isOpen, onClose, category }: TopicListModalProps) {
  const getTopicList = () => {
    switch (category) {
      case "animals":
        return animals.map(item => item.name)
      case "countries":
        return countries.map(item => item.name)
      case "scienceWords":
        return scienceWords.map(item => item.name)
      case "persons":
        return persons.map(item => item.name)
      case "characters":
      default:
        return characters.map(item => item.name)
    }
  }

  const categoryNameMapping: Record<string, string> = {
    "characters": "キャラクター",
    "animals": "動物",
    "countries": "国",
    "persons": "人物",
    "scienceWords": "理科の用語"
  }

  const topicList = getTopicList()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {categoryNameMapping[category] || category}のお題一覧
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topicList.map((name, index) => (
              <div
                key={index}
                className="p-2 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-colors"
              >
                {name}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 