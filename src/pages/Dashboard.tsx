import { useTodos } from '../hooks/useTodos'
import { useAuth } from '../contexts/AuthContext'
import { todoService } from '../services/todoService'
import { useQuery } from '@tanstack/react-query'
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ListTodo,
  TrendingUp,
  Users
} from 'lucide-react'
import Card from '../components/ui/Card'
import TodoStats from '../components/todos/TodoStats'

export default function Dashboard() {
  const { user } = useAuth()
  const { todos } = useTodos()
  
  const { data: stats } = useQuery({
    queryKey: ['todoStats', user?.uid],
    queryFn: () => todoService.getTodoStats(user!.uid),
    enabled: !!user,
  })

  const recentTodos = todos.slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">داشبورد</h1>
        <p className="text-gray-600">خوش آمدید, {user?.displayName || user?.email}!</p>
      </div>

      {/* آمار */}
      {stats && <TodoStats stats={stats} />}

      {/* کارهای اخیر */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">کارهای اخیر</h3>
          <div className="space-y-3">
            {recentTodos.map((todo) => (
              <div
                key={todo.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    todo.priority === 'high' ? 'bg-red-500' :
                    todo.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <span className={todo.status === 'completed' ? 'line-through text-gray-500' : ''}>
                    {todo.title}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  todo.status === 'completed' ? 'bg-green-100 text-green-800' :
                  todo.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {todo.status === 'completed' ? 'انجام شده' :
                   todo.status === 'in-progress' ? 'در حال انجام' : 'در انتظار'}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* فعالیت‌های اخیر */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">فعالیت‌های اخیر</h3>
          <div className="space-y-4">
            <div className="flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 ml-2" />
              <span>۵ کار جدید اضافه شد</span>
              <span className="text-gray-500 text-xs mr-auto">۲ ساعت پیش</span>
            </div>
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 text-blue-500 ml-2" />
              <span>۳ کاربر جدید ثبت نام کردند</span>
              <span className="text-gray-500 text-xs mr-auto">۱ روز پیش</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}