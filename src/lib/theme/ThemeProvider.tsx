"use client";

import { createContext, useCallback, useContext, useEffect } from "react";

type Theme = "dark";
type Ctx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<Ctx | null>(null);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.removeItem("lors.theme");
  }, []);

  const setTheme = useCallback((_t: Theme) => {}, []);
  const toggle = useCallback(() => {}, []);

  return (
    <ThemeContext.Provider value={{ theme: "dark", toggle, setTheme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
