"use client"

import { Button } from "@/components/ui/button"
import { useThemeMode } from "@/components/ThemeProvider"
import { HelpCircle, Moon, Sun } from "lucide-react"
import Image from "next/image"

export default function HeaderBar() {
  const { mode, setMode } = useThemeMode()

  const triggerHowFlash = () => {
    const el = document.getElementById("howitworks-card")
    if (!el) return

    // bring into view
    el.scrollIntoView({ behavior: "smooth", block: "start" })

    // restart animation reliably
    el.classList.remove("how-flash")
    ;(el as HTMLElement).offsetWidth
    el.classList.add("how-flash")

    window.setTimeout(() => el.classList.remove("how-flash"), 900)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/35 backdrop-blur dark:border-white/10 dark:bg-black/25">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/logo.png"
            alt="Friend Maker Missions logo"
            width={36}
            height={36}
            priority
            className="rounded-md"
          />

          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-600 dark:text-white/70">
              Friend Maker Missions
            </div>
            <div className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Weekly missions to make more friends
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Help */}
          <Button
            variant="secondary"
            size="icon"
            title="How it works"
            onClick={triggerHowFlash}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>

          {/* Theme toggle */}
          <Button
            variant="secondary"
            size="icon"
            title={mode === "dark" ? "Switch to light" : "Switch to dark"}
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
          >
            {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </header>
  )
}
