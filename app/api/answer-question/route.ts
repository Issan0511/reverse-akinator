import { type NextRequest, NextResponse } from "next/server"
import type { Character } from "@/types/character"

export async function POST(request: NextRequest) {
  try {
    console.log("answer-question") 
    const { question, character } = await request.json()

    if (!question || !character) {
      return NextResponse.json({ error: "Question and character are required" }, { status: 400 })
    }

    // ここでは API キーをハードコードしていますが、実際は環境変数から取得することをおすすめします。
    const geminiApiKey = process.env.GEMINI_API_KEY
    if (!geminiApiKey) {
      return NextResponse.json({ error: "Gemini API key is not set" }, { status: 500 })
    }
    const charactername = character.name
    
    // Gemini API のペイロードを作成
    const payload = {
      contents: [{
        parts: [{
          text: `
          
      以下のデータは、アキネーターゲームのキャラクター情報と質問です。
      答えに至る思考過程も出力したのち、
      以下の質問を"answer":{"はい"||"いいえ"||"分からない"||"答えに到達"}に分類することが目標です。
      真偽が不明な質問、あなたがその質問に確実に答える知識をもっていない質問、"はい"||"いいえ"で回答できない質問、キャラクターに対してナンセンスな質問、については"分からない"と出力して下さい
      もし'答えは"charactername"ですか？'のように答えが明確な質問があり、かつその答えがキャラクターの名前である場合は"答えに到達"を出力してください。
      オブジェクトの構造については [schema] を参照してください。
      最終的な出力は Result として定義しています。
      
      それ以外の内容については一切出力しないでください。
      ---
      キャラクター: ${charactername}
      質問：${question}？
      ---
      [schema]
      answer = {
        "thinking-process": "string",
        "judgement": "string" // {"はい"||"いいえ"||"分からない"||"答えに到達"} のいずれか
      }
      Result: answer          
          `
        }]
      }]
    }

    // Gemini API エンドポイントにリクエスト
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", errorText)
      return NextResponse.json({ error: "Gemini API error" }, { status: response.status })
    }

    console.log("Gemini API response:", response.status)
    const rawText = await response.text()

    // 不要なバッククォートなどが含まれていれば除去
    const formattedText = rawText.replace(/```json|```/g, "")
    
    // Gemini API の全体のレスポンスをパース（オブジェクト構造になっているはず）
    const data = JSON.parse(formattedText);
    console.log("Gemini API data:", data)

    // 最終的な出力は、候補の中の1件目の content.parts[0].text に含まれている
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) {
      return NextResponse.json({ error: "No candidate text found" }, { status: 500 })
    }
    // 改行や余分な空白をトリムしてからパース
    const trimmedText = candidateText.trim();
    console.log("Extracted candidate text:", trimmedText)

    // このテキストは JSON 形式の文字列なので、パースしてオブジェクトにする
    const answerObject = JSON.parse(trimmedText)
    console.log("Final parsed answer:", answerObject)

    // ここでは answerObject をそのまま返す
    return NextResponse.json({ answer: answerObject })
  } catch (error) {
    console.error("Error processing Gemini request:", error)
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 })
  }
}
