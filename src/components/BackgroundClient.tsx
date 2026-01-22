"use client"

import Fireflies from "@/components/Fireflies"
import ClickSparks from "@/components/ClickSparks"
import { useThemeMode } from "@/components/ThemeProvider"

export default function BackgroundClient() {
  const { mode } = useThemeMode()

  return (
    <>
      <div
        className={
          mode === "dark"
            ? "fixed inset-0 -z-40 bg-[radial-gradient(circle_at_25%_15%,rgba(30,64,175,0.55),transparent_45%),radial-gradient(circle_at_70%_70%,rgba(37,99,235,0.35),transparent_55%),linear-gradient(180deg,rgba(0,0,0,1),rgba(2,6,23,1))]"
            : "fixed inset-0 -z-40 bg-[radial-gradient(circle_at_25%_15%,rgba(186,230,253,0.65),transparent_45%),radial-gradient(circle_at_75%_70%,rgba(147,197,253,0.55),transparent_55%),linear-gradient(180deg,rgba(255,255,255,1),rgba(239,246,255,1))]"
        }
        aria-hidden
      />

      <Fireflies mode={mode} />
      <ClickSparks mode={mode} />

      <div
        className={
          mode === "dark"
            ? "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.08),transparent_55%)]"
            : "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.12),transparent_55%)]"
        }
        aria-hidden
      />
    </>
  )
}
