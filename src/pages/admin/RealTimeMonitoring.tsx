import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { 
  Activity, 
  Server, 
  Users, 
  Cpu, 
  Database, 
  Network, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Clock
} from 'lucide-react'

// تایپ‌های مربوط به مانیتورینگ
interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
    loadAverage: number[]
  }
  memory: {
    total: number
    used: number
    free: number
    usagePercentage: number
  }
  disk: {
    total: number
    used: number
    free: number
    usagePercentage: number
  }
  network: {
    incoming: number
    outgoing: number
    connections: number
  }
}

interface ServiceStatus {
  name: string
  status: 'running' | 'stopped' | 'warning'
  uptime: number
  responseTime: number
  lastCheck: Date
}

interface LiveActivity {
  id: string
  type: 'user_login' | 'todo_created' | 'user_registered' | 'system_alert'
  user: string
  description: string
  timestamp: Date
  metadata?: any
}

export default function RealTimeMonitoring() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  // شبیه‌سازی داده‌های real-time
  const { data: metrics, refetch: refetchMetrics } = useQuery<SystemMetrics>({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      // در حالت واقعی از API گرفته می‌شود
      return {
        cpu: {
          usage: Math.random() * 100,
          cores: 8,
          loadAverage: [1.2, 1.5, 1.8]
        },
        memory: {
          total: 16 * 1024, // 16GB
          used: Math.random() * 12 * 1024,
          free: 0,
          usagePercentage: 0
        },
        disk: {
          total: 500 * 1024, // 500GB
          used: Math.random() * 400 * 1024,
          free: 0,
          usagePercentage: 0
        },
        network: {
          incoming: Math.random() * 100,
          outgoing: Math.random() * 50,
          connections: Math.floor(Math.random() * 1000)
        }
      }
    },
    refetchInterval: autoRefresh ? 5000 : false,
  })

  const { data: services, refetch: refetchServices } = useQuery<ServiceStatus[]>({
    queryKey: ['serviceStatus'],
    queryFn: async () => {
      return [
        {
          name: 'Web Server',
          status: 'running',
          uptime: 86400 * 7, // 7 days
          responseTime: 120,
          lastCheck: new Date()
        },
        {
          name: 'Database',
          status: 'running',
          uptime: 86400 * 30, // 30 days
          responseTime: 45,
          lastCheck: new Date()
        },
        {
          name: 'Cache Server',
          status: 'warning',
          uptime: 86400 * 2, // 2 days
          responseTime: 25,
          lastCheck: new Date()
        },
        {
          name: 'Email Service',
          status: 'running',
          uptime: 86400 * 15, // 15 days
          responseTime: 200,
          lastCheck: new Date()
        }
      ]
    },
    refetchInterval: autoRefresh ? 10000 : false,
  })

  const { data: liveActivities, refetch: refetchActivities } = useQuery<LiveActivity[]>({
    queryKey: ['liveActivities'],
    queryFn: async () => {
      const activities: LiveActivity[] = [
        {
          id: '1',
          type: 'user_login',
          user: 'user@example.com',
          description: 'کاربر وارد سیستم شد',
          timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
        },
        {
          id: '2',
          type: 'todo_created',
          user: 'admin@example.com',
          description: 'کار جدید ایجاد شد',
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
        },
        {
          id: '3',
          type: 'user_registered',
          user: 'newuser@example.com',
          description: 'کاربر جدید ثبت نام کرد',
          timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
        },
        {
          id: '4',
          type: 'system_alert',
          user: 'system',
          description: 'هشدار استفاده از CPU',
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        }
      ]
      return activities
    },
    refetchInterval: autoRefresh ? 3000 : false,
  })

  useEffect(() => {
    if (autoRefresh) {
      setLastUpdate(new Date())
    }
  }, [metrics, services, liveActivities, autoRefresh])

  const formatBytes = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    return `${days} روز و ${hours} ساعت`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100'
      case 'stopped': return 'text-red-600 bg-red-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-5 w-5" />
      case 'stopped': return <AlertTriangle className="h-5 w-5" />
      case 'warning': return <AlertTriangle className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_login': return <Users className="h-4 w-4 text-blue-500" />
      case 'todo_created': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'user_registered': return <Users className="h-4 w-4 text-purple-500" />
      case 'system_alert': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const handleRefresh = () => {
    refetchMetrics()
    refetchServices()
    refetchActivities()
    setLastUpdate(new Date())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">مانیتورینگ لحظه‌ای</h1>
          <p className="text-gray-600 mt-1">
            آخرین بروزرسانی: {lastUpdate.toLocaleTimeString('fa-IR')}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
            />
            <span className="text-sm text-gray-700">بروزرسانی خودکار</span>
          </label>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 ml-2" />
            بروزرسانی
          </Button>
        </div>
      </div>

      {/* متریک‌های سیستم */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Cpu className="h-6 w-6 text-blue-500 ml-2" />
              <span className="text-sm font-medium text-gray-600">پردازنده</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              (metrics?.cpu.usage || 0) > 80 ? 'bg-red-100 text-red-800' :
              (metrics?.cpu.usage || 0) > 60 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {Math.round(metrics?.cpu.usage || 0)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>استفاده:</span>
              <span className="font-medium">{Math.round(metrics?.cpu.usage || 0)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>هسته‌ها:</span>
              <span className="font-medium">{metrics?.cpu.cores}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>میانگین بار:</span>
              <span className="font-medium">{metrics?.cpu.loadAverage[0].toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Memory Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Database className="h-6 w-6 text-green-500 ml-2" />
              <span className="text-sm font-medium text-gray-600">حافظه</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              (metrics?.memory.usagePercentage || 0) > 85 ? 'bg-red-100 text-red-800' :
              (metrics?.memory.usagePercentage || 0) > 70 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {Math.round(metrics?.memory.usagePercentage || 0)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>استفاده شده:</span>
              <span className="font-medium">{formatBytes(metrics?.memory.used || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>کل:</span>
              <span className="font-medium">{formatBytes(metrics?.memory.total || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>آزاد:</span>
              <span className="font-medium">{formatBytes(metrics?.memory.free || 0)}</span>
            </div>
          </div>
        </Card>

        {/* Disk Usage */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Server className="h-6 w-6 text-purple-500 ml-2" />
              <span className="text-sm font-medium text-gray-600">دیسک</span>
            </div>
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              (metrics?.disk.usagePercentage || 0) > 90 ? 'bg-red-100 text-red-800' :
              (metrics?.disk.usagePercentage || 0) > 80 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {Math.round(metrics?.disk.usagePercentage || 0)}%
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>استفاده شده:</span>
              <span className="font-medium">{formatBytes(metrics?.disk.used || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>کل:</span>
              <span className="font-medium">{formatBytes(metrics?.disk.total || 0)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>آزاد:</span>
              <span className="font-medium">{formatBytes(metrics?.disk.free || 0)}</span>
            </div>
          </div>
        </Card>

        {/* Network */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Network className="h-6 w-6 text-orange-500 ml-2" />
              <span className="text-sm font-medium text-gray-600">شبکه</span>
            </div>
            <div className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
              فعال
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>دریافتی:</span>
              <span className="font-medium">{(metrics?.network.incoming || 0).toFixed(1)} MB/s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>ارسالی:</span>
              <span className="font-medium">{(metrics?.network.outgoing || 0).toFixed(1)} MB/s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>اتصالات:</span>
              <span className="font-medium">{metrics?.network.connections}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* وضعیت سرویس‌ها */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">وضعیت سرویس‌ها</h3>
          <div className="space-y-4">
            {services?.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${getStatusColor(service.status)}`}>
                    {getStatusIcon(service.status)}
                  </div>
                  <div className="mr-3">
                    <h4 className="font-medium text-gray-900">{service.name}</h4>
                    <p className="text-sm text-gray-500">
                      Uptime: {formatUptime(service.uptime)}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {service.responseTime}ms
                  </p>
                  <p className="text-xs text-gray-500">Response</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* فعالیت‌های زنده */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">فعالیت‌های زنده</h3>
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
              فعال
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {liveActivities?.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-400">
                      {activity.timestamp.toLocaleTimeString('fa-IR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* نمودارهای real-time */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">نمودارهای عملکرد</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* نمودار CPU */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">استفاده از CPU</h4>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(metrics?.cpu.usage || 0)}%
                  </div>
                  <div className="text-sm text-gray-500">میزان استفاده</div>
                </div>
              </div>
            </div>
          </div>

          {/* نمودار Memory */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">استفاده از حافظه</h4>
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {Math.round(metrics?.memory.usagePercentage || 0)}%
                  </div>
                  <div className="text-sm text-gray-500">میزان استفاده</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* هشدارهای سیستم */}
      <Card className="p-6 border-yellow-200 bg-yellow-50">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-600 ml-2" />
          <h3 className="text-lg font-semibold text-yellow-800">هشدارهای سیستم</h3>
        </div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-700">استفاده از CPU به 80% نزدیک می‌شود</span>
            <span className="text-yellow-600">۵ دقیقه پیش</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-yellow-700">حافظه cache پر شده است</span>
            <span className="text-yellow-600">۱۵ دقیقه پیش</span>
          </div>
        </div>
      </Card>
    </div>
  )
}