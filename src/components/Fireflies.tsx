"use client"

import { useEffect, useRef } from "react"
import { clamp } from "@/lib/utils"

type Mode = "dark" | "light"

type Dot = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
  alphaDir: number
  color: string
}

export default function Fireflies({ mode }: { mode: Mode }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let raf = 0
    let dots: Dot[] = []

    const palette =
      mode === "dark"
        ? ["#60a5fa", "#3b82f6", "#93c5fd"]
        : ["#93c5fd", "#bae6fd", "#7dd3fc"]

    const spawn = (w: number, h: number): Dot => {
      const speed = mode === "dark" ? 0.12 : 0.08
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: 1.5 + Math.random() * 1.8,
        alpha: 0.35 + Math.random() * 0.25,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        color: palette[Math.floor(Math.random() * palette.length)],
      }
    }

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const target = clamp(Math.floor((w * h) / 36000), 24, 80)
      while (dots.length < target) dots.push(spawn(w, h))
      if (dots.length > target) dots.length = target
    }

    const step = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        d.x += d.vx
        d.y += d.vy

        // gentle breathing instead of flicker
        d.alpha += d.alphaDir * 0.002
        if (d.alpha > 0.6 || d.alpha < 0.25) d.alphaDir *= -1

        if (d.x < -20) d.x = w + 20
        if (d.x > w + 20) d.x = -20
        if (d.y < -20) d.y = h + 20
        if (d.y > h + 20) d.y = -20

        ctx.beginPath()
        ctx.fillStyle = d.color
        ctx.globalAlpha = d.alpha
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()

        // soft halo
        ctx.beginPath()
        ctx.globalAlpha = d.alpha * 0.25
        ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(step)
    }

    window.addEventListener("resize", resize, { passive: true })
    resize()
    raf = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [mode])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-30" aria-hidden />
}
