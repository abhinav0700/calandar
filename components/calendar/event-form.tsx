"use client"

import { useState } from "react"
import { format } from "date-fns"
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

interface EventFormProps {
  event?: {
    id: string
    title: string
    date: string
    startTime: string
    endTime: string
    category: string
    color: string
  } | null
  selectedSlot?: {
    date: Date
    startTime: string
    endTime: string
  } | null
  onSubmit: (data: any) => void
  onDelete?: (id: string) => void
}

const EVENT_CATEGORIES = [
  { value: "exercise", label: "Exercise", color: "#EF4444" },
  { value: "eating", label: "Eating", color: "#F59E0B" },
  { value: "work", label: "Work", color: "#3B82F6" },
  { value: "relax", label: "Relax", color: "#10B981" },
  { value: "family", label: "Family", color: "#8B5CF6" },
  { value: "social", label: "Social", color: "#EC4899" },
]

export function EventForm({ event, selectedSlot, onSubmit, onDelete }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    category: event?.category || "work",
    date: event?.date ? format(new Date(event.date), "yyyy-MM-dd") : 
          selectedSlot?.date ? format(selectedSlot.date, "yyyy-MM-dd") : 
          format(new Date(), "yyyy-MM-dd"),
    startTime: event?.startTime || selectedSlot?.startTime || "09:00",
    endTime: event?.endTime || selectedSlot?.endTime || "10:00",
  })
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const category = EVENT_CATEGORIES.find(c => c.value === formData.category)
    onSubmit({
      ...formData,
      color: category?.color,
      date: new Date(`${formData.date}T${formData.startTime}`).toISOString(),
    })
  }

  const handleDelete = () => {
    if (event && onDelete) {
      onDelete(event.id)
    }
    setShowDeleteDialog(false)
  }

  return (
    <>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      {category.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <div className="flex justify-between w-full">
              <Button type="submit" variant="default">
                {event ? "Update" : "Create"}
              </Button>
              {event && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete
                </Button>
              )}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 