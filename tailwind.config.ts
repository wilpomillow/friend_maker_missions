// tailwind.config.ts
import type { Config } from "tailwindcss"

export default {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        funnel: ["var(--font-funnel-display)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.10)",
        softDark: "0 10px 35px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
} satisfies Config
