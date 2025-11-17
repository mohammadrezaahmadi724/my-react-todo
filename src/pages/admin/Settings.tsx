import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Save, Mail, Bell, Shield, Database } from 'lucide-react'

const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'نام سایت الزامی است'),
  siteDescription: z.string().optional(),
  adminEmail: z.string().email('ایمیل معتبر نیست'),
  timezone: z.string().min(1, 'منطقه زمانی الزامی است'),
  language: z.string().min(1, 'زبان الزامی است'),
})

const emailSettingsSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP Host الزامی است'),
  smtpPort: z.number().min(1).max(65535),
  smtpUsername: z.string().min(1, 'SMTP Username الزامی است'),
  smtpPassword: z.string().min(1, 'SMTP Password الزامی است'),
  fromEmail: z.string().email('ایمیل معتبر نیست'),
  fromName: z.string().min(1, 'نام ارسال کننده الزامی است'),
})

const notificationSettingsSchema = z.object({
  enableEmailNotifications: z.boolean(),
  enableSMSNotifications: z.boolean(),
  enablePushNotifications: z.boolean(),
  notifyOnNewUser: z.boolean(),
  notifyOnNewTodo: z.boolean(),
  notifyOnSystemAlert: z.boolean(),
})

type GeneralSettingsForm = z.infer<typeof generalSettingsSchema>
type EmailSettingsForm = z.infer<typeof emailSettingsSchema>
type NotificationSettingsForm = z.infer<typeof notificationSettingsSchema>

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'notifications' | 'security'>('general')
  const [isLoading, setIsLoading] = useState(false)

  const generalForm = useForm<GeneralSettingsForm>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      siteName: 'پنل مدیریت',
      siteDescription: 'سیستم مدیریت کارها',
      adminEmail: 'admin@example.com',
      timezone: 'Asia/Tehran',
      language: 'fa',
    }
  })

  const emailForm = useForm<EmailSettingsForm>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpHost: 'smtp.example.com',
      smtpPort: 587,
      smtpUsername: 'user@example.com',
      fromEmail: 'noreply@example.com',
      fromName: 'پنل مدیریت',
    }
  })

  const notificationForm = useForm<NotificationSettingsForm>({
    defaultValues: {
      enableEmailNotifications: true,
      enableSMSNotifications: true,
      enablePushNotifications: false,
      notifyOnNewUser: true,
      notifyOnNewTodo: false,
      notifyOnSystemAlert: true,
    }
  })

  const onGeneralSubmit = async (data: GeneralSettingsForm) => {
    setIsLoading(true)
    try {
      // ذخیره تنظیمات
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('General settings saved:', data)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onEmailSubmit = async (data: EmailSettingsForm) => {
    setIsLoading(true)
    try {
      // ذخیره تنظیمات ایمیل
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Email settings saved:', data)
    } catch (error) {
      console.error('Error saving email settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onNotificationSubmit = async (data: NotificationSettingsForm) => {
    setIsLoading(true)
    try {
      // ذخیره تنظیمات نوتیفیکیشن
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Notification settings saved:', data)
    } catch (error) {
      console.error('Error saving notification settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs = [
    { id: 'general', label: 'عمومی', icon: Database },
    { id: 'email', label: 'ایمیل', icon: Mail },
    { id: 'notifications', label: 'اعلان‌ها', icon: Bell },
    { id: 'security', label: 'امنیت', icon: Shield },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">تنظیمات سیستم</h1>
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
          {activeTab === 'general' && (
            <form onSubmit={generalForm.handleSubmit(onGeneralSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات عمومی</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="نام سایت"
                  error={generalForm.formState.errors.siteName?.message}
                  {...generalForm.register('siteName')}
                />
                
                <Input
                  label="ایمیل ادمین"
                  type="email"
                  error={generalForm.formState.errors.adminEmail?.message}
                  {...generalForm.register('adminEmail')}
                />
                
                <Input
                  label="منطقه زمانی"
                  error={generalForm.formState.errors.timezone?.message}
                  {...generalForm.register('timezone')}
                />
                
                <Input
                  label="زبان"
                  error={generalForm.formState.errors.language?.message}
                  {...generalForm.register('language')}
                />
              </div>
              
              <Input
                label="توضیحات سایت"
                error={generalForm.formState.errors.siteDescription?.message}
                {...generalForm.register('siteDescription')}
              />
              
              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تنظیمات
              </Button>
            </form>
          )}

          {activeTab === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات ایمیل</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="SMTP Host"
                  error={emailForm.formState.errors.smtpHost?.message}
                  {...emailForm.register('smtpHost')}
                />
                
                <Input
                  label="SMTP Port"
                  type="number"
                  error={emailForm.formState.errors.smtpPort?.message}
                  {...emailForm.register('smtpPort', { valueAsNumber: true })}
                />
                
                <Input
                  label="SMTP Username"
                  error={emailForm.formState.errors.smtpUsername?.message}
                  {...emailForm.register('smtpUsername')}
                />
                
                <Input
                  label="SMTP Password"
                  type="password"
                  error={emailForm.formState.errors.smtpPassword?.message}
                  {...emailForm.register('smtpPassword')}
                />
                
                <Input
                  label="ایمیل ارسال"
                  type="email"
                  error={emailForm.formState.errors.fromEmail?.message}
                  {...emailForm.register('fromEmail')}
                />
                
                <Input
                  label="نام ارسال کننده"
                  error={emailForm.formState.errors.fromName?.message}
                  {...emailForm.register('fromName')}
                />
              </div>
              
              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تنظیمات ایمیل
              </Button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات اعلان‌ها</h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...notificationForm.register('enableEmailNotifications')}
                  />
                  <span className="text-sm font-medium text-gray-700">فعال سازی اعلان‌های ایمیلی</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...notificationForm.register('enableSMSNotifications')}
                  />
                  <span className="text-sm font-medium text-gray-700">فعال سازی اعلان‌های پیامکی</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...notificationForm.register('enablePushNotifications')}
                  />
                  <span className="text-sm font-medium text-gray-700">فعال سازی اعلان‌های Push</span>
                </label>
                
                <hr className="my-4" />
                
                <h4 className="font-medium text-gray-900">رویدادهای سیستمی</h4>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...notificationForm.register('notifyOnNewUser')}
                  />
                  <span className="text-sm text-gray-700">اعلان هنگام ثبت نام کاربر جدید</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...notificationForm.register('notifyOnNewTodo')}
                  />
                  <span className="text-sm text-gray-700">اعلان هنگام ایجاد کار جدید</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...notificationForm.register('notifyOnSystemAlert')}
                  />
                  <span className="text-sm text-gray-700">اعلان هشدارهای سیستم</span>
                </label>
              </div>
              
              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تنظیمات اعلان‌ها
              </Button>
            </form>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات امنیتی</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">رمزگذاری داده‌ها</h4>
                  <p className="text-sm text-gray-600 mb-3">تمامی داده‌های حساس در پایگاه داده رمزگذاری می‌شوند.</p>
                  <Button variant="outline" size="sm">
                    به روز رسانی کلیدهای رمزگذاری
                  </Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">لاگ‌های امنیتی</h4>
                  <p className="text-sm text-gray-600 mb-3">تمامی فعالیت‌های کاربران در سیستم ثبت می‌شود.</p>
                  <Button variant="outline" size="sm">
                    مشاهده لاگ‌ها
                  </Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">پشتیبان‌گیری</h4>
                  <p className="text-sm text-gray-600 mb-3">آخرین پشتیبان: ۲۴ ساعت پیش</p>
                  <Button variant="outline" size="sm">
                    ایجاد پشتیبان جدید
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}