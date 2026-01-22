// src/app/api/mission-totals/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { ensureIndexes, getDb } from "@/lib/mongodb"

export async function POST(req: Request) {
  await ensureIndexes()
  const db = await getDb()

  const body = await req.json().catch(() => null)
  const missionIds = Array.isArray(body?.missionIds) ? body.missionIds.map((x: any) => String(x).trim()).filter(Boolean) : []

  // Graceful: no ids => no totals (avoid 400 spam on first render)
  if (!missionIds.length) {
    return NextResponse.json({ ok: true, totals: {} })
  }

  const counts = db.collection("accomplish_counts")

  const rows = await counts
    .aggregate([
      { $match: { missionId: { $in: missionIds } } },
      { $group: { _id: "$missionId", total: { $sum: "$count" } } },
    ])
    .toArray()

  const totals: Record<string, number> = {}
  for (const id of missionIds) totals[id] = 0
  for (const r of rows) totals[String(r._id)] = Number((r as any).total || 0)

  return NextResponse.json({ ok: true, totals })
}
