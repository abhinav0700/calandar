"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "@/lib/types"

interface TaskItemProps {
  task: Task
  goalColor: string
}

const TaskItem = ({ task, goalColor }: TaskItemProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.setData("taskId", task._id)
    e.dataTransfer.setData("taskName", task.name)
    e.dataTransfer.setData("goalColor", goalColor)
    e.dataTransfer.setData("taskData", "true") // Flag to identify task drag

    // Create a ghost image that's transparent
    const ghostElement = document.createElement("div")
    ghostElement.style.position = "absolute"
    ghostElement.style.top = "-1000px"
    document.body.appendChild(ghostElement)
    e.dataTransfer.setDragImage(ghostElement, 0, 0)

    // Clean up the ghost element after drag
    setTimeout(() => {
      document.body.removeChild(ghostElement)
    }, 0)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <li
      className={`py-1 px-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-center ${
        isDragging ? "opacity-50" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="w-4 h-4 rounded-full mr-3 flex items-center justify-center border-2"
        style={{ borderColor: goalColor }}
      >
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: goalColor }}></div>
      </div>
      <span className="text-sm">{task.name}</span>
    </li>
  )
}

export default TaskItem
