import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { analyticsService } from '../../services/analyticsService'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  Download,
  Calendar,
  TrendingUp,
  Activity
} from 'lucide-react'

// تعریف تایپ ساده برای DateRange
interface DateRange {
  from: Date
  to: Date
}

export default function Analytics() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 روز گذشته
    to: new Date(),
  })

  const { data: analytics, isLoading } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: () => analyticsService.getDailyAnalytics(dateRange.from, dateRange.to),
  })

  const { data: userAnalytics } = useQuery({
    queryKey: ['userAnalytics'],
    queryFn: analyticsService.getUserAnalytics,
  })

  const stats = [
    {
      title: 'کاربران فعال',
      value: userAnalytics?.length || 0,
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'کارهای تکمیل شده',
      value: analytics?.reduce((sum, day) => sum + day.completedTodos, 0) || 0,
      change: '+8%',
      trend: 'up',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'میانگین زمان تکمیل',
      value: '۲۴ ساعت',
      change: '-5%',
      trend: 'down',
      icon: Clock,
      color: 'yellow'
    },
    {
      title: 'نرخ تعامل',
      value: '۶۸٪',
      change: '+3%',
      trend: 'up',
      icon: Activity,
      color: 'purple'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">آنالیتیکس و گزارشات</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            خروجی Excel
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 ml-2" />
            انتخاب بازه زمانی
          </Button>
        </div>
      </div>

      {/* آمار کلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className={`flex items-center mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendingUp className={`h-4 w-4 ml-1 ${
                      stat.trend === 'down' ? 'rotate-180' : ''
                    }`} />
                    {stat.change} نسبت به ماه گذشته
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار فعالیت کاربران */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">فعالیت کاربران</h3>
          <div className="space-y-4">
            {userAnalytics?.slice(0, 5).map((user) => (
              <div key={user.userId} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center ml-3">
                    <span className="text-primary-600 text-sm font-medium">
                      {user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.email}</p>
                    <p className="text-sm text-gray-500">
                      {user.todoStats.completed} از {user.todoStats.total} کار تکمیل شده
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {Math.round((user.todoStats.completed / user.todoStats.total) * 100)}%
                  </p>
                  <p className="text-xs text-gray-500">نرخ تکمیل</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* آمار کارها */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">آمار کارها</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">کل کارها</span>
              <span className="font-medium">{analytics?.reduce((sum, day) => sum + day.totalTodos, 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">کارهای تکمیل شده</span>
              <span className="font-medium text-green-600">
                {analytics?.reduce((sum, day) => sum + day.completedTodos, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">کارهای در حال انجام</span>
              <span className="font-medium text-blue-600">
                {analytics?.reduce((sum, day) => sum + (day.totalTodos - day.completedTodos), 0)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">میانگین کارهای روزانه</span>
              <span className="font-medium">
                {Math.round(analytics?.reduce((sum, day) => sum + day.totalTodos, 0) / (analytics?.length || 1))}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* جدول گزارشات */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">گزارشات روزانه</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">تاریخ</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">کاربران فعال</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">کاربران جدید</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">کل کارها</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">کارهای تکمیل شده</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">ورود به سیستم</th>
              </tr>
            </thead>
            <tbody>
              {analytics?.map((day, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{day.date}</td>
                  <td className="py-3 px-4 text-sm text-center">{day.activeUsers}</td>
                  <td className="py-3 px-4 text-sm text-center">{day.newUsers}</td>
                  <td className="py-3 px-4 text-sm text-center">{day.totalTodos}</td>
                  <td className="py-3 px-4 text-sm text-center text-green-600">{day.completedTodos}</td>
                  <td className="py-3 px-4 text-sm text-center">{day.loginCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}