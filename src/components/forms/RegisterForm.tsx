import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../ui/Button'
import Input from '../ui/Input'

const registerSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  phoneNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'رمزهای عبور مطابقت ندارند',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void
  isLoading?: boolean
  error?: string
}

export default function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <Input
        label="نام نمایشی"
        error={errors.displayName?.message}
        {...register('displayName')}
      />

      <Input
        label="ایمیل"
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      
      <Input
        label="رمز عبور"
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="تکرار رمز عبور"
        type="password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      
      <Input
        label="شماره تلفن (اختیاری)"
        type="tel"
        error={errors.phoneNumber?.message}
        {...register('phoneNumber')}
      />

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        ثبت نام
      </Button>
    </form>
  )
}