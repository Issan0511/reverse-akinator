"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import LoginButton from "@/components/login/LoginButton"; // ← ログインボタンのコンポーネント（Googleログイン等）

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // ローディングが終わってログイン済みならトップページに飛ばす
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (user) {
    // ログイン済みなら / にリダイレクト中
    return null;
  }

  // 未ログインなら ログインボタンなどを表示
  return (
    <div>
      <h1>ログインページ</h1>
      <LoginButton />
    </div>
  );
}
