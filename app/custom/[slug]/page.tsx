"use client";

import { useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import LoadingScreen from "@/components/loading-screen";
import { useGame } from "@/context/game-context";

export default function CustomTopicParamPage() {
  const router = useRouter();
  const params = useParams();
  const { setCustomTopic } = useGame();
  const processedRef = useRef(false);
  
  useEffect(() => {
    // 既に処理済みなら実行しない
    if (processedRef.current) return;
    processedRef.current = true;
    
    try {
      // 完全なパスを再構築
      const fullPath = `/custom/${params.slug}`;
      // URLを安全にデコード
      const decodedPath = decodeURIComponent(fullPath);
      // 正規表現でカテゴリーとキャラクターを抽出
      const match = decodedPath.match(/\/custom\/Category="([^"]+)"selectedCharacter="([^"]+)"/);
      
      if (match && match.length === 3) {
        const category = match[1];
        const rawcharacter = match[2];
        const character = Buffer.from(rawcharacter, "base64").toString("utf-8");
        
        console.log("カスタムトピック検出:", { category, character });
        
        // セッションストレージに保存
        sessionStorage.setItem("customTopicCategory", category);
        sessionStorage.setItem("customTopicCharacter", character);
        sessionStorage.setItem("hasCustomTopic", "true");
        
        // ホームページにリダイレクト
        router.push("/");
      } else {
        console.error("パラメータが正しくありません:", fullPath);
        router.push("/");
      }
    } catch (error) {
      console.error("処理エラー:", error);
      router.push("/");
    }
  }, [params, router, setCustomTopic]);

  return <LoadingScreen />;
}