import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { 
  Search, 
  Filter, 
  Download, 
  User, 
  Calendar,
  Shield,
  Database,
  Eye,
  Edit2,
  Trash2
} from 'lucide-react'

export default function AuditLogs() {
  const [filters, setFilters] = useState({
    action: '',
    user: '',
    dateFrom: '',
    dateTo: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  // شبیه‌سازی داده‌های audit logs
  const { data: auditLogs, isLoading } = useQuery({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      return [
        {
          id: '1',
          action: 'user_login',
          description: 'ورود به سیستم',
          user: 'admin@example.com',
          ip: '192.168.1.100',
          userAgent: 'Chrome/120.0.0.0',
          timestamp: new Date('2024-01-18T10:30:00'),
          status: 'success',
          metadata: { method: 'password' }
        },
        {
          id: '2',
          action: 'todo_created',
          description: 'ایجاد کار جدید',
          user: 'user@example.com',
          ip: '192.168.1.150',
          userAgent: 'Firefox/119.0.0.0',
          timestamp: new Date('2024-01-18T09:15:00'),
          status: 'success',
          metadata: { todoId: '123', title: 'کار نمونه' }
        },
        {
          id: '3',
          action: 'user_updated',
          description: 'بروزرسانی پروفایل کاربر',
          user: 'admin@example.com',
          ip: '192.168.1.100',
          userAgent: 'Chrome/120.0.0.0',
          timestamp: new Date('2024-01-18T08:45:00'),
          status: 'success',
          metadata: { fields: ['displayName'] }
        },
        {
          id: '4',
          action: 'failed_login',
          description: 'ورود ناموفق',
          user: 'unknown@example.com',
          ip: '192.168.1.200',
          userAgent: 'Safari/17.0.0.0',
          timestamp: new Date('2024-01-18T08:30:00'),
          status: 'failed',
          metadata: { reason: 'invalid_password' }
        }
      ]
    }
  })

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'user_login': return <User className="h-4 w-4" />
      case 'todo_created': return <Edit2 className="h-4 w-4" />
      case 'user_updated': return <User className="h-4 w-4" />
      case 'failed_login': return <Shield className="h-4 w-4" />
      default: return <Database className="h-4 w-4" />
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'user_login': return 'bg-blue-100 text-blue-800'
      case 'todo_created': return 'bg-green-100 text-green-800'
      case 'user_updated': return 'bg-yellow-100 text-yellow-800'
      case 'failed_login': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'success' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const filteredLogs = auditLogs?.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAction = !filters.action || log.action === filters.action
    const matchesUser = !filters.user || log.user.includes(filters.user)
    
    return matchesSearch && matchesAction && matchesUser
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لاگ‌های حسابرسی</h1>
          <p className="text-gray-600 mt-1">تاریخچه کامل فعالیت‌های سیستم</p>
        </div>
        <Button>
          <Download className="h-4 w-4 ml-2" />
          خروجی گزارش
        </Button>
      </div>

      {/* فیلترها و جستجو */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="جستجو در لاگ‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-3 pl-10"
              />
            </div>
          </div>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            value={filters.action}
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
          >
            <option value="">همه اقدامات</option>
            <option value="user_login">ورود به سیستم</option>
            <option value="todo_created">ایجاد کار</option>
            <option value="user_updated">ویرایش کاربر</option>
            <option value="failed_login">ورود ناموفق</option>
          </select>
          
          <Input
            placeholder="فیلتر بر اساس کاربر"
            value={filters.user}
            onChange={(e) => setFilters(prev => ({ ...prev, user: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Input
            type="date"
            label="از تاریخ"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
          />
          
          <Input
            type="date"
            label="تا تاریخ"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
          />
          
          <div className="flex items-end">
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 ml-2" />
              اعمال فیلتر
            </Button>
          </div>
        </div>
      </Card>

      {/* آمار */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <Database className="h-8 w-8 text-blue-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">کل رویدادها</p>
              <p className="text-2xl font-bold text-gray-900">{auditLogs?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <User className="h-8 w-8 text-green-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">ورود موفق</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditLogs?.filter(log => log.action === 'user_login' && log.status === 'success').length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">ورود ناموفق</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditLogs?.filter(log => log.action === 'failed_login').length || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <Edit2 className="h-8 w-8 text-purple-500 ml-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">تغییرات داده</p>
              <p className="text-2xl font-bold text-gray-900">
                {auditLogs?.filter(log => 
                  log.action === 'todo_created' || log.action === 'user_updated'
                ).length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* جدول لاگ‌ها */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">اقدام</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">توضیحات</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">کاربر</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">IP</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">زمان</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">وضعیت</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto"></div>
                  </td>
                </tr>
              ) : filteredLogs?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500">
                    هیچ رویدادی یافت نشد
                  </td>
                </tr>
              ) : (
                filteredLogs?.map((log) => (
                  <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <span className="mr-2 text-sm text-gray-600">
                          {log.action === 'user_login' ? 'ورود' :
                           log.action === 'todo_created' ? 'ایجاد کار' :
                           log.action === 'user_updated' ? 'ویرایش کاربر' :
                           log.action === 'failed_login' ? 'ورود ناموفق' : log.action}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{log.description}</p>
                        {log.metadata && (
                          <p className="text-xs text-gray-500 mt-1">
                            {JSON.stringify(log.metadata)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{log.user}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{log.ip}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {log.timestamp.toLocaleString('fa-IR')}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                        {log.status === 'success' ? 'موفق' : 'ناموفق'}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}