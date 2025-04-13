"use client"

import type { Goal } from "@/lib/types"

interface GoalItemProps {
  goal: Goal
  isSelected: boolean
  onClick: () => void
}

const GoalItem = ({ goal, isSelected, onClick }: GoalItemProps) => {
  return (
    <li
      className={`py-1 px-2 rounded-md cursor-pointer flex items-center ${
        isSelected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: goal.color }}></div>
      <span className="text-sm text-gray-900">{goal.name}</span>
    </li>
  )
}

export default GoalItem
