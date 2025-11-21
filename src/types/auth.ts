export type UserRole = 'empresa' | 'usuario'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

