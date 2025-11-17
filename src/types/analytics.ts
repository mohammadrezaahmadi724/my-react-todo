export interface AnalyticsData {
  date: string
  activeUsers: number
  newUsers: number
  totalTodos: number
  completedTodos: number
  loginCount: number
}

export interface UserAnalytics {
  userId: string
  email: string
  todoStats: {
    total: number
    completed: number
    pending: number
    averageCompletionTime: number
  }
  activity: {
    lastLogin: Date
    loginCount: number
    averageSessionDuration: number
  }
}

export interface Report {
  id: string
  name: string
  type: 'users' | 'todos' | 'system'
  filters: any
  createdAt: Date
  createdBy: string
}