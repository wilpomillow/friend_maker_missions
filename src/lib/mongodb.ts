// src/lib/mongodb.ts
import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri) throw new Error("Missing env: MONGODB_URI")
if (!dbName) throw new Error("Missing env: MONGODB_DB")

// ⬇️ Explicitly narrow types AFTER guards
const MONGO_URI: string = uri
const MONGO_DB: string = dbName

declare global {
  // eslint-disable-next-line no-var
  var __fmmMongoClientPromise: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var __fmmIndexesEnsured: boolean | undefined
}

export async function getMongoClient() {
  if (!global.__fmmMongoClientPromise) {
    const client = new MongoClient(MONGO_URI)
    global.__fmmMongoClientPromise = client.connect()
  }
  return global.__fmmMongoClientPromise
}

export async function getDb() {
  const client = await getMongoClient()
  return client.db(MONGO_DB)
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
