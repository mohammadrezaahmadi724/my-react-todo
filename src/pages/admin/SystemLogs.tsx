import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Search, Filter, Download, AlertTriangle, Shield, User, Database } from 'lucide-react'

export default function SystemLogs() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'security' | 'user' | 'system'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const logCategories = [
    { id: 'all', name: 'همه لاگ‌ها', count: 1247, icon: Database },
    { id: 'security', name: 'امنیتی', count: 89, icon: Shield },
    { id: 'user', name: 'کاربران', count: 856, icon: User },
    { id: 'system', name: 'سیستم', count: 302, icon: AlertTriangle },
  ]

  const logs = [
    {
      id: 1,
      category: 'security',
      level: 'high',
      message: 'تلاش برای ورود ناموفق از IP: 192.168.1.100',
      user: 'user@example.com',
      ip: '192.168.1.100',
      timestamp: '۱۴۰۲/۱۰/۱۸ - ۱۰:۳۰:۲۵',
      details: '۵ تلاش ناموفق در ۲ دقیقه'
    },
    {
      id: 2,
      category: 'user',
      level: 'medium',
      message: 'کاربر جدید ثبت نام کرد',
      user: 'newuser@example.com',
      ip: '192.168.1.150',
      timestamp: '۱۴۰۲/۱۰/۱۸ - ۰۹:۱۵:۱۰',
      details: 'ثبت نام موفقیت‌آمیز'
    },
    {
      id: 3,
      category: 'system',
      level: 'low',
      message: 'پشتیبان‌گیری خودکار انجام شد',
      user: 'system',
      ip: 'localhost',
      timestamp: '۱۴۰۲/۱۰/۱۸ - ۰۴:۰۰:۰۰',
      details: 'پشتیبان‌گیری از دیتابیس تکمیل شد'
    }
  ]

  const filteredLogs = logs.filter(log => {
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'high': return 'بالا'
      case 'medium': return 'متوسط'
      case 'low': return 'پایین'
      default: return 'نامشخص'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">لاگ‌های سیستم و امنیت</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجو در لاگ‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-3 pl-10"
            />
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 ml-2" />
            خروجی لاگ‌ها
          </Button>
        </div>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {logCategories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`p-6 border rounded-lg text-right transition-colors ${
                selectedCategory === category.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${
                  selectedCategory === category.id ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    selectedCategory === category.id ? 'text-primary-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{category.count}</p>
                  <p className="text-sm text-gray-600 mt-1">{category.name}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* جدول لاگ‌ها */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">سطح</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">پیام</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">کاربر</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">IP</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">زمان</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                      {getLevelText(log.level)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{log.user}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{log.ip}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      جزئیات
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}