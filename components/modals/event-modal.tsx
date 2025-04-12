"use client"

import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createEvent, updateEvent, deleteEvent } from "@/lib/redux/slices/eventSlice"
import type { Event } from "@/lib/types"
import { Calendar, Clock, Trash2, X, MapPin } from "lucide-react"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: Event | null
  slot: {
    date: Date
    startTime: string
    endTime: string
  } | null
}

const EventModal = ({ isOpen, onClose, event, slot }: EventModalProps) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("work")
  const [date, setDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.startTime)
      setTitle(event.title)
      setCategory(event.category)
      setDate(format(eventDate, "yyyy-MM-dd"))
      setStartTime(format(new Date(event.startTime), "HH:mm"))
      setEndTime(format(new Date(event.endTime), "HH:mm"))
      setLocation(event.location || "")
      setDescription(event.description || "")
    } else if (slot) {
      setTitle("")
      setCategory("work")
      setDate(format(slot.date, "yyyy-MM-dd"))
      setStartTime(slot.startTime)
      setEndTime(slot.endTime)
      setLocation("")
      setDescription("")
    }
  }, [event, slot])

  const handleSubmit = () => {
    const startDateTime = new Date(`${date}T${startTime}`)
    const endDateTime = new Date(`${date}T${endTime}`)

    if (event) {
      dispatch(
        updateEvent({
          ...event,
          title,
          category,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          location,
          description,
        }) as any,
      )
    } else {
      dispatch(
        createEvent({
          title,
          category,
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          location,
          description,
        }) as any,
      )
    }

    onClose()
  }

  const handleDelete = () => {
    if (event) {
      dispatch(deleteEvent(event._id) as any)
    }
    onClose()
  }

  // Get color based on category
  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "exercise":
        return "bg-green-500"
      case "eating":
        return "bg-yellow-500"
      case "work":
        return "bg-blue-500"
      case "relax":
        return "bg-purple-500"
      case "family":
        return "bg-pink-500"
      case "social":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-2 ${getCategoryColor(category)}`}></div>
            <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              className="text-lg font-medium border-none shadow-none focus-visible:ring-0 px-0"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex items-center col-span-1">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <Label htmlFor="date">Date</Label>
            </div>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex items-center col-span-1">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <Label htmlFor="time">Time</Label>
            </div>
            <div className="col-span-3 flex items-center space-x-2">
              <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
              <span>to</span>
              <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="flex items-center col-span-1">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <Label htmlFor="location">Location</Label>
            </div>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add location (optional)"
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="col-span-1">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory} className="col-span-3">
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="exercise" className="flex items-center">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Exercise
                  </div>
                </SelectItem>
                <SelectItem value="eating">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    Eating
                  </div>
                </SelectItem>
                <SelectItem value="work">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    Work
                  </div>
                </SelectItem>
                <SelectItem value="relax">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                    Relax
                  </div>
                </SelectItem>
                <SelectItem value="family">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                    Family
                  </div>
                </SelectItem>
                <SelectItem value="social">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    Social
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="col-span-1 pt-2">
              Description
            </Label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description (optional)"
              className="col-span-3 min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          {event && (
            <Button variant="ghost" onClick={handleDelete} className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700" disabled={!title.trim()}>
              {event ? "Save" : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EventModal
