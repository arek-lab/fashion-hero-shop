"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface SellerUser {
  email: string;
  storeName: string;
  plan: "starter" | "pro";
}

interface SellerAuthContextValue {
  seller: SellerUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; storeName: string; password: string }) => Promise<void>;
  logout: () => void;
}

const SellerAuthContext = createContext<SellerAuthContextValue | null>(null);

const STORAGE_KEY = "fashionhero_seller";

export function SellerAuthProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<SellerUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSeller(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    const prefix = email.split("@")[0];
    const storeName = prefix.charAt(0).toUpperCase() + prefix.slice(1) + "'s Store";
    const newSeller: SellerUser = { email, storeName, plan: "starter" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeller));
    setSeller(newSeller);
  }, []);

  const register = useCallback(async (data: { email: string; storeName: string; password: string }) => {
    const newSeller: SellerUser = {
      email: data.email,
      storeName: data.storeName,
      plan: "starter",
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSeller));
    setSeller(newSeller);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSeller(null);
  }, []);

  return (
    <SellerAuthContext.Provider value={{ seller, login, register, logout }}>
      {children}
    </SellerAuthContext.Provider>
  );
}

export function useSellerAuth() {
  const ctx = useContext(SellerAuthContext);
  if (!ctx) throw new Error("useSellerAuth must be used within SellerAuthProvider");
  return ctx;
}
