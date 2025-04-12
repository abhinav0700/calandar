"use client"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createGoal } from "@/lib/redux/slices/goalSlice"
import { X } from "lucide-react"

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_COLORS = [
  "#4f46e5", // indigo
  "#10b981", // green
  "#3b82f6", // blue
  "#ec4899", // pink
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#06b6d4", // cyan
]

const GoalModal = ({ isOpen, onClose }: GoalModalProps) => {
  const dispatch = useDispatch()
  const [name, setName] = useState("")
  const [color, setColor] = useState(PRESET_COLORS[0])

  const handleSubmit = () => {
    if (name.trim()) {
      dispatch(
        createGoal({
          name: name.trim(),
          color,
        }) as any,
      )
      setName("")
      setColor(PRESET_COLORS[0])
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Create New Goal</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Enter goal name"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Color</Label>
            <div className="col-span-3 flex flex-wrap gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <div
                  key={presetColor}
                  className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                    color === presetColor ? "ring-2 ring-offset-2 ring-black" : ""
                  }`}
                  style={{ backgroundColor: presetColor }}
                  onClick={() => setColor(presetColor)}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GoalModal
