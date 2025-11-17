import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'

export function useUsers() {
  const queryClient = useQueryClient()

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAllUsers,
  })

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, currentStatus }: { userId: string; currentStatus: boolean }) =>
      userService.toggleUserStatus(userId, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: any }) =>
      userService.updateUserProfile(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
    toggleUserStatus: toggleStatusMutation.mutateAsync,
    updateUserProfile: updateProfileMutation.mutateAsync,
    isUpdating: toggleStatusMutation.isPending || updateProfileMutation.isPending,
  }
}