export interface Comment {
  id: string
  todoId: string
  userId: string
  userEmail: string
  content: string
  createdAt: Date
  updatedAt: Date
  mentions: string[] // userIdهای mentioned
  parentId?: string // برای replyها
  replies?: Comment[]
  edited?: boolean
}

export interface TodoCollaborator {
  id: string
  todoId: string
  userId: string
  userEmail: string
  role: 'viewer' | 'editor' | 'admin'
  addedBy: string
  addedAt: Date
}

export interface ActivityLog {
  id: string
  todoId: string
  userId: string
  userEmail: string
  action: 'created' | 'updated' | 'completed' | 'commented' | 'shared' | 'replied' | 'deleted'
  description: string
  timestamp: Date
  metadata?: any
}