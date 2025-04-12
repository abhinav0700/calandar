import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const goals = await db.collection("goals").find({}).toArray()

    // Get tasks for each goal
    const goalsWithTasks = await Promise.all(
      goals.map(async (goal) => {
        const tasks = await db.collection("tasks").find({ goalId: goal._id.toString() }).toArray()

        // Convert MongoDB ObjectId to string
        const formattedTasks = tasks.map((task) => ({
          ...task,
          _id: task._id.toString(),
        }))

        return {
          ...goal,
          _id: goal._id.toString(),
          tasks: formattedTasks,
        }
      }),
    )

    return NextResponse.json(goalsWithTasks)
  } catch (error) {
    console.error("Failed to fetch goals:", error)
    return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { db } = await connectToDatabase()
    const goalData = await request.json()

    // Add timestamps
    const goalWithTimestamps = {
      ...goalData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("goals").insertOne(goalWithTimestamps)

    // Return the created goal with an empty tasks array
    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        ...goalWithTimestamps,
        tasks: [],
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Failed to create goal:", error)
    return NextResponse.json({ error: "Failed to create goal" }, { status: 500 })
  }
}
