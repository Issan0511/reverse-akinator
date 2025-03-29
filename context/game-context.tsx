"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useCallback } from "react"
import { useAuth } from "@/hooks/useAuth";

// データ系のインポート（別ファイルごと）
import { characters } from "@/data/characters";
import { countries } from "@/data/countries";
import { animals } from "@/data/animals";
import { persons } from "@/data/persons";
import { scienceWords } from "@/data/scienceWords";
import { prefectures } from "@/data/prefectures";
import { gekiMuzu } from "@/data/gekiMuzu";

// 型のインポートは同じファイルからまとめてできる！
import type {
  Character,
  Country,
  Animal,
  Person,
  ScienceWord,
  Prefecture,
  GekiMuzu,
} from "@/types/character";

import { auth } from "@/firebase/firebaseConfig"
import { db } from "@/firebase"
import { doc, getDoc, setDoc,addDoc,collection, serverTimestamp } from "firebase/firestore"
import type { Category } from "@/types/character";
import type { SelectedCharacter } from "@/types/character";

type GameStage = "intro" | "playing" | "result"| "category"| "rank" | "customTopic"
type WizardEmotion = "neutral" | "thinking" | "happy" | "excited" | "confused" 

// GameContextType の拡張（型定義）
interface GameContextType {

  stage: GameStage
  setStage: (stage: GameStage) => void

  selectedCharacter: SelectedCharacter
  selectRandomCharacter: () => void

  questions: { question: string; answer: string; reason?: string }[]
  addQuestion: (question: string, answer: string, reason?: string ) => void

  resetGame: () => void

  wizardEmotion: WizardEmotion
  setWizardEmotion: (emotion: WizardEmotion) => void

  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  maxQuestions: number
  remainingQuestions: number

  selectedCategory: Category
  setCategory: (category: Category) => void

  isSuccess: boolean
  setIsSuccess: (value: boolean) => void


  didGiveUp: boolean
  giveUp: () => void
  
  user: any;
  loading: boolean;
  
  remainingAnswerAttempts: number
  decrementAnswerAttempts: () => void

  usedHint: boolean
  setUsedHint: (used: boolean) => void

  setCustomTopic: (category: string, topic: string) => void
  customCategoryName: string;  // カスタムカテゴリー名を保持するプロパティを追加
}

// Contextをcreateする。GameContextの型はGameContextType か undefined
const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {

  //まずは状態を定義
  const [stage, setStage] = useState<GameStage>("intro")
  const { user, loading } = useAuth(); // ★ ここでFirebaseのユーザー情報を取得
  // 選択されたキャラクターをユニオン型で扱う
  const [selectedCharacter, setSelectedCharacter] = useState<SelectedCharacter>(null)
  const [questions, setQuestions] = useState<{ question: string; answer: string ; reason? : string}[]>([])
  const [wizardEmotion, setWizardEmotion] = useState<WizardEmotion>("neutral",)
  const [isLoading, setIsLoading] = useState(false)
  // カテゴリー選択状態とその更新関数を追加（初期値は "characters"）
  const [selectedCategory, setCategory] = useState<Category>("characters")
  const [isSuccess, setIsSuccess] = useState(false)
  const [didGiveUp, setDidGiveUp] = useState(false)
  // 回答権の状態を追加（無限大に設定）
  const [remainingAnswerAttempts, setRemainingAnswerAttempts] = useState(20)
  const [usedHint, setUsedHint] = useState(false)
  const [customCategoryName, setCustomCategoryName] = useState<string>("");  // 新しい状態変数

  const maxQuestions = 20
  const remainingQuestions = maxQuestions - questions.length

  useEffect(() => {
    resetGame()
  }, [])

  //関数を定義
  const selectRandomCharacter = () => {
    let dataSource: (SelectedCharacter)[];
  
    switch (selectedCategory) {
      case "animals":
        dataSource = animals;
        break;
      case "countries":
        dataSource = countries;
        break;
      case "scienceWords":
        dataSource = scienceWords;
        break;
      case "persons":
        dataSource = persons;
        break;
      case "prefecture":
        dataSource = prefectures;
        break;
      case "characters":
      default:
        dataSource = characters;
        break;
    }
  
    const randomIndex = Math.floor(Math.random() * dataSource.length);
    setSelectedCharacter(dataSource[randomIndex] || null);
  };


  // 激ムズモードの固定トピックを日付から計算する関数
  const caluculateFixedGekiMuzuTopic = (): GekiMuzu => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const total = (day + month*100 + year*10000)*day;
    const index = total % gekiMuzu.length;
    return gekiMuzu[index];
  };


  const handleCategorySelect = (category: Category) => {
    setCategory(category);

    if (category === "gekiMuzu") {
      const fixedTopic = caluculateFixedGekiMuzuTopic();
      setSelectedCharacter(fixedTopic);
    } else {
      selectRandomCharacter();
    }
  };

  
  const addQuestion = async (question: string, answer: string, reason?: string) => {
    console.log("addQuestion開始:", { question, answer, reason, usedHint });
    // 質問歴に追加する関数
    setQuestions([...questions, { question, answer, reason }])

    // デバッグログを追加
    console.log("デバッグ情報:", {
      usedHint,
      answer,
      willRegisterRanking: !usedHint && answer === "答えに到達"
    });

    // 「答えに到達」の場合は成功として明示的に設定
    if (answer === "答えに到達") {
      setIsSuccess(true)
      console.log("答えに到達しました。usedHint:", usedHint);
    }

    // ヒントを使用していない場合のみランキングに登録
    if (!usedHint && answer === "答えに到達") {
      console.log("ランキング登録条件を満たしています。登録処理を開始します。");
      try {
        const user = auth.currentUser
        if (!user) {
          console.log("ランキングに登録するにはログインが必要です")
          return
        }

        if (!selectedCategory || !selectedCharacter) {
          console.error("カテゴリーまたはキャラクターが選択されていません")
          return
        }

        console.log("ランキング登録開始:", {
          userId: user.uid,
          category: selectedCategory,
          characterId: selectedCharacter.id,
          questionCount: questions.length
        })

        // Firestore の rankings コレクションへの参照を取得
        const rankingRef = collection(db, "rankings")

        const newRanking = {
          userId: user.uid,
          category: selectedCategory,
          characterId: selectedCharacter.id,
          questionCount: questions.length,
          createdAt: serverTimestamp(),
        }
        // rankingRefにnewRankingを追加
        await addDoc(rankingRef, newRanking)
        console.log("ランキングに登録しました")
      } catch (error) {
        console.error("ランキング登録エラー:", error)
        if (error instanceof Error) {
          console.error("エラーの詳細:", error.message)
        }
      }
    } else if (answer === "答えに到達") {
      console.log("ヒントを使用したため、ランキングには登録されません")
    }

    // Check if game should end
    if (questions.length + 1 >= maxQuestions || usedHint) {
      setIsSuccess(false)
      setStage("result")
    }
  }

  const giveUp = () => {
    setDidGiveUp(true)    // ギブアップフラグをtrueにする
    setIsSuccess(false)   // 成功フラグはfalse
    if (usedHint) {
      setQuestions([...questions, { question: "ギブアップ", answer: "999" }])
    }
    setStage("result")
  }

  // 回答権を減らす関数（無効化）
  const decrementAnswerAttempts = () => {
    // 何もしない（回答権は減らない）
  }

  // resetGame関数にカスタムカテゴリー名のリセットを追加
  const resetGame = () => {
    // selectRandomCharacter()
    setQuestions([])
    setStage("intro")
    setWizardEmotion("neutral")
    setIsSuccess(false)
    setDidGiveUp(false) // ギブアップフラグをリセット
    setRemainingAnswerAttempts(20) // 回答権をリセット
    setUsedHint(false) // ゲームリセット時にヒント使用状態もリセット
    setCustomCategoryName("");  // カスタムカテゴリー名もリセット
  }
  
  
  // setCustomTopic関数を修正
  const setCustomTopic = (category: string, topic: string) => {
    setCategory("customTopic");
    setCustomCategoryName(category);  // カスタムカテゴリー名を保存
    
    setSelectedCharacter({ 
      id: -1, 
      name: topic, 
      emoji: "", 
      description: `カスタムお題: ${topic}`, 
      tips: "" 
    });
  };

  return (
    <GameContext.Provider
      value={{
        stage,
        setStage,
        selectedCharacter,
        selectedCategory,
        setCategory: handleCategorySelect,
        questions,
        addQuestion,
        resetGame,
        wizardEmotion,
        setWizardEmotion,
        isLoading,
        setIsLoading,
        maxQuestions,
        remainingQuestions,

        selectRandomCharacter, 
        isSuccess,
        setIsSuccess, 

        giveUp,
        didGiveUp, 
        user,
        loading,
        remainingAnswerAttempts,
        decrementAnswerAttempts,
        usedHint,
        setUsedHint,
        setCustomTopic,
        customCategoryName,
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

