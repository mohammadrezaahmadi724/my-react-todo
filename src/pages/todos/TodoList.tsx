import { useState } from 'react'
import { useTodos, useTodoMutations } from '../../hooks/useTodos'
import { Plus, Search, Filter } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Card from '../../components/ui/Card'
import TodoItem from '../../components/todos/TodoItem'
import TodoFilters from '../../components/todos/TodoFilters'
import TodoForm from '../../components/forms/TodoForm'
import { TodoFilters as ITodoFilters } from '../../types/todo'

export default function TodoList() {
  const [showFilters, setShowFilters] = useState(false)
  const [showTodoForm, setShowTodoForm] = useState(false)
  const [filters, setFilters] = useState<ITodoFilters>({})
  const [searchTerm, setSearchTerm] = useState('')
  
  const { todos, isLoading } = useTodos({
    ...filters,
    search: searchTerm,
  })
  
  const { deleteTodo, toggleTodoStatus } = useTodoMutations()

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handleFilterChange = (newFilters: ITodoFilters) => {
    setFilters(newFilters)
  }

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
        <h1 className="text-2xl font-bold text-gray-900">مدیریت کارها</h1>
        <Button onClick={() => setShowTodoForm(true)}>
          <Plus className="h-4 w-4 ml-2" />
          کار جدید
        </Button>
      </div>

      {/* جستجو و فیلتر */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="جستجو در کارها..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pr-3 pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 ml-2" />
            فیلترها
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4">
            <TodoFilters onFilterChange={handleFilterChange} />
          </div>
        )}
      </Card>

      {/* لیست کارها */}
      <Card className="p-6">
        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">📝</div>
              <p className="text-gray-500">هیچ کاری یافت نشد</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setShowTodoForm(true)}
              >
                ایجاد اولین کار
              </Button>
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onDelete={deleteTodo}
                onToggleStatus={toggleTodoStatus}
              />
            ))
          )}
        </div>
      </Card>

      {/* مودال ایجاد کار */}
      {showTodoForm && (
        <TodoForm
          onClose={() => setShowTodoForm(false)}
          onSubmit={() => setShowTodoForm(false)}
        />
      )}
    </div>
  )
}