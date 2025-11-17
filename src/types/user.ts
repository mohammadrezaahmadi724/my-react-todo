export interface User {
  uid: string
  email: string
  displayName?: string
  phoneNumber?: string
  isAdmin: boolean
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
  emailVerified: boolean
  role?: string
  roleAssignedBy?: string
  roleAssignedAt?: Date
}

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  phoneNumber?: string
  avatar?: string
  bio?: string
  timezone: string
  language: string
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
}

export interface UserActivity {
  id: string
  userId: string
  action: string
  description: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  metadata?: any
}