import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { User, Mail, Phone, Save, Camera, Shield } from 'lucide-react'

const profileSchema = z.object({
  displayName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد'),
  email: z.string().email('ایمیل معتبر نیست'),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, 'بیوگرافی نباید بیشتر از ۵۰۰ کاراکتر باشد').optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, 'رمز عبور فعلی باید حداقل ۶ کاراکتر باشد'),
  newPassword: z.string().min(6, 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'رمزهای عبور مطابقت ندارند',
  path: ['confirmPassword'],
})

type ProfileFormData = z.infer<typeof profileSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

export default function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile')
  const [isLoading, setIsLoading] = useState(false)

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
      phoneNumber: '',
      bio: '',
    }
  })

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    try {
      // آپدیت پروفایل
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Profile updated:', data)
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsLoading(true)
    try {
      // تغییر رمز عبور
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Password changed:', data)
      passwordForm.reset()
    } catch (error) {
      console.error('Error changing password:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'پروفایل', icon: User },
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'notifications', label: 'اعلان‌ها', icon: Mail },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">پروفایل کاربری</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* منوی تب‌ها */}
        <Card className="p-4 lg:col-span-1">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center w-full px-3 py-2 text-right rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 ml-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </Card>

        {/* محتوای تب‌ها */}
        <Card className="p-6 lg:col-span-3">
          {activeTab === 'profile' && (
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-primary-600" />
                  </div>
                  <button
                    type="button"
                    className="absolute bottom-0 left-0 bg-white rounded-full p-2 shadow-md border"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold">{user?.displayName || 'کاربر'}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    عضو since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fa-IR') : '---'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="نام نمایشی"
                  error={profileForm.formState.errors.displayName?.message}
                  {...profileForm.register('displayName')}
                />
                
                <Input
                  label="ایمیل"
                  type="email"
                  error={profileForm.formState.errors.email?.message}
                  {...profileForm.register('email')}
                />
                
                <Input
                  label="شماره تلفن"
                  type="tel"
                  error={profileForm.formState.errors.phoneNumber?.message}
                  {...profileForm.register('phoneNumber')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  بیوگرافی
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  {...profileForm.register('bio')}
                />
                {profileForm.formState.errors.bio && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileForm.formState.errors.bio.message}
                  </p>
                )}
              </div>

              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تغییرات
              </Button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تغییر رمز عبور</h3>
              
              <div className="space-y-4">
                <Input
                  label="رمز عبور فعلی"
                  type="password"
                  error={passwordForm.formState.errors.currentPassword?.message}
                  {...passwordForm.register('currentPassword')}
                />
                
                <Input
                  label="رمز عبور جدید"
                  type="password"
                  error={passwordForm.formState.errors.newPassword?.message}
                  {...passwordForm.register('newPassword')}
                />
                
                <Input
                  label="تکرار رمز عبور جدید"
                  type="password"
                  error={passwordForm.formState.errors.confirmPassword?.message}
                  {...passwordForm.register('confirmPassword')}
                />
              </div>

              <Button type="submit" isLoading={isLoading}>
                تغییر رمز عبور
              </Button>

              <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">فعال‌سازی احراز هویت دو مرحله‌ای</h4>
                <p className="text-sm text-gray-600 mb-3">
                  برای امنیت بیشتر، احراز هویت دو مرحله‌ای را فعال کنید.
                </p>
                <Button variant="outline" size="sm">
                  فعال‌سازی 2FA
                </Button>
              </div>
            </form>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات اعلان‌ها</h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">اعلان‌های ایمیلی</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">اعلان‌های پیامکی</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">اعلان‌های Push</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                </label>
                
                <hr className="my-4" />
                
                <h4 className="font-medium text-gray-900">اعلان‌های فعالیت‌ها</h4>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">هنگام ایجاد کار جدید</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">هنگام تکمیل کار</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">هنگام نزدیک شدن مهلت کار</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    defaultChecked
                  />
                </label>
              </div>
              
              <Button>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تنظیمات
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}