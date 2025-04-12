"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import EventModal from "../modals/event-modal"
import CalendarHeader from "./calendar-header"
import CalendarGrid from "./calendar-grid"
import { fetchEvents } from "@/lib/redux/slices/eventSlice"
import type { RootState } from "@/lib/redux/store"
import type { Event } from "@/lib/types"
import { Loader2 } from "lucide-react"

const Calendar = () => {
  const dispatch = useDispatch()
  const { events, loading } = useSelector((state: RootState) => state.events)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<{
    date: Date
    startTime: string
    endTime: string
  } | null>(null)

  useEffect(() => {
    dispatch(fetchEvents() as any)
  }, [dispatch])

  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  const handleSlotClick = (date: Date, hour: number, minute = 0) => {
    const startTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
    const endTime = `${(hour + 1).toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`

    setSelectedSlot({
      date,
      startTime,
      endTime,
    })
    setSelectedEvent(null)
    setModalOpen(true)
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
    setSelectedSlot(null)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedEvent(null)
    setSelectedSlot(null)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <CalendarHeader currentDate={currentDate} onDateChange={handleDateChange} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
        <CalendarGrid
          currentDate={currentDate}
          events={events}
          onSlotClick={handleSlotClick}
          onEventClick={handleEventClick}
        />
      )}

      {modalOpen && <EventModal isOpen={modalOpen} onClose={closeModal} event={selectedEvent} slot={selectedSlot} />}
    </div>
  )
}

export default Calendar
