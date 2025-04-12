"use client"

import type React from "react"

import { useState, useRef } from "react"
import { format, addDays, startOfWeek, getHours, isSameDay, parseISO } from "date-fns"
import { useDispatch } from "react-redux"
import { updateEvent, createEventFromTask } from "@/lib/redux/slices/eventSlice"
import type { Event } from "@/lib/types"
import CalendarEvent from "./calendar-event"

interface CalendarGridProps {
  currentDate: Date
  events: Event[]
  onSlotClick: (date: Date, hour: number, minute: number) => void
  onEventClick: (event: Event) => void
}

const CalendarGrid = ({ currentDate, events, onSlotClick, onEventClick }: CalendarGridProps) => {
  const dispatch = useDispatch()
  const gridRef = useRef<HTMLDivElement>(null)
  const [draggingEvent, setDraggingEvent] = useState<Event | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)

  // Generate week days starting from the current date's week
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  // Generate hours for the day
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleDragStart = (event: Event, e: React.DragEvent) => {
    setDraggingEvent(event)
    // Set data for task drag detection
    e.dataTransfer.setData("eventId", event._id)

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

  const handleDragOver = (e: React.DragEvent, dayIndex: number, hour: number) => {
    e.preventDefault()
    const cellId = `cell-${dayIndex}-${hour}`
    setDraggedOver(cellId)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
  }

  const handleDrop = (e: React.DragEvent, date: Date, hour: number) => {
    e.preventDefault()
    setDraggedOver(null)

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const y = e.clientY - rect.top
    const cellHeight = rect.height
    const minute = Math.floor((y / cellHeight) * 60)

    // Handle task drop
    const taskId = e.dataTransfer.getData("taskId")
    const taskName = e.dataTransfer.getData("taskName")
    const goalColor = e.dataTransfer.getData("goalColor")

    if (taskId && taskName) {
      const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
      const endHour = hour + 1
      const endTime = `${endHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

      dispatch(
        createEventFromTask({
          taskId,
          taskName,
          date,
          startTime,
          endTime,
          goalColor,
        }) as any,
      )
      return
    }

    // Handle event drop
    if (!draggingEvent) return

    // Calculate new start and end times
    const newStartDate = new Date(date)
    newStartDate.setHours(hour, minute)

    const duration = new Date(draggingEvent.endTime).getTime() - new Date(draggingEvent.startTime).getTime()
    const newEndDate = new Date(newStartDate.getTime() + duration)

    const updatedEvent = {
      ...draggingEvent,
      startTime: newStartDate.toISOString(),
      endTime: newEndDate.toISOString(),
    }

    dispatch(updateEvent(updatedEvent) as any)
    setDraggingEvent(null)
  }

  const getEventsForDayAndHour = (day: Date, hour: number) => {
    return events.filter((event) => {
      const eventStart = parseISO(event.startTime)
      const eventEnd = parseISO(event.endTime)
      return isSameDay(eventStart, day) && getHours(eventStart) <= hour && getHours(eventEnd) > hour
    })
  }

  return (
    <div className="flex flex-col flex-1 overflow-auto" ref={gridRef}>
      <div className="flex border-b sticky top-0 bg-white z-10">
        <div className="w-16 flex-shrink-0"></div>
        {days.map((day, dayIndex) => (
          <div
            key={dayIndex}
            className={`flex-1 text-center p-2 border-l ${isSameDay(day, new Date()) ? "bg-blue-50" : ""}`}
          >
            <div className="text-xs text-gray-500 uppercase">{format(day, "EEE")}</div>
            <div className="font-semibold text-lg">{format(day, "d")}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 overflow-y-auto">
        <div className="w-16 flex-shrink-0">
          {hours.map((hour) => (
            <div key={hour} className="h-20 border-b text-xs text-right pr-2 pt-1 text-gray-500">
              {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
            </div>
          ))}
        </div>
        <div className="flex flex-1">
          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="flex-1 border-l">
              {hours.map((hour) => {
                const dayEvents = getEventsForDayAndHour(day, hour)
                const cellId = `cell-${dayIndex}-${hour}`
                return (
                  <div
                    key={hour}
                    className={`h-20 border-b relative hover:bg-gray-50 transition-colors ${
                      draggedOver === cellId ? "bg-blue-50" : ""
                    }`}
                    onClick={() => onSlotClick(day, hour)}
                    onDragOver={(e) => handleDragOver(e, dayIndex, hour)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, day, hour)}
                  >
                    {dayEvents.map((event) => (
                      <CalendarEvent
                        key={event._id}
                        event={event}
                        onClick={() => onEventClick(event)}
                        onDragStart={(e) => handleDragStart(event, e)}
                      />
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarGrid
