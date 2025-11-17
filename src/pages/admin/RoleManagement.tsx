import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { rbacService, defaultPermissions } from "../../services/rbacService"
// import { Role, UserRole } from '../../../types/rbac'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import { Plus, Edit2, Trash2, Shield, Users, Check } from 'lucide-react'

export default function RoleManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  
  const queryClient = useQueryClient()
  
  const { data: roles, isLoading } = useQuery({
    queryKey: ['roles'],
    queryFn: rbacService.getRoles,
  })

  const createMutation = useMutation({
    mutationFn: rbacService.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setShowCreateModal(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }: { id: string } & Partial<Role>) =>
      rbacService.updateRole(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      setEditingRole(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: rbacService.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    },
  })

  const handleCreateRole = async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
    await createMutation.mutateAsync({
      ...roleData,
      permissions: selectedPermissions,
    })
  }

  const handleUpdateRole = async (updates: Partial<Role>) => {
    if (editingRole) {
      await updateMutation.mutateAsync({
        id: editingRole.id,
        ...updates,
        permissions: selectedPermissions,
      })
    }
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions(prev =>
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const permissionCategories = defaultPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<string, typeof defaultPermissions>)

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
        <h1 className="text-2xl font-bold text-gray-900">مدیریت نقش‌ها و دسترسی‌ها</h1>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 ml-2" />
          نقش جدید
        </Button>
      </div>

      {/* لیست نقش‌ها */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles?.map((role) => (
          <Card key={role.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-gray-400 ml-2" />
                <div>
                  <h3 className="font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
              </div>
              {!role.isDefault && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingRole(role)
                      setSelectedPermissions(role.permissions)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMutation.mutate(role.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">تعداد دسترسی‌ها:</span>
                <span className="font-medium">{role.permissions.length}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">پیش‌فرض:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  role.isDefault 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {role.isDefault ? 'بله' : 'خیر'}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">دسترسی‌های کلیدی:</h4>
                <div className="space-y-1">
                  {role.permissions.slice(0, 3).map(permissionId => {
                    const permission = defaultPermissions.find(p => p.id === permissionId)
                    return permission ? (
                      <div key={permission.id} className="flex items-center text-xs text-gray-600">
                        <Check className="h-3 w-3 text-green-500 ml-1" />
                        {permission.name}
                      </div>
                    ) : null
                  })}
                  {role.permissions.length > 3 && (
                    <div className="text-xs text-gray-500">
                      + {role.permissions.length - 3} دسترسی دیگر
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* مودال ایجاد/ویرایش نقش */}
      <Modal
        isOpen={showCreateModal || !!editingRole}
        onClose={() => {
          setShowCreateModal(false)
          setEditingRole(null)
          setSelectedPermissions([])
        }}
        title={editingRole ? 'ویرایش نقش' : 'ایجاد نقش جدید'}
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="نام نقش"
              placeholder="مثال: مدیر محتوا"
              defaultValue={editingRole?.name}
            />
            <Input
              label="توضیحات"
              placeholder="توضیحاتی درباره نقش"
              defaultValue={editingRole?.description}
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">دسترسی‌ها</h4>
            <div className="space-y-6">
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <div key={category}>
                  <h5 className="font-medium text-gray-700 mb-3 capitalize">{category}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions.map((permission) => (
                      <label key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 ml-2"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">
                            {permission.name}
                          </span>
                          <p className="text-xs text-gray-500">
                            {permission.description}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false)
                setEditingRole(null)
              }}
            >
              انصراف
            </Button>
            <Button
              isLoading={createMutation.isPending || updateMutation.isPending}
              onClick={() => {
                if (editingRole) {
                  handleUpdateRole({})
                } else {
                  handleCreateRole({
                    name: 'نقش جدید',
                    description: 'توضیحات نقش',
                    permissions: selectedPermissions,
                    isDefault: false,
                  })
                }
              }}
            >
              {editingRole ? 'بروزرسانی نقش' : 'ایجاد نقش'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}