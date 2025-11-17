import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { 
  Download, 
  Upload, 
  Database, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Trash2,
  RefreshCw,
  Settings,
  HardDrive
} from 'lucide-react'

// تایپ‌های مربوط به پشتیبان‌گیری
interface Backup {
  id: string
  name: string
  type: 'full' | 'incremental' | 'differential'
  size: number
  createdAt: Date
  status: 'completed' | 'failed' | 'in-progress'
  databases: string[]
  description?: string
  downloadUrl?: string
}

interface BackupSchedule {
  id: string
  name: string
  type: 'full' | 'incremental'
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  enabled: boolean
  lastRun?: Date
  nextRun: Date
  retentionDays: number
}

interface RestorePoint {
  id: string
  backupId: string
  name: string
  restoredAt: Date
  restoredBy: string
  status: 'completed' | 'failed' | 'in-progress'
}

export default function BackupRestore() {
  const [showCreateBackup, setShowCreateBackup] = useState(false)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null)
  
  const queryClient = useQueryClient()

  // شبیه‌سازی داده‌های پشتیبان‌ها
  const { data: backups, isLoading: backupsLoading } = useQuery<Backup[]>({
    queryKey: ['backups'],
    queryFn: async () => {
      return [
        {
          id: '1',
          name: 'backup-2024-01-15',
          type: 'full',
          size: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
          createdAt: new Date('2024-01-15T03:00:00'),
          status: 'completed',
          databases: ['users', 'todos', 'system'],
          description: 'پشتیبان کامل هفتگی'
        },
        {
          id: '2',
          name: 'backup-2024-01-16',
          type: 'incremental',
          size: 450 * 1024 * 1024, // 450 MB
          createdAt: new Date('2024-01-16T03:00:00'),
          status: 'completed',
          databases: ['users', 'todos'],
          description: 'پشتیبان افزایشی روزانه'
        },
        {
          id: '3',
          name: 'backup-2024-01-17',
          type: 'incremental',
          size: 520 * 1024 * 1024, // 520 MB
          createdAt: new Date('2024-01-17T03:00:00'),
          status: 'in-progress',
          databases: ['users', 'todos'],
          description: 'در حال پشتیبان‌گیری'
        }
      ]
    }
  })

  const { data: schedules, isLoading: schedulesLoading } = useQuery<BackupSchedule[]>({
    queryKey: ['backupSchedules'],
    queryFn: async () => {
      return [
        {
          id: '1',
          name: 'پشتیبان کامل هفتگی',
          type: 'full',
          frequency: 'weekly',
          time: '03:00',
          enabled: true,
          lastRun: new Date('2024-01-15T03:00:00'),
          nextRun: new Date('2024-01-22T03:00:00'),
          retentionDays: 30
        },
        {
          id: '2',
          name: 'پشتیبان افزایشی روزانه',
          type: 'incremental',
          frequency: 'daily',
          time: '02:00',
          enabled: true,
          lastRun: new Date('2024-01-17T02:00:00'),
          nextRun: new Date('2024-01-18T02:00:00'),
          retentionDays: 7
        }
      ]
    }
  })

  const { data: restorePoints, isLoading: restorePointsLoading } = useQuery<RestorePoint[]>({
    queryKey: ['restorePoints'],
    queryFn: async () => {
      return [
        {
          id: '1',
          backupId: '1',
          name: 'Restore-2024-01-10',
          restoredAt: new Date('2024-01-10T14:30:00'),
          restoredBy: 'admin@example.com',
          status: 'completed'
        }
      ]
    }
  })

  // موتیشن‌های مختلف
  const createBackupMutation = useMutation({
    mutationFn: async (backupData: Partial<Backup>) => {
      // شبیه‌سازی ایجاد پشتیبان
      await new Promise(resolve => setTimeout(resolve, 2000))
      return { id: Math.random().toString(36).substr(2, 9), ...backupData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      setShowCreateBackup(false)
    }
  })

  const deleteBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
    }
  })

  const restoreBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      await new Promise(resolve => setTimeout(resolve, 3000))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['restorePoints'] })
      setShowRestoreModal(false)
    }
  })

  const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'failed': return 'text-red-600 bg-red-100'
      case 'in-progress': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'تکمیل شده'
      case 'failed': return 'ناموفق'
      case 'in-progress': return 'در حال انجام'
      default: return 'نامشخص'
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'full': return 'کامل'
      case 'incremental': return 'افزایشی'
      case 'differential': return 'تفاضلی'
      default: return type
    }
  }

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'daily': return 'روزانه'
      case 'weekly': return 'هفتگی'
      case 'monthly': return 'ماهانه'
      default: return frequency
    }
  }

  const handleCreateBackup = async (type: 'full' | 'incremental') => {
    await createBackupMutation.mutateAsync({
      name: `backup-${new Date().toISOString().split('T')[0]}`,
      type,
      size: 0,
      createdAt: new Date(),
      status: 'in-progress',
      databases: ['users', 'todos', 'system'],
      description: type === 'full' ? 'پشتیبان کامل دستی' : 'پشتیبان افزایشی دستی'
    })
  }

  const handleRestoreBackup = async (backupId: string) => {
    await restoreBackupMutation.mutateAsync(backupId)
  }

  const storageStats = {
    total: 500 * 1024 * 1024 * 1024, // 500GB
    used: backups?.reduce((sum, backup) => sum + backup.size, 0) || 0,
    available: 0
  }
  storageStats.available = storageStats.total - storageStats.used
  const usagePercentage = (storageStats.used / storageStats.total) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت پشتیبان‌گیری و بازیابی</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowScheduleModal(true)}>
            <Settings className="h-4 w-4 ml-2" />
            زمان‌بندی
          </Button>
          <Button onClick={() => setShowCreateBackup(true)}>
            <Database className="h-4 w-4 ml-2" />
            پشتیبان جدید
          </Button>
        </div>
      </div>

      {/* آمار فضای ذخیره‌سازی */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-blue-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">فضای استفاده شده</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatBytes(storageStats.used)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-green-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">تعداد پشتیبان‌ها</p>
              <p className="text-2xl font-bold text-gray-900">{backups?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">فضای آزاد</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatBytes(storageStats.available)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* نمودار استفاده از فضای ذخیره‌سازی */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">وضعیت فضای ذخیره‌سازی</h3>
          <div className="text-sm text-gray-500">
            {Math.round(usagePercentage)}% استفاده شده
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full transition-all duration-300 ${
              usagePercentage > 90 ? 'bg-red-600' :
              usagePercentage > 80 ? 'bg-yellow-600' : 'bg-green-600'
            }`}
            style={{ width: `${usagePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>استفاده شده: {formatBytes(storageStats.used)}</span>
          <span>کل فضای: {formatBytes(storageStats.total)}</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* لیست پشتیبان‌ها */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">پشتیبان‌های اخیر</h3>
            <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ['backups'] })}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            {backupsLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              </div>
            ) : backups?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                هیچ پشتیبانی یافت نشد
              </div>
            ) : (
              backups?.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Database className={`h-5 w-5 mt-1 ${
                      backup.type === 'full' ? 'text-blue-500' :
                      backup.type === 'incremental' ? 'text-green-500' : 'text-purple-500'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{backup.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{backup.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 ml-1" />
                          {backup.createdAt.toLocaleDateString('fa-IR')}
                        </span>
                        <span>{formatBytes(backup.size)}</span>
                        <span>{getTypeText(backup.type)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(backup.status)}`}>
                      {getStatusText(backup.status)}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedBackup(backup)
                          setShowRestoreModal(true)
                        }}
                        disabled={backup.status !== 'completed'}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteBackupMutation.mutate(backup.id)}
                        disabled={backup.status === 'in-progress'}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* زمان‌بندی پشتیبان‌گیری */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">زمان‌بندی پشتیبان‌گیری</h3>
            <Button variant="outline" size="sm" onClick={() => setShowScheduleModal(true)}>
              <Settings className="h-4 w-4 ml-2" />
              مدیریت
            </Button>
          </div>

          <div className="space-y-4">
            {schedulesLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
              </div>
            ) : schedules?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                هیچ زمان‌بندی تنظیم نشده است
              </div>
            ) : (
              schedules?.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Clock className={`h-5 w-5 mt-1 ${
                      schedule.enabled ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{schedule.name}</h4>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{getTypeText(schedule.type)}</span>
                        <span>{getFrequencyText(schedule.frequency)}</span>
                        <span>ساعت {schedule.time}</span>
                      </div>
                      {schedule.lastRun && (
                        <p className="text-xs text-gray-500 mt-1">
                          آخرین اجرا: {schedule.lastRun.toLocaleDateString('fa-IR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      schedule.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {schedule.enabled ? 'فعال' : 'غیرفعال'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* تاریخچه بازیابی */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">تاریخچه بازیابی</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">نام بازیابی</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">تاریخ بازیابی</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">توسط</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {restorePointsLoading ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : restorePoints?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    هیچ عملیات بازیابی ثبت نشده است
                  </td>
                </tr>
              ) : (
                restorePoints?.map((point) => (
                  <tr key={point.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm">{point.name}</td>
                    <td className="py-3 px-4 text-sm">{point.restoredAt.toLocaleString('fa-IR')}</td>
                    <td className="py-3 px-4 text-sm">{point.restoredBy}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(point.status)}`}>
                        {getStatusText(point.status)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* مودال ایجاد پشتیبان جدید */}
      <Modal
        isOpen={showCreateBackup}
        onClose={() => setShowCreateBackup(false)}
        title="ایجاد پشتیبان جدید"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleCreateBackup('full')}
              disabled={createBackupMutation.isPending}
              className="p-6 border-2 border-blue-200 rounded-lg text-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <Database className="h-8 w-8 text-blue-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900">پشتیبان کامل</h4>
              <p className="text-sm text-gray-500 mt-2">
                پشتیبان‌گیری از تمام داده‌های سیستم
              </p>
              <p className="text-xs text-gray-400 mt-2">اندازه تقریبی: ۲-۳ GB</p>
            </button>

            <button
              onClick={() => handleCreateBackup('incremental')}
              disabled={createBackupMutation.isPending}
              className="p-6 border-2 border-green-200 rounded-lg text-center hover:border-green-300 hover:bg-green-50 transition-colors"
            >
              <RefreshCw className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900">پشتیبان افزایشی</h4>
              <p className="text-sm text-gray-500 mt-2">
                پشتیبان‌گیری از تغییرات اخیر
              </p>
              <p className="text-xs text-gray-400 mt-2">اندازه تقریبی: ۲۰۰-۵۰۰ MB</p>
            </button>
          </div>

          {createBackupMutation.isPending && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 ml-2"></div>
              <span className="text-sm text-gray-600">در حال ایجاد پشتیبان...</span>
            </div>
          )}
        </div>
      </Modal>

      {/* مودال بازیابی */}
      <Modal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        title="بازیابی از پشتیبان"
      >
        {selectedBackup && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 ml-2" />
                <span className="text-sm font-medium text-yellow-800">هشدار مهم</span>
              </div>
              <p className="text-sm text-yellow-700 mt-2">
                بازیابی داده‌ها باعث جایگزینی داده‌های فعلی خواهد شد. این عمل غیرقابل بازگشت است.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">نام پشتیبان:</span>
                <span className="text-sm font-medium">{selectedBackup.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">تاریخ ایجاد:</span>
                <span className="text-sm font-medium">
                  {selectedBackup.createdAt.toLocaleString('fa-IR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">نوع:</span>
                <span className="text-sm font-medium">{getTypeText(selectedBackup.type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">اندازه:</span>
                <span className="text-sm font-medium">{formatBytes(selectedBackup.size)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowRestoreModal(false)}
              >
                انصراف
              </Button>
              <Button
                onClick={() => handleRestoreBackup(selectedBackup.id)}
                isLoading={restoreBackupMutation.isPending}
                className="bg-red-600 hover:bg-red-700"
              >
                تایید و بازیابی
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* مودال مدیریت زمان‌بندی */}
      <Modal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        title="مدیریت زمان‌بندی پشتیبان‌گیری"
        size="lg"
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">پشتیبان کامل هفتگی</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="روز هفته" value="یکشنبه" disabled />
              <Input label="ساعت" type="time" value="03:00" />
            </div>
            <Input label="مدت نگهداری (روز)" type="number" value="30" />
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">پشتیبان افزایشی روزانه</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="بازه زمانی" value="هر روز" disabled />
              <Input label="ساعت" type="time" value="02:00" />
            </div>
            <Input label="مدت نگهداری (روز)" type="number" value="7" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
              انصراف
            </Button>
            <Button>ذخیره تنظیمات</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}