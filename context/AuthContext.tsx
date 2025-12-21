// context/AuthContext.tsx
"use client";

import { createContext, useEffect, useState, ReactNode } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

type AuthContextType = {
  user: User | null;
};

export const AuthContext = createContext<AuthContextType>({ user: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
