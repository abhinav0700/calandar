"use client"

import { format, addWeeks, subWeeks, addMonths, subMonths, addDays, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { useState } from "react"

interface CalendarHeaderProps {
  currentDate: Date
  onDateChange: (date: Date) => void
}

const CalendarHeader = ({ currentDate, onDateChange }: CalendarHeaderProps) => {
  const [view, setView] = useState<"day" | "week" | "month" | "year">("week")

  const goToToday = () => {
    onDateChange(new Date())
  }

  const goToPrevious = () => {
    switch (view) {
      case "day":
        onDateChange(subDays(currentDate, 1))
        break
      case "week":
        onDateChange(subWeeks(currentDate, 1))
        break
      case "month":
        onDateChange(subMonths(currentDate, 1))
        break
      case "year":
        onDateChange(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)))
        break
    }
  }

  const goToNext = () => {
    switch (view) {
      case "day":
        onDateChange(addDays(currentDate, 1))
        break
      case "week":
        onDateChange(addWeeks(currentDate, 1))
        break
      case "month":
        onDateChange(addMonths(currentDate, 1))
        break
      case "year":
        onDateChange(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)))
        break
    }
  }

  const changeView = (newView: "day" | "week" | "month" | "year") => {
    setView(newView)
  }

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-20">
      <div className="flex items-center space-x-2">
        <div className="flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-red-500" />
          <h2 className="text-xl font-semibold">Calendar</h2>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={goToToday} className="shadow-sm">
          Today
        </Button>
        <div className="flex items-center bg-gray-100 rounded-md shadow-sm">
          <Button variant="ghost" size="icon" onClick={goToPrevious} className="rounded-l-md rounded-r-none">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNext} className="rounded-l-none rounded-r-md">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <h2 className="text-lg font-medium">{format(currentDate, "MMMM yyyy")}</h2>
      </div>

      <div className="flex items-center bg-gray-100 rounded-md shadow-sm">
        <Button
          variant={view === "day" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => changeView("day")}
          className="rounded-l-md rounded-r-none"
        >
          Day
        </Button>
        <Button
          variant={view === "week" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => changeView("week")}
          className="rounded-none"
        >
          Week
        </Button>
        <Button
          variant={view === "month" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => changeView("month")}
          className="rounded-none"
        >
          Month
        </Button>
        <Button
          variant={view === "year" ? "secondary" : "ghost"}
          size="sm"
          onClick={() => changeView("year")}
          className="rounded-r-md rounded-l-none"
        >
          Year
        </Button>
      </div>
    </div>
  )
}

export default CalendarHeader
