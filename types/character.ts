export interface Character {
  id: number
  name: string
  emoji: string
  description: string
}


export interface Program {
  id: number
  name: string
  emoji: string
  description: string
}

export interface Animal {
  id: number
  name: string
  emoji: string
  description: string
}

export interface Country {
  id: number
  name: string
  emoji: string
  description: string
}


export type Category = "characters" | "animals" | "countries" 