// src/components/MissionBoard.tsx
"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { Mission } from "@/lib/missions"
import MissionCard from "@/components/MissionCard"
import { useThemeMode } from "@/components/ThemeProvider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Trophy } from "lucide-react"

const KEY = "fmm:accomplished:v1"
type Store = Record<string, Record<string, boolean>>

const CLIENT_KEY = "fmm:clientId:v1"
function getClientId() {
  try {
    const existing = localStorage.getItem(CLIENT_KEY)
    if (existing) return existing
    const id = `c_${crypto.randomUUID()}`
    localStorage.setItem(CLIENT_KEY, id)
    return id
  } catch {
    return `c_${Math.random().toString(16).slice(2)}`
  }
}

function readStore(): Store {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as Store
  } catch {
    return {}
  }
}

function writeStore(s: Store) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {}
}

export default function MissionBoard({ weekKey, missions }: { weekKey: string; missions: Mission[] }) {
  const { mode } = useThemeMode()
  const [store, setStore] = useState<Store>({})
  const [peopleTotals, setPeopleTotals] = useState<Record<string, number>>({})

  // Build stable mission id list
  const missionIds = useMemo(() => {
    const ids = (missions || []).map((m) => String(m?.id || "").trim()).filter(Boolean)
    // de-dupe (just in case)
    return Array.from(new Set(ids))
  }, [missions])

  const refreshingRef = useRef(false)

  const refreshTotals = async () => {
    if (!missionIds.length) return
    if (refreshingRef.current) return
    refreshingRef.current = true

    try {
      const res = await fetch("/api/mission-totals", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ missionIds }),
      })
      const data = await res.json().catch(() => null)

      // Even if res is non-200, try to gracefully handle payload
      const totals = data?.totals && typeof data.totals === "object" ? (data.totals as Record<string, number>) : {}

      // ensure all shown missions have a number
      const normalized: Record<string, number> = {}
      for (const id of missionIds) normalized[id] = Number(totals[id] ?? 0)

      setPeopleTotals(normalized)
    } catch {
      // keep existing totals; cards will show "—" if undefined
    } finally {
      refreshingRef.current = false
    }
  }

  useEffect(() => {
    setStore(readStore())
  }, [])

  // Fetch totals on load / whenever the visible missions change
  useEffect(() => {
    void refreshTotals()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missionIds.join("|")])

  const accomplishedMap = store[weekKey] || {}
  const accomplishedCount = useMemo(() => Object.values(accomplishedMap).filter(Boolean).length, [accomplishedMap])
  const cleared = accomplishedCount > 0

  const postAccomplish = async (missionId: string) => {
    try {
      const res = await fetch("/api/accomplish", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ weekKey, missionId, clientId: getClientId() }),
      })
      const data = await res.json().catch(() => null)

      if (data?.counted === true) {
        // optimistic UI
        setPeopleTotals((prev) => ({ ...prev, [missionId]: Number(prev[missionId] || 0) + 1 }))
      } else {
        // if it wasn't counted (already existed), make sure UI is correct
        void refreshTotals()
      }
    } catch {
      // if network fails, re-sync later
      void refreshTotals()
    }
  }

  const deleteAccomplish = async (missionId: string) => {
    try {
      const res = await fetch("/api/accomplish", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ weekKey, missionId, clientId: getClientId() }),
      })
      const data = await res.json().catch(() => null)

      if (data?.removed === true) {
        setPeopleTotals((prev) => ({ ...prev, [missionId]: Math.max(0, Number(prev[missionId] || 0) - 1) }))
      } else {
        void refreshTotals()
      }
    } catch {
      void refreshTotals()
    }
  }

  const toggleMission = (id: string) => {
    setStore((prev) => {
      const next = { ...prev }
      const week = { ...(next[weekKey] || {}) }

      const was = !!week[id]
      const nextVal = !was
      week[id] = nextVal

      next[weekKey] = week
      writeStore(next)

      if (!was && nextVal) void postAccomplish(id)
      if (was && !nextVal) void deleteAccomplish(id)

      return next
    })
  }

  // fixed width trophy status capsule
  const statusCapsuleClass =
    "flex-none w-[26ch] whitespace-nowrap flex items-center gap-2 rounded-3xl border border-black/5 bg-white/55 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/5"

  return (
    <section className="pt-2">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-600 dark:text-white/70">Your weekly missions</div>
          <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Clear the week with <span className="text-sky-600 dark:text-sky-300">one</span> mission.
          </div>
        </div>

        <div className={cn(statusCapsuleClass, cleared && "ring-2 ring-emerald-400/35")}>
          <Trophy className={cn("h-5 w-5", cleared ? "text-emerald-500" : "text-slate-500 dark:text-white/60")} />
          <div className="min-w-0 text-sm font-semibold text-slate-700 dark:text-white/75">
            <span className="opacity-70">Status:</span>{" "}
            <span className={cn("font-extrabold", cleared ? "text-emerald-600 dark:text-emerald-300" : "")}>
              {cleared ? "Cleared" : "Not yet"}
            </span>
          </div>
          <Badge className="ml-auto">{accomplishedCount}/3</Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {missions.map((m) => (
          <MissionCard
            key={m.id}
            mission={m}
            mode={mode}
            weekKey={weekKey}
            accomplished={!!accomplishedMap[m.id]}
            onToggleAccomplished={() => toggleMission(m.id)}
            peopleCount={typeof peopleTotals[m.id] === "number" ? peopleTotals[m.id] : undefined}
          />
        ))}
      </div>
    </section>
  )
}
