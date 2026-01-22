// src/components/MissionCard.tsx
"use client"

import { useEffect, useMemo, useState } from "react"
import type { Mission } from "@/lib/missions"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Info, RotateCcw, X } from "lucide-react"

const FLIP_KEY = "fmm:flipped:v1"
type FlipStore = Record<string, Record<string, boolean>> // weekKey -> missionId -> flipped

function readFlipStore(): FlipStore {
  try {
    const raw = localStorage.getItem(FLIP_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object") return {}
    return parsed as FlipStore
  } catch {
    return {}
  }
}

function writeFlipStore(s: FlipStore) {
  try {
    localStorage.setItem(FLIP_KEY, JSON.stringify(s))
  } catch {}
}

export default function MissionCard({
  mission,
  mode,
  weekKey,
  accomplished,
  onToggleAccomplished,
  peopleCount,
}: {
  mission: Mission
  mode: "dark" | "light"
  weekKey: string
  accomplished: boolean
  onToggleAccomplished: () => void
  peopleCount?: number
}) {
  const [flipped, setFlipped] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const stop = (e: React.SyntheticEvent) => e.stopPropagation()

  // Load persisted flip state for this week+mission
  useEffect(() => {
    const store = readFlipStore()
    const week = store[weekKey] || {}
    setFlipped(!!week[mission.id])
  }, [weekKey, mission.id])

  // Persist flip state whenever it changes
  useEffect(() => {
    const store = readFlipStore()
    const next: FlipStore = { ...store }
    const week = { ...(next[weekKey] || {}) }
    week[mission.id] = flipped
    next[weekKey] = week
    writeFlipStore(next)
  }, [flipped, weekKey, mission.id])

  const frontClass =
    mode === "dark"
      ? "bg-[#1b1f26] text-white border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
      : "bg-white text-slate-700 border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.10)]"

  const backClass =
    mode === "dark"
      ? "bg-gradient-to-br from-[#0b1020] via-[#0d1b3f] to-[#000000] text-white border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.35)]"
      : "bg-gradient-to-br from-white via-sky-50 to-blue-50 text-slate-700 border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.10)]"

  const tagPills = useMemo(
    () =>
      (mission.tags || []).slice(0, 5).map((t) => (
        <Badge key={t} className="backdrop-blur">
          {t}
        </Badge>
      )),
    [mission.tags]
  )

  const tipText =
    typeof mission.tip === "string" && mission.tip.trim().length > 0
      ? mission.tip.trim()
      : 'Add a tip in the mission MDX frontmatter: tip: "..."'

  const peopleText = typeof peopleCount === "number" ? peopleCount.toLocaleString() : "—"

  return (
    <div className="w-full">
      <div className="relative [perspective:1400px]">
        <div
          className={cn(
            "relative h-[320px] w-full transition-transform duration-700 [transform-style:preserve-3d]",
            flipped && "[transform:rotateY(180deg)]"
          )}
        >
          {/* ===================== FRONT ===================== */}
          <Card
            className={cn(
              "absolute inset-0 flex h-full flex-col overflow-hidden",
              frontClass,
              "cursor-pointer [backface-visibility:hidden] [transform:rotateY(0deg)]"
            )}
            onClick={() => setFlipped(true)}
          >
            {/* (i) pinned to top-right (same coords as overlay X) */}
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-4 top-4 z-10"
              title="Tips"
              onClick={(e) => {
                stop(e)
                setInfoOpen(true)
              }}
            >
              <Info className="h-5 w-5" />
            </Button>

            <CardHeader>
              <div className="min-w-0 pr-12">
                <div className={cn("text-[13px] font-semibold", mode === "light" ? "text-slate-500" : "text-white/70")}>
                  This week&apos;s mission
                </div>
                <div className={cn("mt-1 text-xl font-extrabold leading-tight", mode === "light" ? "text-slate-700" : "")}>
                  {mission.title}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1">
              <div className={cn("mt-2 text-base font-medium", mode === "light" ? "text-slate-500" : "text-white/80")}>
                {mission.body}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">{tagPills}</div>
            </CardContent>

            <CardFooter className="mt-auto flex items-center gap-3">
              <Button
                variant={accomplished ? "secondary" : "default"}
                className="w-full rounded-2xl"
                onClick={(e) => {
                  stop(e)
                  onToggleAccomplished()
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
                {accomplished ? "Undo" : "Accomplished"}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn("shrink-0", mode === "light" ? "text-slate-600" : "text-white/80")}
                title="Flip card"
                onClick={(e) => {
                  stop(e)
                  setFlipped(true)
                }}
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </CardFooter>

            {/* ===================== INFO OVERLAY (FULL OPAQUE) ===================== */}
            {infoOpen && (
              <div
                className="absolute inset-0 z-20 bg-white dark:bg-[#0b1020]"
                onClick={() => setInfoOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label="Mission tips"
              >
                <div className="relative flex h-full flex-col" onClick={stop}>
                  {/* Header aligned to CardHeader coordinates */}
                  <div className="px-6 pt-6">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 pr-12">
                        <div className={cn("text-[13px] font-semibold", mode === "light" ? "text-slate-500" : "text-white/70")}>
                          Mission Support
                        </div>
                        <div
                          className={cn(
                            "mt-1 text-xl font-extrabold leading-tight",
                            mode === "light" ? "text-slate-700" : "text-white"
                          )}
                        >
                          {mission.title}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Close pinned to same top-right coords as (i) */}
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-4"
                    title="Close"
                    onClick={() => setInfoOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  <div className="flex-1 px-6 pb-6 pt-6">
                    <div
                      className={cn(
                        "rounded-3xl border p-4 text-sm font-medium",
                        mode === "dark"
                          ? "border-white/15 bg-white/10 text-white/85"
                          : "border-black/10 bg-slate-50 text-slate-600"
                      )}
                    >
                      <div
                        className={cn(
                          "text-xs font-bold uppercase tracking-wide",
                          mode === "dark" ? "text-white/70" : "text-slate-500"
                        )}
                      >
                        Tip
                      </div>
                      <div className="mt-2 text-sm font-medium leading-relaxed">{tipText}</div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">{tagPills}</div>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* ===================== BACK (BRAND ONLY) ===================== */}
          <Card
            className={cn(
              "absolute inset-0 flex h-full items-center justify-center overflow-hidden",
              backClass,
              "cursor-pointer [backface-visibility:hidden] [transform:rotateY(180deg)]"
            )}
            onClick={() => setFlipped(false)}
          >
            <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(59,130,246,0.35),transparent_50%)]" />

            <div className="relative text-center">
              <div className={cn("text-5xl font-extrabold leading-none tracking-tight", mode === "dark" ? "text-white" : "text-slate-700")}>
                Friend
              </div>
              <div className={cn("mt-2 text-lg font-semibold tracking-wide", mode === "dark" ? "text-white/85" : "text-slate-500")}>
                Maker Mission
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className={cn("absolute bottom-4 right-4", mode === "light" ? "text-slate-500" : "text-white/70")}
              title="Return"
              onClick={(e) => {
                stop(e)
                setFlipped(false)
              }}
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </Card>
        </div>
      </div>

      {/* people accomplished this */}
      <div className="mt-3 text-center text-[13px] font-medium text-slate-500 dark:text-white/70">
        <span className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/55 px-3 py-1 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <span className="h-2 w-2 rounded-full bg-sky-400" />
          People accomplished this: <span className="font-semibold">{peopleText}</span>
        </span>
      </div>
    </div>
  )
}
