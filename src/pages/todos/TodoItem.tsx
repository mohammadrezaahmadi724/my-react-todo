import { useState } from 'react'
import { Todo } from '../../../types/todo'
import { Edit2, Trash2, Calendar, Clock } from 'lucide-react'
import Button from '../../ui/Button'
import { clsx } from 'clsx'

interface TodoItemProps {
  todo: Todo
  onDelete: (id: string) => Promise<void>
  onToggleStatus: (params: { id: string; status: string }) => Promise<void>
}

export default function TodoItem({ todo, onDelete, onToggleStatus }: TodoItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await onDelete(todo.id)
    } catch (error) {
      console.error('Error deleting todo:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async () => {
    try {
      setIsToggling(true)
      await onToggleStatus({ id: todo.id, status: todo.status })
    } catch (error) {
      console.error('Error toggling todo status:', error)
    } finally {
      setIsToggling(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={clsx(
      'p-4 border rounded-lg transition-all duration-200',
      {
        'bg-gray-50 border-gray-200': todo.status === 'completed',
        'bg-white border-gray-300': todo.status !== 'completed',
      }
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <input
              type="checkbox"
              checked={todo.status === 'completed'}
              onChange={handleToggleStatus}
              disabled={isToggling}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <h3 className={clsx(
              'font-medium text-lg',
              {
                'line-through text-gray-500': todo.status === 'completed',
                'text-gray-900': todo.status !== 'completed',
              }
            )}>
              {todo.title}
            </h3>
          </div>
          
          {todo.description && (
            <p className="text-gray-600 mb-3">{todo.description}</p>
          )}
          
          <div className="flex items-center gap-4 flex-wrap">
            <span className={clsx(
              'px-2 py-1 rounded-full text-xs border',
              getPriorityColor(todo.priority)
            )}>
              {todo.priority === 'high' ? 'بالا' :
               todo.priority === 'medium' ? 'متوسط' : 'پایین'}
            </span>
            
            <span className={clsx(
              'px-2 py-1 rounded-full text-xs',
              getStatusColor(todo.status)
            )}>
              {todo.status === 'completed' ? 'انجام شده' :
               todo.status === 'in-progress' ? 'در حال انجام' :
               todo.status === 'cancelled' ? 'لغو شده' : 'در انتظار'}
            </span>
            
            {todo.dueDate && (
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 ml-1" />
                {new Date(todo.dueDate).toLocaleDateString('fa-IR')}
              </div>
            )}
            
            {todo.estimatedTime && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 ml-1" />
                {todo.estimatedTime} دقیقه
              </div>
            )}
          </div>
          
          {todo.tags && todo.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              {todo.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 mr-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}