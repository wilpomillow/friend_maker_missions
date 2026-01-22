"use client"
import * as React from "react"
import { cn } from "@/lib/utils"

export function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}: {
  checked: boolean
  onCheckedChange: (v: boolean) => void
  className?: string
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange">) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-8 w-14 items-center rounded-full border border-black/10 bg-black/5 transition dark:border-white/15 dark:bg-white/10",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block h-6 w-6 translate-x-1 rounded-full bg-white shadow-soft transition will-change-transform dark:bg-slate-100",
          checked && "translate-x-7"
        )}
      />
    </button>
  )
}
