import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEvents } from '../contexts/EventsContext'
import { useEventModal } from '../contexts/EventModalContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'
import StatCard from '../components/StatCard'

const EventDashboard = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { events } = useEvents()
  const { openModal } = useEventModal()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [eventId])
  
  const event = events.find(e => e.id === eventId)

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow px-4 py-8 pt-24">
          <div className="max-w-7xl mx-auto">
            <p className="text-brown">Evento não encontrado.</p>
          </div>
        </main>
      </div>
    )
  }

  // Calcular estatísticas dos lotes
  const lotsWithStats = (event.lots || []).map(lot => {
    const ticketsSold = lot.ticketsSold || 0
    const revenue = ticketsSold * lot.price
    return {
      ...lot,
      ticketsSold,
      revenue
    }
  })

  // Calcular total arrecadado líquido (sem taxa de serviço)
  const totalRevenue = lotsWithStats.reduce((sum, lot) => sum + lot.revenue, 0)
  const totalTicketsSold = lotsWithStats.reduce((sum, lot) => sum + lot.ticketsSold, 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Cabeçalho */}
          <PageHeader
            title={event.title}
            subtitle={
              <p className="text-brown/70 text-sm sm:text-base">
                {event.date} • {event.location}
              </p>
            }
          />

          {/* Estatísticas Gerais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
              type="money"
              title="Total Arrecadado"
              value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              subtitle="Líquido (sem taxa de serviço)"
            />
            <StatCard
              type="tickets"
              title="Ingressos Vendidos"
              value={totalTicketsSold}
              subtitle="Total de ingressos"
            />
            <StatCard
              type="lots"
              title="Lotes Ativos"
              value={event.lots?.length || 0}
              subtitle="Lotes cadastrados"
            />
          </div>

          {/* Estatísticas por Lote */}
          <div className="mb-8">
            <h2 className="text-xl font-serif font-bold text-brown mb-4">
              Vendas por Lote
            </h2>
            {lotsWithStats.length === 0 ? (
              <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-8 text-center">
                <p className="text-brown">Nenhum lote cadastrado para este evento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lotsWithStats.map((lot) => {
                  const percentageSold = lot.quantity > 0 
                    ? ((lot.ticketsSold / lot.quantity) * 100).toFixed(1) 
                    : '0'
                  
                  return (
                    <div
                      key={lot.id}
                      className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-brown text-lg">{lot.name}</h3>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-brown/70">Preço unitário:</span>
                          <span className="font-semibold text-brown">
                            R$ {lot.price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-brown/70">Quantidade total:</span>
                          <span className="font-semibold text-brown">{lot.quantity}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-brown/70">Vendidos:</span>
                          <span className="font-semibold text-brown">{lot.ticketsSold}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-brown/70">Disponíveis:</span>
                          <span className="font-semibold text-brown">
                            {lot.quantity - lot.ticketsSold}
                          </span>
                        </div>
                        
                        <div className="pt-2 border-t border-brown/20">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-brown/70 text-xs">Progresso:</span>
                            <span className="font-semibold text-brown text-xs">
                              {percentageSold}%
                            </span>
                          </div>
                          <div className="w-full bg-brown/20 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all"
                              style={{ width: `${percentageSold}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="pt-2 border-t border-brown/20">
                          <div className="flex justify-between">
                            <span className="text-brown/70 font-semibold">Arrecadado:</span>
                            <span className="font-bold text-brown text-lg">
                              R$ {lot.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          <p className="text-xs text-brown/60 mt-1">Líquido (sem taxa)</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EventDashboard

