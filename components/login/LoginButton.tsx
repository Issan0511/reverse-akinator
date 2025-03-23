// components/LoginButton.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const LoginButton: React.FC = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // ログイン成功後にゲーム画面へ遷移
      router.push("/");
    } catch (error) {
      console.error("Googleログインエラー:", error);
    }
  };

  return (
    <button onClick={signInWithGoogle}
     className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all">
      Googleでログイン
    </button>
  );
};

export default LoginButton;
