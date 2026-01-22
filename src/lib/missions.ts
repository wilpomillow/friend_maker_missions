import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { seededShuffle } from "./seed"

export type Mission = {
  id: string
  title: string
  tags: string[]
  tip?: string
  body: string
}

const MISSIONS_DIR = path.join(process.cwd(), "content", "missions")

function countWords(s: string) {
  const cleaned = s.replace(/\s+/g, " ").replace(/[\u200B-\u200D\uFEFF]/g, "").trim()
  if (!cleaned) return 0
  return cleaned.split(" ").length
}

export function getAllMissions(): Mission[] {
  const files = fs.readdirSync(MISSIONS_DIR).filter((f) => f.endsWith(".mdx"))
  return files.map((f) => {
    const raw = fs.readFileSync(path.join(MISSIONS_DIR, f), "utf-8")
    const parsed = matter(raw)

    const id = String(parsed.data.id || "").trim()
    const title = String(parsed.data.title || "").trim()
    const tags = Array.isArray(parsed.data.tags) ? parsed.data.tags.map(String) : []

    // NEW: optional tip from frontmatter
    const tipRaw = parsed.data.tip
    const tip =
      typeof tipRaw === "string" && tipRaw.trim().length > 0 ? tipRaw.trim().replace(/\s+/g, " ") : undefined

    // body is the MDX content (mission description), kept <= 20 words
    const body = String(parsed.content || "").trim().replace(/\s+/g, " ")

    if (!id || !title) throw new Error(`Mission file ${f} missing required frontmatter: id/title`)

    const wc = countWords(body)
    if (wc > 20) throw new Error(`Mission "${id}" exceeds 20 words in body (${wc} words).`)

    return { id, title, tags, tip, body }
  })
}

export function getWeeklyMissions(all: Mission[], weekKey: string): Mission[] {
  return seededShuffle(all, `week:${weekKey}`).slice(0, 3)
}
