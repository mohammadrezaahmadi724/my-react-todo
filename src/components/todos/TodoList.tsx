import { Todo } from '../../../types/todo'
import TodoItem from './TodoItem'

interface TodoListProps {
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onDelete: (todoId: string) => void
  onToggleStatus: (todoId: string, currentStatus: string) => void
  isLoading?: boolean
}

export default function TodoList({ todos, onEdit, onDelete, onToggleStatus, isLoading }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-4xl mb-4">📝</div>
        <p className="text-gray-500">هیچ کاری یافت نشد</p>
        <p className="text-sm text-gray-400 mt-2">کار جدیدی ایجاد کنید</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleStatus={onToggleStatus}
          isLoading={isLoading}
        />
      ))}
    </div>
  )
}