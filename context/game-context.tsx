"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { characters } from "@/data/characters";
import type { Character } from "@/types/character";
import { countries } from "@/data/countries";
import type { Country } from "@/types/character";
import { animals } from "@/data/animals";
import type { Animal } from "@/types/character";
import { persons } from "@/data/persons";
import type { Person } from "@/types/character";
import { scienceWords } from "@/data/scienceWords";
import type { ScienceWord } from "@/types/character";
import { prefectures } from "@/data/prefectures";
import type { prefecture } from "@/types/character";

// 選択可能なカテゴリーを定義（必要に応じて追加してください）
export type Category =
  | "characters"
  | "animals"
  | "countries"
  | "programs"
  | "scienceWords"
  | "persons"
  | "prefecture";

type GameStage = "intro" | "playing" | "result" | "category" | "rank";

// selectedCharacter をユニオン型にする
type SelectedCharacter = Character | Animal | Country | prefecture | null;

// 回答の型定義
interface Answer {
  "thinking-process": string;
  judgement: "はい" | "いいえ" | "部分的にはい" | "分からない" | "答えに到達";
}

// GameContextType の型定義に setCharacter を追加
export type GameContextType = {
  stage: GameStage;
  setStage: (stage: GameStage) => void;
  selectedCharacter: SelectedCharacter;
  selectRandomCharacter: () => void;
  questions: string[];
  answers: Answer[];
  currentAnswer: Answer | null;
  askQuestion: (question: string) => void;
  isLoading: boolean;
  giveUp: () => void;
  resetGame: () => void;
  maxQuestions: number;
  remainingQuestions: number;
  remainingGuesses: number;
  remainingTime: number;
  score: number;
  setScore: (score: number) => void;
  selectedCategory: Category;
  setCategory: (category: Category) => void;
  isSuccess: boolean;
  didGiveUp: boolean;
  user: any;
  loading: boolean;
  setCharacter: (character: any) => void;
  setIsLoading: (loading: boolean) => void;
  wizardEmotion:
    | "neutral"
    | "thinking"
    | "happy"
    | "excited"
    | "confused"
    | "yes"
    | "no"
    | "partially";
  setWizardEmotion: (
    emotion:
      | "neutral"
      | "thinking"
      | "happy"
      | "excited"
      | "confused"
      | "yes"
      | "no"
      | "partially"
  ) => void;
  addQuestion: (question: string, answer: string, reason?: string) => void;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth(); // ★ ここでFirebaseのユーザー情報を取得
  const [stage, setStage] = useState<GameStage>("intro");
  // 選択されたキャラクターをユニオン型で扱う
  const [selectedCharacter, setSelectedCharacter] =
    useState<SelectedCharacter>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // カテゴリー選択状態とその更新関数を追加（初期値は "characters"）
  const [selectedCategory, setCategory] = useState<Category>("characters");
  const [isSuccess, setIsSuccess] = useState(true);
  const [score, setScore] = useState(0);
  const [remainingTime, setRemainingTime] = useState(10 * 60); // 10分
  const [remainingGuesses, setRemainingGuesses] = useState(3); // 3回の回答権
  const [didGiveUp, setDidGiveUp] = useState(false);
  const [wizardEmotion, setWizardEmotion] = useState<
    | "neutral"
    | "thinking"
    | "happy"
    | "excited"
    | "confused"
    | "yes"
    | "no"
    | "partially"
  >("neutral");

  const maxQuestions = 20;
  const remainingQuestions = maxQuestions - questions.length;

  useEffect(() => {
    resetGame();
  }, []);

  const selectRandomCharacter = useCallback(() => {
    let dataSource: (
      | Character
      | Animal
      | Country
      | ScienceWord
      | Person
      | prefecture
    )[];

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
      // 他のケースも必要に応じて追加
      default:
        dataSource = characters;
    }

    const randomIndex = Math.floor(Math.random() * dataSource.length);
    setSelectedCharacter(dataSource[randomIndex]);
  }, [selectedCategory]);

  // 質問を送信する関数
  const askQuestion = useCallback(
    async (question: string) => {
      if (!selectedCharacter || questions.length >= maxQuestions) return;

      setIsLoading(true);
      setQuestions((prev) => [...prev, question]);

      try {
        const response = await fetch("/api/answer-question", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question,
            character: selectedCharacter,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get answer");
        }

        const data = await response.json();
        const answer = data.answer;

        setAnswers((prev) => [...prev, answer]);
        setCurrentAnswer(answer);

        // 正解の場合
        if (answer.judgement === "答えに到達") {
          // 正解時の処理
          setTimeout(() => {
            setStage("result");
            // スコア計算: 残り質問数 * 100 + 残り時間 * 5
            const calculatedScore =
              remainingQuestions * 100 + remainingTime * 5;
            setScore(calculatedScore);
          }, 2000);
        }
      } catch (error) {
        console.error("Error asking question:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [
      selectedCharacter,
      questions.length,
      maxQuestions,
      remainingQuestions,
      remainingTime,
    ]
  );

  // ギブアップする関数
  const giveUp = useCallback(() => {
    setDidGiveUp(true); // ギブアップフラグをtrueにする
    setIsSuccess(false); // 成功フラグはfalse
    setStage("result");
    setScore(0); // ギブアップ時はスコア0
  }, []);

  // ゲームをリセットする関数
  const resetGame = useCallback(() => {
    setQuestions([]);
    setAnswers([]);
    setCurrentAnswer(null);
    setRemainingTime(10 * 60);
    setRemainingGuesses(3);
    setStage("intro");
    setDidGiveUp(false); // ギブアップフラグをリセット
  }, []);

  // addQuestion 関数の実装を修正
  const addQuestion = useCallback(
    (question: string, answer: string, reason?: string) => {
      setQuestions((prev) => [...prev, question]);

      // answer を正しい judgement 型に変換
      let judgement:
        | "はい"
        | "いいえ"
        | "部分的にはい"
        | "分からない"
        | "答えに到達";

      // 入力された answer 文字列に基づいて適切な judgement を設定
      switch (answer.toLowerCase()) {
        case "はい":
        case "yes":
          judgement = "はい";
          break;
        case "いいえ":
        case "no":
          judgement = "いいえ";
          break;
        case "部分的にはい":
        case "partially":
          judgement = "部分的にはい";
          break;
        case "答えに到達":
        case "correct":
          judgement = "答えに到達";
          break;
        default:
          judgement = "分からない";
      }

      setAnswers((prev) => [
        ...prev,
        {
          judgement: judgement,
          "thinking-process": reason || "",
        },
      ]);
    },
    []
  );

  // setCharacter 関数を定義（selectedCharacter を更新する）
  const setCharacter = useCallback((character: any) => {
    setSelectedCharacter(character); // ここで selectedCharacter を更新
  }, []);

  return (
    <GameContext.Provider
      value={{
        stage,
        setStage,
        selectedCharacter,
        selectRandomCharacter,
        questions,
        answers,
        currentAnswer,
        askQuestion,
        isLoading,
        giveUp,
        resetGame,
        maxQuestions,
        remainingQuestions,
        remainingGuesses,
        remainingTime,
        score,
        setScore,
        selectedCategory,
        setCategory,
        isSuccess,
        didGiveUp,
        user,
        loading,
        setCharacter,
        setIsLoading,
        wizardEmotion,
        setWizardEmotion,
        addQuestion,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
