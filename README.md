# 🗓️ Smart Calendar App

A Google Calendar-style scheduling application with full CRUD capabilities for events and drag-and-drop task planning based on personal goals.

## 🚀 Features

### 📅 Calendar Functionality
- **Create Events**: Click anywhere on the calendar to open a modal and create a new event.
  - **Fields**:
    - Title
    - Category (Dropdown: `exercise`, `eating`, `work`, `relax`, `family`, `social`)
    - Date
    - Start Time
    - End Time
- **Edit Events**:
  - Drag and drop to update the date/time of events.
  - Resize the event box to update the duration.
- **Delete Events** with a click.
- **Precise Timing**: Events reflect their actual durations (e.g. 15-minute blocks).
- **Responsive Design** for both desktop and mobile views.

### 🎯 Goal & Task System (Sidebar)
- **Goals and Tasks**:
  - Fetched from MongoDB database.
  - Selecting a goal displays its associated tasks.
  - Tasks are color-coded based on the goal.
- **Task to Event**:
  - Drag-and-drop a task onto the calendar.
  - The event modal opens pre-filled with:
    - Task name as the title
    - Selected time/date
    - Goal color
- Saves new events directly to the database.

## 🧠 Tech Stack

- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Node.js + MongoDB
- **Database**: MongoDB Atlas (via Mongoose or MongoDB native driver)
- **Drag & Drop**: `react-beautiful-dnd` or `@dnd-kit/core`
- **Date/Time Handling**: `date-fns` or `moment.js`

