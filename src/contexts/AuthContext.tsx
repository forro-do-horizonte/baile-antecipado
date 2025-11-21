import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole, AuthContextType } from '../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Carregar usuário do localStorage ao inicializar
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error)
        localStorage.removeItem('user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true)
    
    try {
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Usuários mockados
      const mockUsers = {
        admin: {
          username: 'admin',
          password: 'admin',
          user: {
            id: '1',
            email: 'admin@baileantecipado.com',
            name: 'Administrador',
            role: 'empresa' as UserRole
          }
        },
        user: {
          username: 'user',
          password: 'user',
          user: {
            id: '2',
            email: 'user@baileantecipado.com',
            name: 'Usuário',
            role: 'usuario' as UserRole
          }
        }
      }

      // Normalizar entrada (aceitar email ou username)
      const input = email.toLowerCase().trim()
      const inputPassword = password.trim()

      // Verificar credenciais
      let authenticatedUser: User | null = null

      // Verificar admin
      if (input === mockUsers.admin.username && inputPassword === mockUsers.admin.password) {
        authenticatedUser = mockUsers.admin.user
      }
      // Verificar user
      else if (input === mockUsers.user.username && inputPassword === mockUsers.user.password) {
        authenticatedUser = mockUsers.user.user
      }

      // Se encontrou usuário, verificar se o role selecionado corresponde
      if (authenticatedUser) {
        // Se o role selecionado não corresponder ao role do usuário mockado, usar o role do usuário
        if (authenticatedUser.role !== role) {
          // Usar o role do usuário mockado, não o selecionado
          authenticatedUser = { ...authenticatedUser, role: authenticatedUser.role }
        }

        setUser(authenticatedUser)
        localStorage.setItem('user', JSON.stringify(authenticatedUser))
        setIsLoading(false)
        return true
      }

      // Credenciais inválidas
      setIsLoading(false)
      return false
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

