import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const taskData = await request.json()

    // Add timestamps
    const taskWithTimestamps = {
      ...taskData,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("tasks").insertOne(taskWithTimestamps)

    // Return the created task
    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        ...taskWithTimestamps,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
