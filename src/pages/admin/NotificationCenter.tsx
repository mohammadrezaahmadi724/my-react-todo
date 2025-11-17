import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Plus, Bell, Send, Users, Eye, EyeOff, Calendar } from 'lucide-react'

const notificationSchema = z.object({
  title: z.string().min(1, 'عنوان الزامی است'),
  message: z.string().min(1, 'متن پیام الزامی است'),
  type: z.enum(['info', 'success', 'warning', 'error']),
  recipientType: z.enum(['all', 'specific', 'role']),
  specificUsers: z.array(z.string()).optional(),
  role: z.string().optional(),
  schedule: z.boolean().default(false),
  scheduledAt: z.string().optional(),
})

type NotificationFormData = z.infer<typeof notificationSchema>

export default function NotificationCenter() {
  const [showSendModal, setShowSendModal] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      type: 'info',
      recipientType: 'all',
      schedule: false,
    }
  })

  const onSubmit = async (data: NotificationFormData) => {
    // ارسال نوتیفیکیشن
    console.log('Sending notification:', data)
    setShowSendModal(false)
    form.reset()
  }

  const sentNotifications = [
    {
      id: 1,
      title: 'بروزرسانی سیستم',
      message: 'سیستم در تاریخ ۱۴۰۲/۱۰/۲۰ بروزرسانی خواهد شد',
      type: 'info',
      recipient: 'all',
      sentAt: '۱۴۰۲/۱۰/۱۸ - ۱۰:۳۰',
      status: 'sent',
      readCount: 45
    },
    {
      id: 2,
      title: 'هشدار امنیتی',
      message: 'لطفا رمز عبور خود را تغییر دهید',
      type: 'warning',
      recipient: 'specific',
      sentAt: '۱۴۰۲/۱۰/۱۷ - ۱۴:۲۰',
      status: 'sent',
      readCount: 23
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">مرکز اعلان‌ها</h1>
        <Button onClick={() => setShowSendModal(true)}>
          <Plus className="h-4 w-4 ml-2" />
          ارسال اعلان جدید
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* آمار */}
        <Card className="p-6">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-blue-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">کل اعلان‌های ارسالی</p>
              <p className="text-2xl font-bold text-gray-900">۱۲۴</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Eye className="h-8 w-8 text-green-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">میانگین نرخ خواندن</p>
              <p className="text-2xl font-bold text-gray-900">۷۸٪</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">کاربران فعال</p>
              <p className="text-2xl font-bold text-gray-900">۸۹</p>
            </div>
          </div>
        </Card>
      </div>

      {/* اعلان‌های ارسالی */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">تاریخچه اعلان‌های ارسالی</h3>
        <div className="space-y-4">
          {sentNotifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-lg ${
                  notification.type === 'info' ? 'bg-blue-100' :
                  notification.type === 'warning' ? 'bg-yellow-100' :
                  notification.type === 'error' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <Bell className={`h-5 w-5 ${
                    notification.type === 'info' ? 'text-blue-600' :
                    notification.type === 'warning' ? 'text-yellow-600' :
                    notification.type === 'error' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>ارسال شده: {notification.sentAt}</span>
                    <span>گیرنده: {notification.recipient === 'all' ? 'همه کاربران' : 'کاربران خاص'}</span>
                    <span>تعداد خوانده شده: {notification.readCount}</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                جزئیات
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* مودال ارسال اعلان جدید */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="ارسال اعلان جدید"
        size="lg"
      >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="عنوان اعلان"
            {...form.register('title')}
            error={form.formState.errors.title?.message}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              متن پیام
            </label>
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...form.register('message')}
            />
            {form.formState.errors.message && (
              <p className="mt-1 text-sm text-red-600">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع اعلان
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...form.register('type')}
            >
              <option value="info">اطلاعات</option>
              <option value="success">موفقیت</option>
              <option value="warning">هشدار</option>
              <option value="error">خطا</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              گیرندگان
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...form.register('recipientType')}
            >
              <option value="all">همه کاربران</option>
              <option value="specific">کاربران خاص</option>
              <option value="role">بر اساس نقش</option>
            </select>
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
              {...form.register('schedule')}
            />
            <span className="text-sm text-gray-700">زمان‌بندی ارسال</span>
          </label>

          {form.watch('schedule') && (
            <Input
              label="تاریخ و زمان ارسال"
              type="datetime-local"
              {...form.register('scheduledAt')}
            />
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSendModal(false)}
            >
              انصراف
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 ml-2" />
              ارسال اعلان
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}