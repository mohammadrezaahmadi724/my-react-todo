export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  GUEST = 'guest'
}

export interface Permission {
  id: string
  name: string
  description: string
  category: 'users' | 'todos' | 'system' | 'analytics' | 'settings'
  action: 'create' | 'read' | 'update' | 'delete' | 'manage'
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: string[] // permission IDs
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserRoleAssignment {
  userId: string
  roleId: string
  assignedBy: string
  assignedAt: Date
  expiresAt?: Date
}

export interface RolePermission {
  roleId: string
  permissionId: string
  granted: boolean
  grantedAt: Date
  grantedBy: string
}