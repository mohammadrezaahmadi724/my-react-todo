import { z } from 'zod'

// والیدیشن ایمیل
export const emailValidator = z.string().email('ایمیل معتبر نیست')

// والیدیشن رمز عبور
export const passwordValidator = z
  .string()
  .min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد')
  .max(50, 'رمز عبور نمی‌تواند بیشتر از ۵۰ کاراکتر باشد')

// والیدیشن نام
export const nameValidator = z
  .string()
  .min(2, 'نام باید حداقل ۲ کاراکتر باشد')
  .max(50, 'نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد')

// والیدیشن شماره تلفن
export const phoneValidator = z
  .string()
  .regex(/^09[0-9]{9}$/, 'شماره تلفن معتبر نیست')

// والیدیشن URL
export const urlValidator = z.string().url('آدرس معتبر نیست')

// والیدیشن عدد
export const numberValidator = z
  .number()
  .min(0, 'عدد نمی‌تواند منفی باشد')

// والیدیشن تاریخ
export const dateValidator = z
  .string()
  .refine((date) => !isNaN(Date.parse(date)), 'تاریخ معتبر نیست')

// والیدیشن فایل
export const fileValidator = (maxSize: number = 10 * 1024 * 1024) => 
  z.instanceof(File)
    .refine((file) => file.size <= maxSize, `حجم فایل نباید بیشتر از ${maxSize / 1024 / 1024}MB باشد`)

// والیدیشن آرایه
export const arrayValidator = <T>(validator: z.ZodType<T>) => 
  z.array(validator)

// والیدیشن object
export const objectValidator = <T extends z.ZodRawShape>(shape: T) => 
  z.object(shape)

// ترکیب چند والیدیشن
export const createValidator = <T extends z.ZodRawShape>(shape: T) => 
  z.object(shape)