import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { UserRole } from '../types/auth'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('empresa')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const success = await login(email, password, role)
      
      if (success) {
        // Aguardar um pouco para o estado atualizar e pegar do localStorage
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Pegar usuário do localStorage para redirecionamento
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const authenticatedUser = JSON.parse(storedUser)
            // Redirecionar baseado no role do usuário autenticado
            if (authenticatedUser.role === 'empresa') {
              navigate('/dashboard/empresa')
            } else {
              navigate('/dashboard/usuario')
            }
          } catch (parseError) {
            setError('Erro ao processar dados do usuário')
          }
        } else {
          setError('Erro ao fazer login')
        }
      } else {
        setError('Usuário ou senha inválidos')
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brown text-center mb-6">
              Login
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Seleção de Role */}
              <div>
                <label className="block text-brown font-semibold mb-2 text-sm sm:text-base">
                  Tipo de Conta
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('empresa')}
                    className={`flex-1 py-2.5 px-4 border-2 font-medium transition-all ${
                      role === 'empresa'
                        ? 'bg-primary text-white border-brown shadow-[3px_3px_0_0_#000]'
                        : 'bg-white text-brown border-brown hover:bg-beige-light shadow-[2px_2px_0_0_#000]'
                    }`}
                  >
                    Empresa
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('usuario')}
                    className={`flex-1 py-2.5 px-4 border-2 font-medium transition-all ${
                      role === 'usuario'
                        ? 'bg-primary text-white border-brown shadow-[3px_3px_0_0_#000]'
                        : 'bg-white text-brown border-brown hover:bg-beige-light shadow-[2px_2px_0_0_#000]'
                    }`}
                  >
                    Usuário
                  </button>
                </div>
              </div>

              {/* Usuário/Email */}
              <div>
                <label htmlFor="email" className="block text-brown font-semibold mb-2 text-sm sm:text-base">
                  Usuário
                </label>
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm sm:text-base shadow-[2px_2px_0_0_#000]"
                  placeholder="admin ou user"
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-brown font-semibold mb-2 text-sm sm:text-base">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm sm:text-base shadow-[2px_2px_0_0_#000]"
                  placeholder="••••••••"
                />
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Botão de Login */}
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="w-full mt-6"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Informação de desenvolvimento */}
            <div className="mt-6 p-3 bg-beige border border-brown/30 rounded-lg">
              <p className="text-xs text-brown/70 text-center mb-2 font-semibold">
                Usuários de teste:
              </p>
              <div className="text-xs text-brown/60 space-y-1">
                <p><strong>Admin:</strong> usuário: <code className="bg-white px-1 rounded">admin</code> | senha: <code className="bg-white px-1 rounded">admin</code></p>
                <p><strong>Usuário:</strong> usuário: <code className="bg-white px-1 rounded">user</code> | senha: <code className="bg-white px-1 rounded">user</code></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Login

