"use client"

import type React from "react"

import { useState } from "react"
import { format, parseISO, differenceInMinutes } from "date-fns"
import type { Event } from "@/lib/types"
import { Clock } from "lucide-react"

interface CalendarEventProps {
  event: Event
  onClick: () => void
  onDragStart: (e: React.DragEvent) => void
}

const CalendarEvent = ({ event, onClick, onDragStart }: CalendarEventProps) => {
  const [expanded, setExpanded] = useState(false)

  const startTime = parseISO(event.startTime)
  const endTime = parseISO(event.endTime)
  const durationMinutes = differenceInMinutes(endTime, startTime)

  // Calculate position and height based on time
  const startHour = startTime.getHours()
  const startMinute = startTime.getMinutes()
  const topPosition = (startMinute / 60) * 100
  const height = (durationMinutes / 60) * 100

  // Get color based on category
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "exercise":
        return {
          bg: "bg-green-100",
          border: "border-l-4 border-green-500",
          dot: "bg-green-500",
          text: "text-green-800",
        }
      case "eating":
        return {
          bg: "bg-yellow-100",
          border: "border-l-4 border-yellow-500",
          dot: "bg-yellow-500",
          text: "text-yellow-800",
        }
      case "work":
        return {
          bg: "bg-blue-100",
          border: "border-l-4 border-blue-500",
          dot: "bg-blue-500",
          text: "text-blue-800",
        }
      case "relax":
        return {
          bg: "bg-purple-100",
          border: "border-l-4 border-purple-500",
          dot: "bg-purple-500",
          text: "text-purple-800",
        }
      case "family":
        return {
          bg: "bg-pink-100",
          border: "border-l-4 border-pink-500",
          dot: "bg-pink-500",
          text: "text-pink-800",
        }
      case "social":
        return {
          bg: "bg-orange-100",
          border: "border-l-4 border-orange-500",
          dot: "bg-orange-500",
          text: "text-orange-800",
        }
      default:
        return {
          bg: "bg-gray-100",
          border: "border-l-4 border-gray-500",
          dot: "bg-gray-500",
          text: "text-gray-800",
        }
    }
  }

  const colorClasses = event.color
    ? {
        bg: "bg-opacity-20",
        border: `border-l-4`,
        dot: "",
        text: "text-gray-800",
        customColor: event.color,
      }
    : getCategoryColor(event.category)

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  return (
    <div
      className={`absolute left-0 right-0 mx-1 rounded overflow-hidden shadow-sm ${colorClasses.bg} ${colorClasses.border} cursor-pointer transition-all hover:shadow-md active:shadow-inner`}
      style={{
        top: `${topPosition}%`,
        height: `${Math.max(height, 5)}%`,
        borderLeftColor: colorClasses.customColor || undefined,
      }}
      onClick={onClick}
      onDoubleClick={handleToggleExpand}
      draggable
      onDragStart={onDragStart}
    >
      <div className={`p-1 text-xs ${colorClasses.text}`}>
        <div className="font-semibold truncate flex items-center">
          <span
            className={`inline-block w-2 h-2 rounded-full mr-1 ${colorClasses.dot}`}
            style={{ backgroundColor: colorClasses.customColor || undefined }}
          ></span>
          {event.title}
        </div>
        {(expanded || durationMinutes >= 30) && (
          <div className="text-xs flex items-center mt-1">
            <Clock className="w-3 h-3 mr-1" />
            {format(startTime, "h:mm a")} - {format(endTime, "h:mm a")}
          </div>
        )}
      </div>
    </div>
  )
}

export default CalendarEvent
