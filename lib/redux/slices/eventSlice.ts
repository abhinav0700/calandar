import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { Event } from "@/lib/types"

interface EventState {
  events: Event[]
  loading: boolean
  error: string | null
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
}

export const fetchEvents = createAsyncThunk("events/fetchEvents", async () => {
  const response = await fetch("/api/events")
  if (!response.ok) {
    throw new Error("Failed to fetch events")
  }
  return response.json()
})

export const createEvent = createAsyncThunk("events/createEvent", async (eventData: Omit<Event, "_id">) => {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })
  if (!response.ok) {
    throw new Error("Failed to create event")
  }
  return response.json()
})

export const updateEvent = createAsyncThunk("events/updateEvent", async (eventData: Event) => {
  const response = await fetch(`/api/events/${eventData._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  })
  if (!response.ok) {
    throw new Error("Failed to update event")
  }
  return response.json()
})

export const deleteEvent = createAsyncThunk("events/deleteEvent", async (eventId: string) => {
  const response = await fetch(`/api/events/${eventId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete event")
  }
  return eventId
})

export const createEventFromTask = createAsyncThunk(
  "events/createEventFromTask",
  async ({
    taskId,
    taskName,
    date,
    startTime,
    endTime,
    goalColor,
  }: {
    taskId: string
    taskName: string
    date: Date
    startTime: string
    endTime: string
    goalColor: string
  }) => {
    const startDateTime = new Date(date)
    const [startHour, startMinute] = startTime.split(":").map(Number)
    startDateTime.setHours(startHour, startMinute)

    const endDateTime = new Date(date)
    const [endHour, endMinute] = endTime.split(":").map(Number)
    endDateTime.setHours(endHour, endMinute)

    const eventData = {
      title: taskName,
      category: "work", // Default category
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      color: goalColor,
    }

    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    })

    if (!response.ok) {
      throw new Error("Failed to create event from task")
    }

    return response.json()
  },
)

const eventSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loading = false
        state.events = action.payload
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch events"
      })
      .addCase(createEvent.pending, (state) => {
        state.error = null
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload)
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create event"
      })
      .addCase(updateEvent.pending, (state) => {
        state.error = null
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex((event) => event._id === action.payload._id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update event"
      })
      .addCase(deleteEvent.pending, (state) => {
        state.error = null
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter((event) => event._id !== action.payload)
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = action.error.message || "Failed to delete event"
      })
      .addCase(createEventFromTask.pending, (state) => {
        state.error = null
      })
      .addCase(createEventFromTask.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload)
      })
      .addCase(createEventFromTask.rejected, (state, action) => {
        state.error = action.error.message || "Failed to create event from task"
      })
  },
})

export const { setLoading, setError } = eventSlice.actions
export default eventSlice.reducer
