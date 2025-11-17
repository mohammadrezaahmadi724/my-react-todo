import { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Upload, Folder, File, Image, Download, Trash2, Search, MoreVertical } from 'lucide-react'

export default function FileManager() {
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  const files = [
    {
      id: '1',
      name: 'document.pdf',
      type: 'file',
      size: '2.5 MB',
      modified: '۱۴۰۲/۱۰/۱۵ - ۱۰:۳۰',
      icon: File,
      category: 'documents'
    },
    {
      id: '2',
      name: 'profile.jpg',
      type: 'file',
      size: '1.2 MB',
      modified: '۱۴۰۲/۱۰/۱۴ - ۱۴:۲۰',
      icon: Image,
      category: 'images'
    },
    {
      id: '3',
      name: 'reports',
      type: 'folder',
      size: '15.8 MB',
      modified: '۱۴۰۲/۱۰/۱۳ - ۰۹:۱۵',
      icon: Folder,
      category: 'folders'
    },
    {
      id: '4',
      name: 'backup.zip',
      type: 'file',
      size: '45.2 MB',
      modified: '۱۴۰۲/۱۰/۱۲ - ۱۶:۴۵',
      icon: File,
      category: 'archives'
    }
  ]

  const storageStats = {
    total: 100, // GB
    used: 45.2,
    available: 54.8,
    usagePercentage: 45.2
  }

  const categories = [
    { name: 'همه فایل‌ها', count: 124, icon: File },
    { name: 'عکس‌ها', count: 45, icon: Image },
    { name: 'اسناد', count: 32, icon: File },
    { name: 'آرشیو', count: 12, icon: Folder }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت فایل‌ها</h1>
        <Button>
          <Upload className="h-4 w-4 ml-2" />
          آپلود فایل
        </Button>
      </div>

      {/* آمار فضای ذخیره‌سازی */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">فضای ذخیره‌سازی</h3>
          <div className="text-sm text-gray-500">
            {storageStats.used} GB از {storageStats.total} GB استفاده شده
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${storageStats.usagePercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-2">
          <span>{storageStats.used} GB استفاده شده</span>
          <span>{storageStats.available} GB باقیمانده</span>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* دسته‌بندی‌ها */}
        <Card className="p-4 lg:col-span-1">
          <h4 className="font-medium text-gray-900 mb-4">دسته‌بندی‌ها</h4>
          <nav className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.name}
                  className="flex items-center justify-between w-full px-3 py-2 text-right rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Icon className="h-4 w-4 text-gray-400 ml-2" />
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {category.count}
                  </span>
                </button>
              )
            })}
          </nav>
        </Card>

        {/* لیست فایل‌ها */}
        <Card className="p-6 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="جستجو در فایل‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-3 pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => {
              const Icon = file.icon
              return (
                <div
                  key={file.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <Icon className="h-8 w-8 text-gray-400 ml-2" />
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm truncate max-w-[120px]">
                          {file.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">{file.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{file.modified}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}