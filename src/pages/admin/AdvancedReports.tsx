import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Download, Filter, Calendar, FileText, BarChart3, Users, CheckCircle } from 'lucide-react'

export default function AdvancedReports() {
  const [selectedReport, setSelectedReport] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    from: '',
    to: ''
  })

  const reportTemplates = [
    {
      id: 'user-activity',
      name: 'گزارش فعالیت کاربران',
      description: 'گزارش کامل فعالیت‌های کاربران در بازه زمانی مشخص',
      icon: Users,
      category: 'users'
    },
    {
      id: 'todo-performance',
      name: 'گزارش عملکرد کارها',
      description: 'آنالیز عملکرد و نرخ تکمیل کارها',
      icon: CheckCircle,
      category: 'todos'
    },
    {
      id: 'system-usage',
      name: 'گزارش استفاده از سیستم',
      description: 'آمار استفاده از سیستم و ترافیک',
      icon: BarChart3,
      category: 'system'
    },
    {
      id: 'security-audit',
      name: 'گزارش حسابرسی امنیتی',
      description: 'لاگ‌های امنیتی و فعالیت‌های مشکوک',
      icon: FileText,
      category: 'security'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">گزارش‌گیری پیشرفته</h1>
        <Button>
          <Download className="h-4 w-4 ml-2" />
          خروجی Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* انتخاب گزارش */}
        <Card className="p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold mb-4">قالب‌های گزارش</h3>
          <div className="space-y-3">
            {reportTemplates.map((report) => {
              const Icon = report.icon
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`w-full text-right p-4 border rounded-lg transition-colors ${
                    selectedReport === report.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 text-gray-400 ml-2" />
                    <div>
                      <h4 className="font-medium text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* تنظیمات گزارش */}
        <Card className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">تنظیمات گزارش</h3>
          
          <div className="space-y-6">
            {/* بازه زمانی */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">بازه زمانی</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="از تاریخ"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                />
                <Input
                  label="تا تاریخ"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
            </div>

            {/* فیلترهای پیشرفته */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">فیلترهای پیشرفته</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="کاربر خاص (اختیاری)" placeholder="ایمیل کاربر" />
                  <Input label="اولویت کار" placeholder="همه اولویت‌ها" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="وضعیت کار" placeholder="همه وضعیت‌ها" />
                  <Input label="تگ‌ها (اختیاری)" placeholder="تگ‌های مورد نظر" />
                </div>
              </div>
            </div>

            {/* فرمت خروجی */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">فرمت خروجی</h4>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input type="radio" name="format" value="excel" defaultChecked className="ml-2" />
                  <span className="text-sm text-gray-700">Excel (.xlsx)</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" value="pdf" className="ml-2" />
                  <span className="text-sm text-gray-700">PDF</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" value="csv" className="ml-2" />
                  <span className="text-sm text-gray-700">CSV</span>
                </label>
              </div>
            </div>

            {/* پیش‌نمایش و تولید */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button variant="outline">
                <Filter className="h-4 w-4 ml-2" />
                پیش‌نمایش گزارش
              </Button>
              <Button>
                <Download className="h-4 w-4 ml-2" />
                تولید و دانلود گزارش
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* تاریخچه گزارش‌ها */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">تاریخچه گزارش‌های generated</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">نام گزارش</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">تاریخ ایجاد</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">بازه زمانی</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">فرمت</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">سایز</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">عملیات</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-sm">گزارش فعالیت کاربران</td>
                <td className="py-3 px-4 text-sm">۱۴۰۲/۱۰/۱۵ - ۱۰:۳۰</td>
                <td className="py-3 px-4 text-sm">۱۴۰۲/۱۰/۰۱ تا ۱۴۰۲/۱۰/۱۵</td>
                <td className="py-3 px-4 text-sm">Excel</td>
                <td className="py-3 px-4 text-sm">۲.۵ MB</td>
                <td className="py-3 px-4 text-sm">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}