"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchGoals } from "@/lib/redux/slices/goalSlice"
import type { RootState } from "@/lib/redux/store"
import type { Goal } from "@/lib/types"
import GoalItem from "./goal-item"
import TaskItem from "./task-item"
import { Button } from "@/components/ui/button"
import { Plus, ChevronDown, ChevronRight } from "lucide-react"
import GoalModal from "../modals/goal-modal"
import TaskModal from "../modals/task-modal"
import { LoadingSpinner } from "../ui/loading-spinner"

const Sidebar = () => {
  const dispatch = useDispatch()
  const { goals, loading } = useSelector((state: RootState) => state.goals)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [goalsExpanded, setGoalsExpanded] = useState(true)
  const [tasksExpanded, setTasksExpanded] = useState(true)
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchGoals() as any)
  }, [dispatch])

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal._id === selectedGoal?._id ? null : goal)
  }

  return (
    <div className="w-64 border-r bg-white p-4 flex flex-col h-screen overflow-auto">
      <Button className="mb-6 w-full" size="sm" onClick={() => setIsGoalModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Create Goal
      </Button>

      <div className="mb-6">
        <div
          className="flex items-center justify-between mb-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
          onClick={() => setGoalsExpanded(!goalsExpanded)}
        >
          <h2 className="text-sm font-semibold text-gray-900">GOALS</h2>
          {goalsExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>

        {goalsExpanded && (
          <div>
            {loading ? (
              <LoadingSpinner size="sm" className="py-4" />
            ) : goals.length === 0 ? (
              <div className="text-sm text-gray-900 p-2">No goals yet. Create one!</div>
            ) : (
              <ul className="space-y-1">
                {goals.map((goal) => (
                  <GoalItem
                    key={goal._id}
                    goal={goal}
                    isSelected={selectedGoal?._id === goal._id}
                    onClick={() => handleGoalClick(goal)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {selectedGoal && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <div
              className="flex items-center cursor-pointer hover:bg-gray-50 p-1 rounded flex-grow"
              onClick={() => setTasksExpanded(!tasksExpanded)}
            >
              <h2 className="text-sm font-semibold text-gray-900">TASKS</h2>
              {tasksExpanded ? <ChevronDown className="h-4 w-4 ml-1" /> : <ChevronRight className="h-4 w-4 ml-1" />}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsTaskModalOpen(true)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {tasksExpanded && (
            <div>
              {selectedGoal.tasks.length === 0 ? (
                <div className="text-sm text-gray-900 p-2">No tasks for this goal yet.</div>
              ) : (
                <ul className="space-y-1">
                  {selectedGoal.tasks.map((task) => (
                    <TaskItem key={task._id} task={task} goalColor={selectedGoal.color} />
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      <GoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} />
      {selectedGoal && (
        <TaskModal isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} goal={selectedGoal} />
      )}
    </div>
  )
}

export default Sidebar
