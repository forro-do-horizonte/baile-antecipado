import { useNavigate } from 'react-router-dom'
import { useEvents } from '../contexts/EventsContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'

const DashboardEmpresa = () => {
  const navigate = useNavigate()
  const { events } = useEvents()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-4">
              <h3 className="text-brown font-semibold text-sm mb-1">Eventos Ativos</h3>
              <p className="text-2xl font-bold text-brown">{events.length}</p>
            </div>
            <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-4">
              <h3 className="text-brown font-semibold text-sm mb-1">Eventos realizados</h3>
              <p className="text-2xl font-bold text-brown">0</p>
            </div>
            <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-4">
              <h3 className="text-brown font-semibold text-sm mb-1">Ingressos Vendidos</h3>
              <p className="text-2xl font-bold text-brown">0</p>
            </div>
          </div>

          {/* Ações Rápidas */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" className="px-4 py-2.5 text-sm">
                + Cadastrar Novo Evento
              </Button>
              <Button variant="tertiary" className="px-4 py-2.5 text-sm">
                Ver Relatórios
              </Button>
            </div>
          </div>

          {/* Lista de Eventos */}
          <div>
            <h2 className="text-xl font-serif font-bold text-brown mb-4">
              Meus Eventos
            </h2>
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-8 text-center">
                  <p className="text-brown mb-4">Nenhum evento cadastrado ainda.</p>
                  <Button variant="primary" className="px-4 py-2.5 text-sm">
                    Cadastrar Primeiro Evento
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => navigate(`/dashboard/empresa/evento/${event.id}`)}
                      className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] cursor-pointer hover:shadow-[3px_3px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex flex-col"
                    >
                      {/* Imagem no topo */}
                      {event.imageUrl && (
                        <div className="w-full h-48 border-b-2 border-brown overflow-hidden bg-gray-800">
                          <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-full object-cover"
                            style={{ filter: 'grayscale(100%)' }}
                          />
                        </div>
                      )}
                      
                      {/* Conteúdo */}
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-serif font-bold text-brown mb-2 text-center">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-sm text-brown/70 mb-3 text-center line-clamp-2">
                            {event.description}
                          </p>
                        )}
                        <div className="space-y-1 text-sm text-brown/70 mb-3">
                          <p className="text-center"><span className="font-semibold">Data:</span> {event.date}</p>
                          <p className="text-center"><span className="font-semibold">Local:</span> {event.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default DashboardEmpresa

