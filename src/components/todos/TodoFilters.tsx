import { useState } from 'react'
import { TodoFilters as ITodoFilters } from '../../types/todo'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Filter, X, Search } from 'lucide-react'

interface TodoFiltersProps {
  onFilterChange: (filters: ITodoFilters) => void
  initialFilters?: ITodoFilters
}

export default function TodoFilters({ onFilterChange, initialFilters = {} }: TodoFiltersProps) {
  const [filters, setFilters] = useState<ITodoFilters>(initialFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleFilterChange = (key: keyof ITodoFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {}
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  )

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 ml-2" />
          <h3 className="text-sm font-medium text-gray-700">فیلترها</h3>
        </div>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4 ml-1" />
              پاک کردن فیلترها
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'فیلترهای ساده' : 'فیلترهای پیشرفته'}
          </Button>
        </div>
      </div>

      {/* فیلترهای اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* جستجو */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="جستجو در کارها..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pr-3 pl-10"
          />
        </div>

        {/* وضعیت */}
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">همه وضعیت‌ها</option>
          <option value="pending">در انتظار</option>
          <option value="in-progress">در حال انجام</option>
          <option value="completed">انجام شده</option>
          <option value="cancelled">لغو شده</option>
        </select>

        {/* اولویت */}
        <select
          value={filters.priority || ''}
          onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">همه اولویت‌ها</option>
          <option value="low">پایین</option>
          <option value="medium">متوسط</option>
          <option value="high">بالا</option>
        </select>

        {/* مرتب‌سازی */}
        <select
          value={filters.sortBy || ''}
          onChange={(e) => handleFilterChange('sortBy', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="createdAt-desc">جدیدترین</option>
          <option value="createdAt-asc">قدیمی‌ترین</option>
          <option value="dueDate-asc">زودترین مهلت</option>
          <option value="dueDate-desc">دیرترین مهلت</option>
          <option value="priority-desc">بالاترین اولویت</option>
          <option value="priority-asc">پایین‌ترین اولویت</option>
        </select>
      </div>

      {/* فیلترهای پیشرفته */}
      {showAdvanced && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">فیلترهای پیشرفته</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* تاریخ از */}
            <Input
              label="از تاریخ"
              type="date"
              value={filters.dateFrom ? new Date(filters.dateFrom).toISOString().split('T')[0] : ''}
              onChange={(e) => handleFilterChange('dateFrom', e.target.value ? new Date(e.target.value) : undefined)}
            />

            {/* تاریخ تا */}
            <Input
              label="تا تاریخ"
              type="date"
              value={filters.dateTo ? new Date(filters.dateTo).toISOString().split('T')[0] : ''}
              onChange={(e) => handleFilterChange('dateTo', e.target.value ? new Date(e.target.value) : undefined)}
            />

            {/* تگ‌ها */}
            <Input
              label="تگ‌ها (با کاما جدا کنید)"
              placeholder="کار,فوری,پروژه"
              value={filters.tags?.join(',') || ''}
              onChange={(e) => handleFilterChange('tags', e.target.value ? e.target.value.split(',').map(tag => tag.trim()) : undefined)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {/* زمان تخمینی حداقل */}
            <Input
              label="زمان تخمینی حداقل (دقیقه)"
              type="number"
              min="0"
              value={filters.minEstimatedTime || ''}
              onChange={(e) => handleFilterChange('minEstimatedTime', e.target.value ? parseInt(e.target.value) : undefined)}
            />

            {/* زمان تخمینی حداکثر */}
            <Input
              label="زمان تخمینی حداکثر (دقیقه)"
              type="number"
              min="0"
              value={filters.maxEstimatedTime || ''}
              onChange={(e) => handleFilterChange('maxEstimatedTime', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </div>

          {/* فیلترهای بولین */}
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.overdueOnly || false}
                onChange={(e) => handleFilterChange('overdueOnly', e.target.checked || undefined)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
              />
              <span className="text-sm text-gray-700">فقط کارهای معوقه</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.withDescription || false}
                onChange={(e) => handleFilterChange('withDescription', e.target.checked || undefined)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
              />
              <span className="text-sm text-gray-700">فقط کارهای دارای توضیحات</span>
            </label>
          </div>
        </div>
      )}

      {/* نمایش فیلترهای فعال */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 pt-3 mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">فیلترهای فعال:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                جستجو: {filters.search}
                <button
                  onClick={() => handleFilterChange('search', undefined)}
                  className="mr-1 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.status && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                وضعیت: {filters.status === 'pending' ? 'در انتظار' :
                       filters.status === 'in-progress' ? 'در حال انجام' :
                       filters.status === 'completed' ? 'انجام شده' : 'لغو شده'}
                <button
                  onClick={() => handleFilterChange('status', undefined)}
                  className="mr-1 hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.priority && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                اولویت: {filters.priority === 'low' ? 'پایین' :
                        filters.priority === 'medium' ? 'متوسط' : 'بالا'}
                <button
                  onClick={() => handleFilterChange('priority', undefined)}
                  className="mr-1 hover:text-yellow-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.overdueOnly && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                فقط معوقه
                <button
                  onClick={() => handleFilterChange('overdueOnly', undefined)}
                  className="mr-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            
            {filters.tags && filters.tags.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                تگ‌ها: {filters.tags.join(', ')}
                <button
                  onClick={() => handleFilterChange('tags', undefined)}
                  className="mr-1 hover:text-purple-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}