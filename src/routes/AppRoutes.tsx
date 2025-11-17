import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/layout/Layout'
import ProtectedRoute from '../components/layout/ProtectedRoute'

// Auth Pages
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Main Pages
import Dashboard from '../pages/Dashboard'
import Profile from '../pages/Profile'
import TodoList from '../pages/todos/TodoList'
import TodoDetail from '../pages/todos/TodoDetail'

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard'
import Users from '../pages/admin/Users'
import Analytics from '../pages/admin/Analytics'
import Settings from '../pages/admin/Settings'
import RoleManagement from '../pages/admin/RoleManagement'
import RealTimeMonitoring from '../pages/admin/RealTimeMonitoring'
import BackupRestore from '../pages/admin/BackupRestore'
import CustomFields from '../pages/admin/CustomFields'
import AdvancedSettings from '../pages/admin/AdvancedSettings'
import AuditLogs from '../pages/admin/AuditLogs'

export default function AppRoutes() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/auth/login" 
        element={!user ? <Login /> : <Navigate to="/dashboard" />} 
      />
      <Route 
        path="/auth/register" 
        element={!user ? <Register /> : <Navigate to="/dashboard" />} 
      />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/todos" element={
        <ProtectedRoute requiredPermission="todos:read">
          <Layout>
            <TodoList />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/todos/:id" element={
        <ProtectedRoute requiredPermission="todos:read">
          <Layout>
            <TodoDetail />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly>
          <Layout>
            <AdminDashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/users" element={
        <ProtectedRoute requiredPermission="users:read">
          <Layout>
            <Users />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/analytics" element={
        <ProtectedRoute requiredPermission="analytics:read">
          <Layout>
            <Analytics />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/monitoring" element={
        <ProtectedRoute requiredPermission="system:read">
          <Layout>
            <RealTimeMonitoring />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/backup" element={
        <ProtectedRoute requiredPermission="system:manage">
          <Layout>
            <BackupRestore />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/custom-fields" element={
        <ProtectedRoute requiredPermission="system:manage">
          <Layout>
            <CustomFields />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/advanced-settings" element={
        <ProtectedRoute requiredPermission="system:manage">
          <Layout>
            <AdvancedSettings />
          </Layout>
        </ProtectedRoute>
      } />

      <Route path="/admin/audit-logs" element={
        <ProtectedRoute requiredPermission="system:manage">
          <Layout>
            <AuditLogs />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/settings" element={
        <ProtectedRoute requiredPermission="settings:read">
          <Layout>
            <Settings />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/admin/roles" element={
        <ProtectedRoute requiredPermission="users:manage">
          <Layout>
            <RoleManagement />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}