import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { todoService } from '../services/todoService'
import { Todo, TodoFilters } from '../types/todo'
import { useAuth } from '../contexts/AuthContext'

export function useTodos(filters?: TodoFilters) {
  const { user } = useAuth()
  
  const {
    data: todos,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['todos', user?.uid, filters],
    queryFn: () => todoService.getUserTodos(user!.uid, filters),
    enabled: !!user,
  })

  return {
    todos: todos || [],
    isLoading,
    error,
    refetch,
  }
}

export function useTodoMutations() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const createMutation = useMutation({
    mutationFn: todoService.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Todo>) =>
      todoService.updateTodo(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: todoService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      todoService.toggleTodoStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return {
    createTodo: createMutation.mutateAsync,
    updateTodo: updateMutation.mutateAsync,
    deleteTodo: deleteMutation.mutateAsync,
    toggleTodoStatus: toggleStatusMutation.mutateAsync,
    isLoading: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
  }
}