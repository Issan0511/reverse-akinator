"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { characters } from "@/data/characters"
import { animals } from "@/data/animals"
import { countries } from "@/data/countries"
import { persons } from "@/data/persons"
import { scienceWords } from "@/data/scienceWords"
import { prefectures } from "@/data/prefectures"
import type { Category } from "@/types/character"
import { Button } from "@/components/ui/button"
import { Eraser } from "lucide-react"

interface TopicListModalProps {
  isOpen: boolean
  onClose: () => void
  category: Category
}

export default function TopicListModal({ isOpen, onClose, category }: TopicListModalProps) {
  // 選択された項目を管理するstate
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

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
      case "prefecture":
        return prefectures.map(item => item.name)
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
    "scienceWords": "理科の用語",
    "prefecture": "都道府県"
  }

  const topicList = getTopicList()

  // 項目をクリックしたときの処理
  const handleItemClick = (name: string) => {
    const newSelectedItems = new Set(selectedItems)
    if (selectedItems.has(name)) {
      newSelectedItems.delete(name)
    } else {
      newSelectedItems.add(name)
    }
    setSelectedItems(newSelectedItems)
  }

  // 選択をリセットする処理
  const handleReset = () => {
    setSelectedItems(new Set())
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-800">
        <DialogHeader className="flex flex-row justify-between items-center">
          <DialogTitle className="text-xl font-bold">
            {categoryNameMapping[category] || category}のお題一覧
          </DialogTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
          >
            <Eraser className="w-4 h-4 mr-2" />
            選択をリセット
          </Button>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {topicList.map((name, index) => (
              <div
                key={index}
                onClick={() => handleItemClick(name)}
                className={`p-2 rounded-lg text-center cursor-pointer transition-all ${
                  selectedItems.has(name)
                    ? "bg-purple-900/50 line-through text-white/50"
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                }`}
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