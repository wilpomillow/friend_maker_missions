// src/components/HowItWorks.tsx
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { CheckCircle2, CalendarDays, RotateCcw } from "lucide-react"

export default function HowItWorks({ weekLabel }: { weekLabel: string }) {
  return (
    <section id="how" className="mx-auto w-full max-w-6xl px-4 pb-10 pt-6">
      <Card
        id="howitworks-card"
        className={[
          // normal styling
          "border-black/5 bg-white/55 backdrop-blur dark:border-white/10 dark:bg-white/5",
          // set glow color by mode
          "[--howGlow:rgba(147,197,253,0.95)] dark:[--howGlow:rgba(30,58,138,0.70)]",
        ].join(" ")}
      >
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge>How it works</Badge>
            <Badge className="bg-sky-500/15 text-sky-600 dark:bg-white/10 dark:text-sky-200">
              Week starts Monday UTC
            </Badge>
          </div>

          <div className="mt-3 text-2xl font-extrabold text-slate-600 dark:text-white">
            Three missions. One win.
          </div>

          <div className="mt-1 text-sm font-semibold text-slate-500 dark:text-white/70">
            Current week starts: <span className="font-semibold">{weekLabel}</span>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 font-semibold text-slate-500 dark:text-white">
                <CalendarDays className="h-5 w-5" /> Choose one
              </div>
              <div className="mt-2 text-sm font-medium text-slate-400 dark:text-white/70">
                Pick the mission that fits your energy and schedule.
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 font-semibold text-slate-500 dark:text-white">
                <CheckCircle2 className="h-5 w-5" /> Mark accomplished
              </div>
              <div className="mt-2 text-sm font-medium text-slate-400 dark:text-white/70">
                Your selection is saved on this device for the current week.
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center gap-2 font-semibold text-slate-500 dark:text-white">
                <RotateCcw className="h-5 w-5" /> Flip the card
              </div>
              <div className="mt-2 text-sm font-medium text-slate-400 dark:text-white/70">
                The back gives a lightweight prompt/tip (replaceable with your design).
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
