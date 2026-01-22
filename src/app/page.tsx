// src/app/page.tsx
import HeaderBar from "@/components/HeaderBar"
import { ThemeProvider } from "@/components/ThemeProvider"
import MissionBoard from "@/components/MissionBoard"
import HowItWorks from "@/components/HowItWorks"
import BackgroundClient from "@/components/BackgroundClient"
import { getAllMissions, getWeeklyMissions } from "@/lib/missions"
import { formatUTCDateLabel, getWeekKeyMondayUTC } from "@/lib/week"

export default function Page() {
  const weekKey = getWeekKeyMondayUTC()
  const weekLabel = formatUTCDateLabel(weekKey)

  const all = getAllMissions()
  const missions = getWeeklyMissions(all, weekKey)

  return (
    <ThemeProvider>
      <div className="relative min-h-dvh overflow-hidden">
        <BackgroundClient />
        <HeaderBar />

        <main className="mx-auto w-full max-w-6xl px-4 pb-6 pt-8">
          <MissionBoard weekKey={weekKey} missions={missions} />
        </main>

        <HowItWorks weekLabel={weekLabel} />

        <footer className="mx-auto w-full max-w-6xl px-4 pb-10">
          <div className="flex flex-col items-center justify-between gap-3 rounded-3xl border border-black/5 bg-white/55 p-5 text-center text-sm font-semibold text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white/70 md:flex-row md:text-left">
            <div className="text-slate-600 dark:text-white/70">
              Made for people who want more friends
              <span className="ml-2 opacity-80">© {new Date().getFullYear()}  Wilpo Millow. All rights reserved.</span>
            </div>

            <a
              className="rounded-full border border-black/5 bg-white/60 px-4 py-2 font-extrabold text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              href="https://buymeacoffee.com/wilpomillow"
              target="_blank"
              rel="noreferrer"
            >
              Buy Me a Coffee
            </a>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}
