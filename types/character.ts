export interface Character {
  id: number
  name: string
  emoji: string
  description: string
  traits: {
    gender: "男性" | "女性" | "その他"
    era: string
    isReal: boolean
    isAlive: boolean
    occupation: string
    popularity: number // 1-10
    age: number | string
    nationality: string
    hasSpecialAbility: boolean
  }
}

