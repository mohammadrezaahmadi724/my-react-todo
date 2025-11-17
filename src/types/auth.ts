export interface User {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  phoneNumber?: string
  isAdmin: boolean
  isActive: boolean
  createdAt: Date
  lastLoginAt?: Date
  emailVerified: boolean
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterCredentials {
  email: string
  password: string
  displayName: string
  phoneNumber?: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}