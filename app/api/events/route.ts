import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const events = await db.collection("events").find({}).toArray()

    // Convert MongoDB ObjectId to string
    const formattedEvents = events.map((event) => ({
      ...event,
      _id: event._id.toString(),
    }))

    return NextResponse.json(formattedEvents)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const eventData = await request.json()

    const result = await db.collection("events").insertOne(eventData)

    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        ...eventData,
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
