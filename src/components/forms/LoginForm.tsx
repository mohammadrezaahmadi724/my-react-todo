import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../ui/Button'
import Input from '../ui/Input'

const loginSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => void
  isLoading?: boolean
  error?: string
}

export default function LoginForm({ onSubmit, isLoading, error }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

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
      
      <label className="flex items-center">
        <input
          type="checkbox"
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
          {...register('rememberMe')}
        />
        <span className="text-sm text-gray-600">مرا به خاطر بسپار</span>
      </label>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        ورود
      </Button>
    </form>
  )
}