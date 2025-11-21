import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { UserRole } from '../types/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-brown font-serif text-lg">Carregando...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirecionar para o dashboard correto baseado no role do usuário
    if (user?.role === 'empresa') {
      return <Navigate to="/dashboard/empresa" replace />
    } else {
      return <Navigate to="/dashboard/usuario" replace />
    }
  }

  return <>{children}</>
}

export default ProtectedRoute

