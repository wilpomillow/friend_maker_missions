import type { Metadata } from "next"
import { Funnel_Display } from "next/font/google"
import "./globals.css"

const funnel = Funnel_Display({
  subsets: ["latin"],
  variable: "--font-funnel-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Friend Maker Missions",
  description: "Weekly missions to help you make more friends.",
    icons: {
    icon: "/logo.png",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={funnel.variable} suppressHydrationWarning>
      <body className="min-h-dvh">{children}</body>
    </html>
  )
}
