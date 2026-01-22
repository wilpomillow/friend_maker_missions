"use client"
import { useEffect, useRef } from "react"
type Mode = "dark" | "light"

export default function ClickSparks({ mode }: { mode: Mode }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let raf = 0
    const sparks: { x: number; y: number; vx: number; vy: number; life: number }[] = []

    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onClick = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const n = 16
      for (let i = 0; i < n; i++) {
        const a = (Math.PI * 2 * i) / n
        const s = 1.4 + Math.random() * 1.8
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 26 + Math.random() * 10 })
      }
    }

    const color = mode === "dark" ? "rgba(96,165,250,0.9)" : "rgba(59,130,246,0.55)"

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.92
        p.vy *= 0.92
        p.life -= 1

        ctx.globalAlpha = Math.max(0, p.life / 30)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()

        if (p.life <= 0) sparks.splice(i, 1)
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("resize", resize, { passive: true })
    window.addEventListener("click", onClick, { passive: true })
    resize()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("click", onClick)
    }
  }, [mode])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-10" aria-hidden />
}
