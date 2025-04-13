import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://abhi_nav070:Awd3V9F92_S%3AzFp@cluster0.a0pys1c.mongodb.net/calendar?retryWrites=true&w=majority"
const MONGODB_DB = process.env.MONGODB_DB || "calendar"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function connectToDatabase() {
  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
  }

  if (!MONGODB_DB) {
    throw new Error("Please define the MONGODB_DB environment variable")
  }

  try {
    // Connect to the database
    const client = await MongoClient.connect(MONGODB_URI)
    const db = client.db(MONGODB_DB)

    // Cache the client and db for reuse
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    throw new Error("Unable to connect to database")
  }
}
