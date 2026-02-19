"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { apiFetch, setAccessToken } from "@/lib/api";

interface User {
  _id: string;
  fullName: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { fullName: string; username: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const data = await apiFetch<{ accessToken?: string; user: User }>("/api/auth/refresh", { method: "POST" });
      if (data.accessToken) setAccessToken(data.accessToken);
      const me = await apiFetch<{ user: User }>("/api/auth/me");
      setUser(me.user);
    } catch {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email: string, password: string) => {
    const data = await apiFetch<{ accessToken: string; user: User }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const signup = async (fields: { fullName: string; username: string; email: string; password: string }) => {
    await apiFetch<{ message: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(fields),
    });
    // No auto-login: user must log in on the login page
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
