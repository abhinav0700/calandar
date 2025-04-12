"use client"

import { useState } from "react"
import type { Task } from "@/lib/types"

export function useTaskDrag() {
  const [draggingTask, setDraggingTask] = useState<{
    id: string
    name: string
    goalColor: string
  } | null>(null)

  const handleTaskDragStart = (task: Task, goalColor: string) => {
    setDraggingTask({
      id: task._id,
      name: task.name,
      goalColor,
    })
  }

  const handleTaskDragEnd = () => {
    setDraggingTask(null)
  }

  return {
    draggingTask,
    handleTaskDragStart,
    handleTaskDragEnd,
  }
}
