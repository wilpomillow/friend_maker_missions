// src/app/api/accomplish/route.ts
export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { ensureIndexes, getDb } from "@/lib/mongodb"

/**
 * POST: mark accomplished (idempotent).
 * - Upserts an event keyed by (weekKey, missionId, clientId)
 * - Increments weekly count ONLY if this was newly inserted
 *
 * Body: { weekKey, missionId, clientId }
 */
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

  // Atomic, idempotent write:
  // if the event already exists, it will NOT be inserted again
  const up = await events.updateOne(
    { weekKey, missionId, clientId },
    { $setOnInsert: { weekKey, missionId, clientId, createdAt: new Date() } },
    { upsert: true }
  )

  const counted = !!up.upsertedId

  if (counted) {
    await counts.updateOne({ weekKey, missionId }, { $inc: { count: 1 } }, { upsert: true })
  }

  return NextResponse.json({ ok: true, counted })
}

/**
 * DELETE: undo accomplished (idempotent).
 * - Removes the event if it exists
 * - Decrements weekly count ONLY if an event was actually removed
 * - Deletes the counts doc if count <= 0
 *
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

  // Remove exactly one matching event (idempotent)
  const del = await events.deleteOne({ weekKey, missionId, clientId })
  const removed = del.deletedCount === 1

  if (removed) {
    const upd = await counts.findOneAndUpdate(
      { weekKey, missionId },
      { $inc: { count: -1 } },
      { returnDocument: "after" }
    )

    const nextCount = Number(upd?.value?.count ?? 0)
    if (nextCount <= 0) {
      await counts.deleteOne({ weekKey, missionId })
    }
  }

  return NextResponse.json({ ok: true, removed })
}
