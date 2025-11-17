import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { 
  Save, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Globe,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react'

const securitySchema = z.object({
  maxLoginAttempts: z.number().min(1).max(10),
  sessionTimeout: z.number().min(5).max(480),
  enable2FA: z.boolean(),
  passwordMinLength: z.number().min(6).max(20),
  passwordRequireSpecial: z.boolean(),
  enableAuditLog: z.boolean()
})

const performanceSchema = z.object({
  cacheEnabled: z.boolean(),
  cacheTTL: z.number().min(1).max(3600),
  queryTimeout: z.number().min(5).max(120),
  maxUploadSize: z.number().min(1).max(100),
  enableGzip: z.boolean(),
  enableCDN: z.boolean()
})

const emailSchema = z.object({
  enableNotifications: z.boolean(),
  enableDigest: z.boolean(),
  digestFrequency: z.enum(['daily', 'weekly', 'monthly']),
  enableWelcomeEmail: z.boolean(),
  enableSystemAlerts: z.boolean()
})

type SecuritySettings = z.infer<typeof securitySchema>
type PerformanceSettings = z.infer<typeof performanceSchema>
type EmailSettings = z.infer<typeof emailSchema>

export default function AdvancedSettings() {
  const [activeTab, setActiveTab] = useState<'security' | 'performance' | 'email' | 'api'>('security')
  const [isLoading, setIsLoading] = useState(false)

  const securityForm = useForm<SecuritySettings>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      enable2FA: false,
      passwordMinLength: 8,
      passwordRequireSpecial: true,
      enableAuditLog: true
    }
  })

  const performanceForm = useForm<PerformanceSettings>({
    resolver: zodResolver(performanceSchema),
    defaultValues: {
      cacheEnabled: true,
      cacheTTL: 300,
      queryTimeout: 30,
      maxUploadSize: 10,
      enableGzip: true,
      enableCDN: false
    }
  })

  const emailForm = useForm<EmailSettings>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      enableNotifications: true,
      enableDigest: true,
      digestFrequency: 'daily',
      enableWelcomeEmail: true,
      enableSystemAlerts: true
    }
  })

  const tabs = [
    { id: 'security', label: 'امنیت', icon: Shield },
    { id: 'performance', label: 'کارایی', icon: Cpu },
    { id: 'email', label: 'ایمیل', icon: Mail },
    { id: 'api', label: 'API', icon: Globe }
  ]

  const onSecuritySubmit = async (data: SecuritySettings) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Security settings saved:', data)
    } catch (error) {
      console.error('Error saving security settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onPerformanceSubmit = async (data: PerformanceSettings) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Performance settings saved:', data)
    } catch (error) {
      console.error('Error saving performance settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const onEmailSubmit = async (data: EmailSettings) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Email settings saved:', data)
    } catch (error) {
      console.error('Error saving email settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">تنظیمات پیشرفته</h1>
          <p className="text-gray-600 mt-1">تنظیمات حرفه‌ای سیستم</p>
        </div>
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
          {activeTab === 'security' && (
            <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات امنیتی</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="حداکثر تلاش برای ورود"
                  type="number"
                  error={securityForm.formState.errors.maxLoginAttempts?.message}
                  {...securityForm.register('maxLoginAttempts', { valueAsNumber: true })}
                />
                
                <Input
                  label="مدت زمان Session (دقیقه)"
                  type="number"
                  error={securityForm.formState.errors.sessionTimeout?.message}
                  {...securityForm.register('sessionTimeout', { valueAsNumber: true })}
                />
                
                <Input
                  label="حداقل طول رمز عبور"
                  type="number"
                  error={securityForm.formState.errors.passwordMinLength?.message}
                  {...securityForm.register('passwordMinLength', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">فعال‌سازی احراز هویت دو مرحله‌ای</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...securityForm.register('enable2FA')}
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">نیاز به کاراکتر خاص در رمز عبور</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...securityForm.register('passwordRequireSpecial')}
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">فعال‌سازی لاگ حسابرسی</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...securityForm.register('enableAuditLog')}
                  />
                </label>
              </div>

              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تنظیمات امنیتی
              </Button>
            </form>
          )}

          {activeTab === 'performance' && (
            <form onSubmit={performanceForm.handleSubmit(onPerformanceSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات کارایی</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="مدت زمان کش (ثانیه)"
                  type="number"
                  error={performanceForm.formState.errors.cacheTTL?.message}
                  {...performanceForm.register('cacheTTL', { valueAsNumber: true })}
                />
                
                <Input
                  label="تایم‌اوت کوئری (ثانیه)"
                  type="number"
                  error={performanceForm.formState.errors.queryTimeout?.message}
                  {...performanceForm.register('queryTimeout', { valueAsNumber: true })}
                />
                
                <Input
                  label="حداکثر سایز آپلود (MB)"
                  type="number"
                  error={performanceForm.formState.errors.maxUploadSize?.message}
                  {...performanceForm.register('maxUploadSize', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">فعال‌سازی سیستم کش</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...performanceForm.register('cacheEnabled')}
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">فعال‌سازی فشرده‌سازی Gzip</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...performanceForm.register('enableGzip')}
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">استفاده از CDN</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...performanceForm.register('enableCDN')}
                  />
                </label>
              </div>

              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تنظیمات کارایی
              </Button>
            </form>
          )}

          {activeTab === 'email' && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">تنظیمات ایمیل</h3>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">فعال‌سازی نوتیفیکیشن‌های ایمیلی</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...emailForm.register('enableNotifications')}
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">فعال‌سازی ایمیل خلاصه</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...emailForm.register('enableDigest')}
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">ایمیل خوش‌آمدگویی برای کاربران جدید</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...emailForm.register('enableWelcomeEmail')}
                  />
                </label>
                
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">هشدارهای سیستمی</span>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                    {...emailForm.register('enableSystemAlerts')}
                  />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فرکانس ایمیل خلاصه
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  {...emailForm.register('digestFrequency')}
                >
                  <option value="daily">روزانه</option>
                  <option value="weekly">هفتگی</option>
                  <option value="monthly">ماهانه</option>
                </select>
              </div>

              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4 ml-2" />
                ذخیره تنظیمات ایمیل
              </Button>
            </form>
          )}

          {activeTab === 'api' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">مدیریت API</h3>
              
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">API Keys</h4>
                  <p className="text-sm text-gray-600 mb-3">مدیریت کلیدهای دسترسی API</p>
                  <Button variant="outline" size="sm">
                    مدیریت کلیدها
                  </Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">مستندات API</h4>
                  <p className="text-sm text-gray-600 mb-3">مستندات کامل endpoints API</p>
                  <Button variant="outline" size="sm">
                    مشاهده مستندات
                  </Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">لاگ‌های API</h4>
                  <p className="text-sm text-gray-600 mb-3">تاریخچه درخواست‌های API</p>
                  <Button variant="outline" size="sm">
                    مشاهده لاگ‌ها
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