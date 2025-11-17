import { ReactNode } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useRBAC } from '../../hooks/useRBAC'
import { Navigate } from 'react-router-dom'
import LoadingSpinner from '../ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: ReactNode
  requiredPermission?: string
  adminOnly?: boolean
}

export default function ProtectedRoute({ 
  children, 
  requiredPermission, 
  adminOnly = false 
}: ProtectedRouteProps) {
  const { user, isLoading: authLoading } = useAuth()
  const { hasPermission, isLoading: rbacLoading } = useRBAC()

  if (authLoading || rbacLoading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">دسترسی غیرمجاز</h1>
          <p className="text-gray-600">شما دسترسی لازم برای مشاهده این صفحه را ندارید.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}