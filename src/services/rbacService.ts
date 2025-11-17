import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  query, 
  where,
  addDoc,
  deleteDoc 
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { UserRole, Role, Permission, UserRoleAssignment } from '../types/rbac'

// دسترسی‌های پیش‌فرض سیستم
export const defaultPermissions: Permission[] = [
  // کاربران
  { id: 'users:read', name: 'مشاهده کاربران', description: 'مشاهده لیست کاربران', category: 'users', action: 'read' },
  { id: 'users:create', name: 'ایجاد کاربر', description: 'ایجاد کاربر جدید', category: 'users', action: 'create' },
  { id: 'users:update', name: 'ویرایش کاربران', description: 'ویرایش اطلاعات کاربران', category: 'users', action: 'update' },
  { id: 'users:delete', name: 'حذف کاربران', description: 'حذف کاربران از سیستم', category: 'users', action: 'delete' },
  { id: 'users:manage', name: 'مدیریت کاربران', description: 'مدیریت کامل کاربران', category: 'users', action: 'manage' },

  // کارها
  { id: 'todos:read', name: 'مشاهده کارها', description: 'مشاهده لیست کارها', category: 'todos', action: 'read' },
  { id: 'todos:create', name: 'ایجاد کار', description: 'ایجاد کار جدید', category: 'todos', action: 'create' },
  { id: 'todos:update', name: 'ویرایش کارها', description: 'ویرایش اطلاعات کارها', category: 'todos', action: 'update' },
  { id: 'todos:delete', name: 'حذف کارها', description: 'حذف کارها از سیستم', category: 'todos', action: 'delete' },
  { id: 'todos:manage', name: 'مدیریت کارها', description: 'مدیریت کامل کارها', category: 'todos', action: 'manage' },

  // آنالیتیکس
  { id: 'analytics:read', name: 'مشاهده آمار', description: 'مشاهده آمار و گزارشات', category: 'analytics', action: 'read' },
  { id: 'analytics:manage', name: 'مدیریت آمار', description: 'مدیریت کامل آمار و گزارشات', category: 'analytics', action: 'manage' },

  // سیستم
  { id: 'system:read', name: 'مشاهده سیستم', description: 'مشاهده وضعیت سیستم', category: 'system', action: 'read' },
  { id: 'system:manage', name: 'مدیریت سیستم', description: 'مدیریت کامل سیستم', category: 'system', action: 'manage' },

  // تنظیمات
  { id: 'settings:read', name: 'مشاهده تنظیمات', description: 'مشاهده تنظیمات سیستم', category: 'settings', action: 'read' },
  { id: 'settings:update', name: 'ویرایش تنظیمات', description: 'ویرایش تنظیمات سیستم', category: 'settings', action: 'update' },
]

// نقش‌های پیش‌فرض سیستم
export const defaultRoles: Role[] = [
  {
    id: UserRole.SUPER_ADMIN,
    name: 'سوپر ادمین',
    description: 'دسترسی کامل به تمام بخش‌های سیستم',
    permissions: defaultPermissions.map(p => p.id),
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: UserRole.ADMIN,
    name: 'ادمین',
    description: 'دسترسی مدیریتی به سیستم',
    permissions: [
      'users:read', 'users:create', 'users:update', 'users:delete',
      'todos:read', 'todos:create', 'todos:update', 'todos:delete', 'todos:manage',
      'analytics:read', 'analytics:manage',
      'system:read',
      'settings:read', 'settings:update'
    ],
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: UserRole.MODERATOR,
    name: 'ناظر',
    description: 'دسترسی نظارتی به کاربران و محتوا',
    permissions: [
      'users:read',
      'todos:read', 'todos:update',
      'analytics:read'
    ],
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: UserRole.USER,
    name: 'کاربر',
    description: 'کاربر عادی سیستم',
    permissions: [
      'todos:read', 'todos:create', 'todos:update', 'todos:delete'
    ],
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: UserRole.GUEST,
    name: 'میهمان',
    description: 'دسترسی محدود به سیستم',
    permissions: [
      'todos:read'
    ],
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export const rbacService = {
  // دریافت تمام نقش‌ها
  async getRoles(): Promise<Role[]> {
    try {
      // در حالت واقعی از دیتابیس خوانده می‌شود
      return defaultRoles
    } catch (error) {
      console.error('Error getting roles:', error)
      return []
    }
  },

  // دریافت تمام دسترسی‌ها
  async getPermissions(): Promise<Permission[]> {
    return defaultPermissions
  },

  // دریافت دسترسی‌های کاربر
  async getUserPermissions(userId: string): Promise<string[]> {
    try {
      // در حالت واقعی از دیتابیس خوانده می‌شود
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)))
      
      if (!userDoc.empty) {
        const userData = userDoc.docs[0].data()
        const userRole = userData.role || UserRole.USER
        
        const roles = await this.getRoles()
        const role = roles.find(r => r.id === userRole)
        
        return role?.permissions || []
      }
      
      return defaultRoles.find(r => r.id === UserRole.USER)?.permissions || []
    } catch (error) {
      console.error('Error getting user permissions:', error)
      return []
    }
  },

  // تغییر نقش کاربر
  async assignRoleToUser(userId: string, roleId: string, assignedBy: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        role: roleId,
        roleAssignedBy: assignedBy,
        roleAssignedAt: new Date()
      })

      // ثبت در تاریخچه
      await addDoc(collection(db, 'roleAssignments'), {
        userId,
        roleId,
        assignedBy,
        assignedAt: new Date()
      })
    } catch (error) {
      console.error('Error assigning role to user:', error)
      throw error
    }
  },

  // بررسی دسترسی
  hasPermission(userPermissions: string[], requiredPermission: string): boolean {
    if (userPermissions.includes('*')) return true
    return userPermissions.includes(requiredPermission)
  },

  // ایجاد نقش جدید
  async createRole(roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'roles'), {
      ...roleData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  },

  // آپدیت نقش
  async updateRole(roleId: string, updates: Partial<Role>): Promise<void> {
    const roleRef = doc(db, 'roles', roleId)
    await updateDoc(roleRef, {
      ...updates,
      updatedAt: new Date()
    })
  },

  // حذف نقش
  async deleteRole(roleId: string): Promise<void> {
    const roleRef = doc(db, 'roles', roleId)
    await deleteDoc(roleRef)
  }
}