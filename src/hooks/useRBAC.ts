import { useQuery } from '@tanstack/react-query'
import { rbacService } from '../services/rbacService'
import { useAuth } from '../contexts/AuthContext'

export function useRBAC() {
  const { user } = useAuth()

  const { data: userPermissions } = useQuery({
    queryKey: ['userPermissions', user?.uid],
    queryFn: () => rbacService.getUserPermissions(user!.uid),
    enabled: !!user,
  })

  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: rbacService.getRoles,
  })

  const { data: permissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: rbacService.getPermissions,
  })

  const hasPermission = (permission: string): boolean => {
    if (!userPermissions) return false
    return rbacService.hasPermission(userPermissions, permission)
  }

  const canRead = (resource: string) => hasPermission(`${resource}:read`)
  const canCreate = (resource: string) => hasPermission(`${resource}:create`)
  const canUpdate = (resource: string) => hasPermission(`${resource}:update`)
  const canDelete = (resource: string) => hasPermission(`${resource}:delete`)
  const canManage = (resource: string) => hasPermission(`${resource}:manage`)

  return {
    userPermissions: userPermissions || [],
    roles: roles || [],
    permissions: permissions || [],
    hasPermission,
    canRead,
    canCreate,
    canUpdate,
    canDelete,
    canManage,
    isLoading: !userPermissions || !roles || !permissions
  }
}