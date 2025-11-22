import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import EventCard from '../components/EventCard'

const DashboardUsuario = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [contractedEvents] = useState([
    {
      id: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789',
      title: "Arrasta-pé na Capital",
      description: "Uma noite de pura animação com o melhor do forró tradicional.",
      date: "20 de Julho, 2024",
      location: "Clube do Sertão",
      city: "Uberlândia",
      imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80"
    }
  ])

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brown mb-2">
                  Meus Eventos Contratados
                </h1>
                <p className="text-brown/70 text-sm sm:text-base">
                  Bem-vindo, {user?.name}
                </p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="primary"
                  onClick={() => navigate('/')}
                  className="flex-1 sm:flex-none"
                >
                  Ver Todos os Eventos
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-4">
              <h3 className="text-brown font-semibold text-sm mb-1">Eventos Contratados</h3>
              <p className="text-2xl font-bold text-brown">{contractedEvents.length}</p>
            </div>
            <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-4">
              <h3 className="text-brown font-semibold text-sm mb-1">Próximo Evento</h3>
              <p className="text-lg font-bold text-brown">
                {contractedEvents.length > 0 ? contractedEvents[0].date : 'Nenhum'}
              </p>
            </div>
            <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-4">
              <h3 className="text-brown font-semibold text-sm mb-1">Ingressos</h3>
              <p className="text-2xl font-bold text-brown">0</p>
            </div>
          </div>

          {/* Lista de Eventos Contratados */}
          <div>
            <h2 className="text-xl font-serif font-bold text-brown mb-4">
              Eventos que Você Contratou
            </h2>
            {contractedEvents.length === 0 ? (
              <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-8 text-center">
                <p className="text-brown mb-4">Você ainda não contratou nenhum evento.</p>
                <Button variant="primary" onClick={() => navigate('/')}>
                  Explorar Eventos Disponíveis
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {contractedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    location={event.location}
                    imageUrl={event.imageUrl}
                    eventId={event.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardUsuario

