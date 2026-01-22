import * as React from "react"
import { cn } from "@/lib/utils"

type Variant = "default" | "secondary" | "ghost"
type Size = "default" | "sm" | "icon"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 disabled:opacity-50 disabled:pointer-events-none"
    const variants: Record<Variant, string> = {
      default: "bg-sky-500 text-white hover:bg-sky-600",
      secondary:
        "bg-black/5 text-slate-900 hover:bg-black/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
      ghost: "bg-transparent hover:bg-black/5 text-slate-900 dark:text-white dark:hover:bg-white/10",
    }
    const sizes: Record<Size, string> = { default: "h-11 px-4", sm: "h-9 px-3 text-[13px]", icon: "h-11 w-11 p-0" }
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  }
)
Button.displayName = "Button"
