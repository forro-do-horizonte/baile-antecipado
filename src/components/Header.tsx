import { Link, useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useUserSettings } from '../contexts/UserSettingsContext'
import { usePrimaryAction } from '../contexts/PrimaryActionContext'
import { useEventModal } from '../contexts/EventModalContext'
import { useConfirmModal } from '../contexts/ConfirmModalContext'
import Button from './Button'

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated, user, logout, login } = useAuth()
  const { settings } = useUserSettings()
  const navigate = useNavigate()
  
  // Hook sempre disponível devido ao provider
  const primaryAction = usePrimaryAction()
  const { isOpen: isEventModalOpen } = useEventModal()
  const { isOpen: isConfirmModalOpen } = useConfirmModal()
  const userMenuRef = useRef<HTMLDivElement>(null)
  const loginModalRef = useRef<HTMLDivElement>(null)
  
  const isAnyModalOpen = isEventModalOpen || isConfirmModalOpen || isLoginModalOpen

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsUserMenuOpen(false)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Detectar role automaticamente baseado nas credenciais
      // admin -> empresa, user -> usuario
      const detectedRole = email.toLowerCase().trim() === 'admin' ? 'empresa' : 'usuario'
      const success = await login(email, password, detectedRole as 'empresa' | 'usuario')
      
      if (success) {
        // Aguardar um pouco para o estado atualizar
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Pegar usuário do localStorage para redirecionamento
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const authenticatedUser = JSON.parse(storedUser)
            // Fechar modal e redirecionar
            setIsLoginModalOpen(false)
            setEmail('')
            setPassword('')
            setError('')
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

  // Fechar menu ao clicar fora e aplicar overlay
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false)
      }
      if (loginModalRef.current && !loginModalRef.current.contains(target)) {
        setIsLoginModalOpen(false)
      }
    }

    const handleOverlayClick = () => {
      setIsUserMenuOpen(false)
      setIsLoginModalOpen(false)
    }

    const isAnyModalOpen = isUserMenuOpen || isLoginModalOpen

    if (isAnyModalOpen) {
      // Adicionar overlay
      const overlay = document.createElement('div')
      overlay.id = 'menu-overlay'
      overlay.className = 'fixed inset-0 z-40'
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
      overlay.style.filter = 'brightness(20%)'
      overlay.style.pointerEvents = 'auto'
      overlay.onclick = handleOverlayClick
      document.body.appendChild(overlay)
      
      // Prevenir scroll
      document.body.style.overflow = 'hidden'
      
      // Prevenir cliques em outros elementos
      document.addEventListener('mousedown', handleClickOutside, true)
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside, true)
        const overlayElement = document.getElementById('menu-overlay')
        if (overlayElement) {
          overlayElement.remove()
        }
        document.body.style.overflow = ''
      }
    }
  }, [isUserMenuOpen, isLoginModalOpen])

  // Limpar campos quando o modal for fechado
  useEffect(() => {
    if (!isLoginModalOpen) {
      setEmail('')
      setPassword('')
      setError('')
    }
  }, [isLoginModalOpen])

  return (
    <header className={`fixed top-0 left-0 right-0 w-full bg-beige z-50 transition-all duration-300 ${isAnyModalOpen ? 'opacity-60 brightness-75' : 'opacity-100 brightness-100'}`}>
      <div className="relative w-full pb-[2px]">
        {/* Linha com degradê/blur que se estende de fora a fora */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brown/80 to-transparent blur-[2px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brown to-transparent"></div>
        </div>
      </div>
      <div className="w-full px-3 py-3 sm:px-4 sm:py-4 relative z-10">
        <div className={`max-w-7xl mx-auto flex items-center ${isAuthenticated ? 'justify-between' : 'justify-between'}`}>
        {/* Lado esquerdo - Logo (não autenticado) ou Botão Cadastrar (autenticado) */}
        {!isAuthenticated ? (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-brown rounded-sm"></div>
            <span className="text-brown text-base sm:text-lg md:text-xl cordel-text hover:text-primary transition-colors duration-300">Baile Antecipado</span>
          </Link>
        ) : (
          <>
            {/* Botão de ação primária - apenas para empresa */}
            {user?.role === 'empresa' && primaryAction.label && (
              <div className="flex items-center gap-2">
                <Button 
                  variant="primary" 
                  onClick={primaryAction.onClick}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
                >
                  {primaryAction.label}
                </Button>
                {primaryAction.secondaryAction && (
                  <Button 
                    variant={primaryAction.secondaryAction.variant}
                    onClick={primaryAction.secondaryAction.onClick}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
                  >
                    {primaryAction.secondaryAction.label}
                  </Button>
                )}
              </div>
            )}
          </>
        )}

        {/* Navigation e Botões - lado direito */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Navigation - apenas quando autenticado */}
          {isAuthenticated ? (
            <>
              {/* Desktop: Link Dashboard */}
              <nav className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-6 flex-shrink-0">
                <Link 
                  to={user?.role === 'empresa' ? '/dashboard/empresa' : '/dashboard/usuario'} 
                  className="text-brown text-xs lg:text-sm xl:text-base cordel-text-small hover:text-primary transition-colors duration-300 whitespace-nowrap"
                >
                  Dashboard
                </Link>
              </nav>

              {/* Mobile: Botão Dashboard */}
              <Link 
                to={user?.role === 'empresa' ? '/dashboard/empresa' : '/dashboard/usuario'}
                className="md:hidden text-brown text-sm cordel-text-small hover:text-primary transition-colors duration-300"
              >
                Dashboard
              </Link>
            </>
          ) : null}

          {/* CTA Button ou Menu do Usuário */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-brown hover:border-primary transition-colors flex-shrink-0"
                aria-label="Menu do usuário"
              >
                {settings.profileImage ? (
                  <img
                    src={settings.profileImage}
                    alt="Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-brown flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </button>
              
              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        // TODO: Navegar para página de perfil quando criada
                      }}
                      className="w-full text-left px-4 py-2 text-brown hover:bg-beige transition-colors text-sm"
                    >
                      Perfil
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        navigate('/dashboard/empresa/configuracoes')
                      }}
                      className="w-full text-left px-4 py-2 text-brown hover:bg-beige transition-colors text-sm"
                    >
                      Configurações
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-brown hover:bg-beige transition-colors text-sm"
                    >
                      Desconectar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="quintary"
              onClick={() => setIsLoginModalOpen(true)}
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm md:text-base rounded-lg w-auto"
            >
              Meus Antecipados
            </Button>
          )}
        </div>
      </div>

      </div>

      {/* Modal de Login */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            ref={loginModalRef}
            className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-6 sm:p-8 w-full max-w-md mx-4 relative z-50"
          >
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brown text-center mb-6">
              Login
            </h1>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
      )}
    </header>
  )
}

export default Header

