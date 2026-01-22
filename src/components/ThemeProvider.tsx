"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"

export type ThemeMode = "dark" | "light"
type Ctx = { mode: ThemeMode; setMode: (m: ThemeMode) => void; toggle: () => void }
const ThemeCtx = createContext<Ctx | null>(null)
const STORAGE_KEY = "fmm:theme"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("dark")

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY) as ThemeMode | null
      if (saved === "dark" || saved === "light") setModeState(saved)
    } catch {}
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (mode === "dark") root.classList.add("dark")
    else root.classList.remove("dark")
    try { sessionStorage.setItem(STORAGE_KEY, mode) } catch {}
  }, [mode])

  const api = useMemo<Ctx>(() => ({
    mode,
    setMode: (m) => setModeState(m),
    toggle: () => setModeState((p) => (p === "dark" ? "light" : "dark")),
  }), [mode])

  return <ThemeCtx.Provider value={api}>{children}</ThemeCtx.Provider>
}

export function useThemeMode() {
  const ctx = useContext(ThemeCtx)
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider")
  return ctx
}
