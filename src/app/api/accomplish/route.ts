// src/app/api/accomplish/route.ts
import { NextResponse } from "next/server"
import { ensureIndexes, getDb } from "@/lib/mongodb"

/**
 * POST: mark accomplished (deduped). Increments weekly count only if newly inserted.
 * Body: { weekKey, missionId, clientId }
 */
export const runtime = "nodejs"

export async function POST(req: Request) {
  await ensureIndexes()
  const db = await getDb()

  const body = await req.json().catch(() => null)
  const weekKey = typeof body?.weekKey === "string" ? body.weekKey : ""
  const missionId = typeof body?.missionId === "string" ? body.missionId : ""
  const clientId = typeof body?.clientId === "string" ? body.clientId : ""

  if (!weekKey || !missionId || !clientId) {
    return NextResponse.json({ ok: false, error: "Missing weekKey/missionId/clientId" }, { status: 400 })
  }

  const events = db.collection("accomplish_events")
  const counts = db.collection("accomplish_counts")

  let counted = false
  try {
    await events.insertOne({ weekKey, missionId, clientId, createdAt: new Date() })
    counted = true
  } catch (e: any) {
    // duplicate key -> already counted; ignore
    if (e?.code !== 11000) {
      return NextResponse.json({ ok: false, error: "DB error inserting event" }, { status: 500 })
    }
  }

  if (counted) {
    await counts.updateOne({ weekKey, missionId }, { $inc: { count: 1 } }, { upsert: true })
  }

  return NextResponse.json({ ok: true, counted })
}

/**
 * DELETE: undo accomplished. Removes the event if it exists and decrements weekly count.
 * Body: { weekKey, missionId, clientId }
 */
export async function DELETE(req: Request) {
  await ensureIndexes()
  const db = await getDb()

  const body = await req.json().catch(() => null)
  const weekKey = typeof body?.weekKey === "string" ? body.weekKey : ""
  const missionId = typeof body?.missionId === "string" ? body.missionId : ""
  const clientId = typeof body?.clientId === "string" ? body.clientId : ""

  if (!weekKey || !missionId || !clientId) {
    return NextResponse.json({ ok: false, error: "Missing weekKey/missionId/clientId" }, { status: 400 })
  }

  const events = db.collection("accomplish_events")
  const counts = db.collection("accomplish_counts")

  // Only decrement if we actually removed an event
  const del = await events.deleteOne({ weekKey, missionId, clientId })
  const removed = del.deletedCount === 1

  if (removed) {
    const upd = await counts.findOneAndUpdate(
      { weekKey, missionId },
      { $inc: { count: -1 } },
      { returnDocument: "after" }
    )

    const nextCount = Number(upd?.count || upd?.value?.count || 0)

    // Keep DB tidy; never let negative/zero linger
    if (nextCount <= 0) {
      await counts.deleteOne({ weekKey, missionId })
    }
  }

  return NextResponse.json({ ok: true, removed })
}
