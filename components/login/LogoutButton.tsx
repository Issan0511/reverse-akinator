// components/LogoutButton.tsx
import React from 'react';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

const LogoutButton: React.FC = () => {
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("ログアウトエラー:", error);
    }
  };

  return (
    <button onClick={logout}>
      ログアウト
    </button>
  );
};

export default LogoutButton;
