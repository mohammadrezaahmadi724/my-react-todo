// نقش‌های کاربری
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
  USER: 'user',
  GUEST: 'guest'
} as const

// اولویت‌های کار
export const TODO_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
} as const

// وضعیت‌های کار
export const TODO_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
} as const

// انواع نوتیفیکیشن
export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const

// محدودیت‌های سیستم
export const SYSTEM_LIMITS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TODO_TAGS: 5,
  MAX_TODO_DESCRIPTION: 1000,
  MAX_USER_DISPLAY_NAME: 50
} as const

// تنظیمات پیش‌فرض
export const DEFAULT_SETTINGS = {
  PAGE_SIZE: 20,
  SESSION_TIMEOUT: 30, // minutes
  CACHE_DURATION: 300, // seconds
  RETRY_ATTEMPTS: 3
} as const