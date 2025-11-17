import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'

const loginSchema = z.object({
  email: z.string().email('ایمیل معتبر نیست'),
  password: z.string().min(6, 'رمز عبور باید حداقل ۶ کاراکتر باشد'),
  rememberMe: z.boolean().optional(),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true)
      setError('')
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setError('ایمیل یا رمز عبور اشتباه است')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">ورود به حساب کاربری</h2>
          <p className="mt-2 text-gray-600">لطفا اطلاعات حساب خود را وارد کنید</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                {...register('rememberMe')}
              />
              <span className="text-sm text-gray-600">مرا به خاطر بسپار</span>
            </label>
            
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              رمز عبور را فراموش کرده‌اید؟
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            ورود
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            حساب کاربری ندارید؟{' '}
            <Link
              to="/auth/register"
              className="text-primary-600 hover:text-primary-500 font-medium"
            >
              ثبت نام کنید
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}