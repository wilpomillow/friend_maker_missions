export const runtime = "nodejs"

import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    // lightweight ping
    await db.command({ ping: 1 })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    )
  }
}
