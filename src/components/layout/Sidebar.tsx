import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  Settings as SettingsIcon,
  User,
  Activity,
  Database,
  FileText,
  Shield
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'

const menuItems = [
  { path: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/todos', label: 'کارها', icon: CheckSquare },
  { path: '/admin/users', label: 'مدیریت کاربران', icon: Users, adminOnly: true },
  { path: '/admin/analytics', label: 'آنالیتیکس', icon: BarChart3, adminOnly: true },
  { path: '/admin/monitoring', label: 'مانیتورینگ', icon: Activity, adminOnly: true },
  { path: '/admin/backup', label: 'پشتیبان‌گیری', icon: Database, adminOnly: true },
  { path: '/admin/custom-fields', label: 'فیلدهای سفارشی', icon: FileText, adminOnly: true },
  { path: '/admin/advanced-settings', label: 'تنظیمات پیشرفته', icon: SettingsIcon, adminOnly: true },
  { path: '/admin/audit-logs', label: 'لاگ‌های حسابرسی', icon: Shield, adminOnly: true },
  { path: '/admin/settings', label: 'تنظیمات', icon: SettingsIcon, adminOnly: true },
  { path: '/admin/roles', label: 'مدیریت نقش‌ها', icon: Users, adminOnly: true },
]

export default function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const filteredMenuItems = menuItems.filter(item => 
    !item.adminOnly || (item.adminOnly && user?.isAdmin)
  )

  return (
    <aside className="w-64 bg-white shadow-sm border-l border-gray-200 min-h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={clsx(
                    'flex items-center w-full px-3 py-2 text-right rounded-md transition-colors',
                    {
                      'bg-primary-50 text-primary-600 border-r-2 border-primary-600': isActive,
                      'text-gray-600 hover:bg-gray-50': !isActive,
                    }
                  )}
                >
                  <Icon className="h-5 w-5 ml-2" />
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}