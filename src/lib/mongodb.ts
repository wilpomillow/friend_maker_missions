// src/lib/mongodb.ts
import { MongoClient } from "mongodb"

const rawUri = process.env.MONGODB_URI
const rawDb = process.env.MONGODB_DB

if (!rawUri) throw new Error("Missing env: MONGODB_URI")
if (!rawDb) throw new Error("Missing env: MONGODB_DB")

// ✅ Guaranteed strings after guards
const MONGODB_URI: string = rawUri
const MONGODB_DB: string = rawDb

declare global {
  // eslint-disable-next-line no-var
  var __mongoClient: MongoClient | undefined
  // eslint-disable-next-line no-var
  var __mongoClientPromise: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var __fmmIndexesEnsured: boolean | undefined
}

export async function getMongoClient() {
  if (global.__mongoClient) return global.__mongoClient

  if (!global.__mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
    })

    global.__mongoClientPromise = client.connect()
  }

  global.__mongoClient = await global.__mongoClientPromise
  return global.__mongoClient
}

export async function getDb() {
  const client = await getMongoClient()
  return client.db(MONGODB_DB)
}

export async function ensureIndexes() {
  if (global.__fmmIndexesEnsured) return

  const db = await getDb()

  await db.collection("accomplish_events").createIndex(
    { weekKey: 1, missionId: 1, clientId: 1 },
    { unique: true, name: "uniq_week_mission_client" }
  )

  await db.collection("accomplish_counts").createIndex(
    { weekKey: 1, missionId: 1 },
    { unique: true, name: "uniq_week_mission" }
  )

  global.__fmmIndexesEnsured = true
}
