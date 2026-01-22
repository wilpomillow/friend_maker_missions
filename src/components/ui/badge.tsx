// src/components/ui/badge.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-black/5 bg-black/5 px-2.5 py-1 text-[12px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-white",
        className
      )}
      {...props}
    />
  )
}
