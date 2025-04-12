import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Goal, Task } from "@/lib/types"

interface GoalState {
  goals: Goal[]
  loading: boolean
  error: string | null
}

const initialState: GoalState = {
  goals: [],
  loading: false,
  error: null,
}

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const response = await fetch("/api/goals")
  if (!response.ok) {
    throw new Error("Failed to fetch goals")
  }
  return response.json()
})

export const createGoal = createAsyncThunk("goals/createGoal", async (goalData: { name: string; color: string }) => {
  const response = await fetch("/api/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(goalData),
  })
  if (!response.ok) {
    throw new Error("Failed to create goal")
  }
  return response.json()
})

export const createTask = createAsyncThunk("goals/createTask", async (taskData: { name: string; goalId: string }) => {
  const response = await fetch("/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  })
  if (!response.ok) {
    throw new Error("Failed to create task")
  }
  return response.json()
})

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<Goal[]>) => {
        state.loading = false
        state.goals = action.payload
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch goals"
      })
      .addCase(createGoal.pending, (state) => {
        state.error = null
      })
      .addCase(createGoal.fulfilled, (state, action: PayloadAction<Goal>) => {
        state.goals.push(action.payload)
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create goal"
      })
      .addCase(createTask.pending, (state) => {
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        const goalIndex = state.goals.findIndex((goal) => goal._id === action.payload.goalId)
        if (goalIndex !== -1) {
          if (!state.goals[goalIndex].tasks) {
            state.goals[goalIndex].tasks = []
          }
          state.goals[goalIndex].tasks.push(action.payload)
        }
      })
      .addCase(createTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create task"
      })
  },
})

export default goalSlice.reducer
