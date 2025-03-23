// lib/firebase.ts (v9以降)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Firestore を使う場合は getFirestore をインポート
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // その他の設定情報
};

// Firebase App を初期化
const app = initializeApp(firebaseConfig);

// Authentication インスタンス
const auth = getAuth(app);

// Firestore インスタンス
const db = getFirestore(app);

// 必要なものをエクスポート
export { auth, db };
