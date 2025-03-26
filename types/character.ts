export interface Character {
  id: number
  name: string
  emoji: string
  description: string
  tips: string
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
  tips: string
}

export interface Country {
  id: number
  name: string
  emoji: string
  description: string
  tips: string
}

export interface ScienceWord {
  id: number
  name: string
  emoji: string
  description: string
  tips: string
}


export interface Person {
  id: number
  name: string
  emoji: string
  description: string
  tips: string
}
export interface prefecture {
  id: number
  name: string
  emoji: string
  description: string
  tips: string
}



export type Category = "characters" | "animals" | "countries" | "programs" | "scienceWords" | "persons" | "prefecture"