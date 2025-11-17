import { format, formatDistanceToNow, parseISO } from 'date-fns'
import { faIR } from 'date-fns/locale'

// فرمت تاریخ به فارسی
export const formatDate = (date: Date | string, formatStr: string = 'yyyy/MM/dd') => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: faIR })
}

// فرمت تاریخ نسبی (مثلاً "۲ روز پیش")
export const formatRelativeDate = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(dateObj, { addSuffix: true, locale: faIR })
}

// فرمت سایز فایل
export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
}

// ایجاد slug از متن
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// بررسی ایمیل
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// بررسی شماره تلفن ایرانی
export const isValidIranianPhone = (phone: string): boolean => {
  const phoneRegex = /^09[0-9]{9}$/
  return phoneRegex.test(phone.replace(/[-\s]/g, ''))
}

// ایجاد ID تصادفی
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// محدود کردن متن
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// گروه‌بندی آرایه
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// حذف duplicate از آرایه
export const removeDuplicates = <T>(array: T[], key: keyof T): T[] => {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) {
      return false
    }
    seen.add(value)
    return true
  })
}