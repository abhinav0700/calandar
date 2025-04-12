import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  category: string
  color: string
}

interface CalendarState {
  events: Event[]
  loading: boolean
  error: string | null
}

const initialState: CalendarState = {
  events: [],
  loading: false,
  error: null,
}

// Async thunks for API calls
export const fetchEvents = createAsyncThunk(
  "calendar/fetchEvents",
  async () => {
    const response = await fetch("/api/events")
    const data = await response.json()
    return data
  }
)

export const createEvent = createAsyncThunk(
  "calendar/createEvent",
  async (event: Omit<Event, "id">) => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
    const data = await response.json()
    return data
  }
)

export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  async (event: Event) => {
    const response = await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
    const data = await response.json()
    return data
  }
)

export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  async (eventId: string) => {
    await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    })
    return eventId
  }
)

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.events = action.payload
        state.loading = false
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch events"
      })
      // Create event
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.events.push(action.payload)
      })
      // Update event
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        const index = state.events.findIndex(event => event.id === action.payload.id)
        if (index !== -1) {
          state.events[index] = action.payload
        }
      })
      // Delete event
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<string>) => {
        state.events = state.events.filter(event => event.id !== action.payload)
      })
  },
})

export default calendarSlice.reducer 