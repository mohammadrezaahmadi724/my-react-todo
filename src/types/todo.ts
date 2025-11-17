export type TodoPriority = 'low' | 'medium' | 'high'
export type TodoStatus = 'pending' | 'in-progress' | 'completed' | 'cancelled'

export interface Todo {
  id: string
  title: string
  description?: string
  priority: TodoPriority
  status: TodoStatus
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  userId: string
  userEmail: string
  tags: string[]
  estimatedTime?: number // in minutes
  actualTime?: number // in minutes
}

export interface TodoFilters {
  status?: TodoStatus
  priority?: TodoPriority
  search?: string
  dateFrom?: Date
  dateTo?: Date
  tags?: string[]
}

export interface TodoStats {
  total: number
  completed: number
  pending: number
  inProgress: number
  overdue: number
}