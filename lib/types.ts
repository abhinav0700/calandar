export interface Event {
  _id: string
  title: string
  category: string
  startTime: string
  endTime: string
  color?: string
  location?: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface Task {
  _id: string
  name: string
  goalId: string
  completed?: boolean
  dueDate?: string
  createdAt?: string
  updatedAt?: string
}

export interface Goal {
  _id: string
  name: string
  color: string
  icon?: string
  tasks: Task[]
  createdAt?: string
  updatedAt?: string
}
