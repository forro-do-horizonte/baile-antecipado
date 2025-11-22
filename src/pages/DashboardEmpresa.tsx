import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../contexts/EventsContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import StatCard from '../components/StatCard'
import TicketsModal from '../components/TicketsModal'
import DateRangeInput from '../components/DateRangeInput'
import QuickDateFilter from '../components/QuickDateFilter'
import EventTypeFilter from '../components/EventTypeFilter'

interface TicketBuyer {
  id: string
  name: string
  email: string
  quantity: number
  lot: string
  purchaseDate: string
  hasCheckedIn?: boolean
  checkinDate?: string
}

const DashboardEmpresa = () => {
  const navigate = useNavigate()
  const { events } = useEvents()
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')
  const [quickDateFilter, setQuickDateFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  
  // Obter tipos únicos dos eventos
  const availableTypes = useMemo(() => {
    const types = new Set(events.map(event => event.type).filter(Boolean) as string[])
    return Array.from(types).sort()
  }, [events])

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Apenas eventos publicados
      if (!event.published) return false
      
      // Filtro de status
      if (statusFilter) {
        if (statusFilter === 'ativo' && event.status !== 'ativo') return false
        if (statusFilter === 'cancelado' && event.status !== 'cancelado') return false
        if (statusFilter === 'finalizados' && event.status !== 'inativo') return false
      }
      
      // Filtro de tipo
      if (typeFilter && event.type !== typeFilter) {
        return false
      }
      
      // Filtro de data (se houver)
      if (dateFrom || dateTo) {
        // Converter data do evento para comparar
        const months: { [key: string]: string } = {
          'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
          'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
          'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
        }
        
        const eventDateParts = event.date.split(' de ')
        if (eventDateParts.length === 3) {
          const eventDay = eventDateParts[0].padStart(2, '0')
          const eventMonth = months[eventDateParts[1].toLowerCase()] || '01'
          const eventYear = eventDateParts[2]
          const eventDateStr = `${eventYear}-${eventMonth}-${eventDay}`
          
          if (dateFrom && eventDateStr < dateFrom) return false
          if (dateTo && eventDateStr > dateTo) return false
        }
      }
      
      return true
    })
  }, [events, statusFilter, dateFrom, dateTo, typeFilter])

  // Calcular estatísticas totais (apenas dos eventos filtrados)
  const totalTicketsSold = filteredEvents.reduce((sum, event) => sum + (event.ticketsSold || 0), 0)
  const totalRevenue = filteredEvents.reduce((sum, event) => {
    const eventRevenue = (event.lots || []).reduce((lotSum, lot) => {
      return lotSum + ((lot.ticketsSold || 0) * lot.price)
    }, 0)
    return sum + eventRevenue
  }, 0)
  const eventsCompleted = filteredEvents.filter(event => event.status === 'inativo').length

  const handleClearFilters = () => {
    setStatusFilter('')
    setDateFrom('')
    setDateTo('')
    setQuickDateFilter('')
    setTypeFilter('')
  }
  
  const handleQuickDateChange = (from: string, to: string) => {
    setDateFrom(from)
    setDateTo(to)
  }
  
  const handleQuickDateSelect = (value: string) => {
    setQuickDateFilter(value)
    if (!value) {
      setDateFrom('')
      setDateTo('')
    }
  }
  
  const handleManualDateChange = (from: string, to: string) => {
    setDateFrom(from)
    setDateTo(to)
    // Limpar filtro rápido quando alterar manualmente
    if (from || to) {
      setQuickDateFilter('')
    }
  }

  // Gerar dados de compradores (mock - em produção viria da API)
  // Cada ingresso é uma linha separada
  const generateBuyers = (eventId: string): TicketBuyer[] => {
    const event = events.find(e => e.id === eventId)
    if (!event) return []

    const buyers: TicketBuyer[] = []
    const firstNames = ['João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Juliana', 'Fernando', 'Patricia', 'Ricardo', 'Camila', 'Roberto', 'Mariana', 'Lucas', 'Beatriz', 'Felipe', 'Gabriela', 'Rafael', 'Isabela', 'Bruno', 'Larissa']
    const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Pereira', 'Costa', 'Rodrigues', 'Almeida', 'Nascimento', 'Lima', 'Araújo', 'Fernandes', 'Carvalho', 'Gomes', 'Martins', 'Ribeiro', 'Alves', 'Monteiro', 'Mendes', 'Barros']
    
    let buyerId = 1
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

    event.lots?.forEach((lot) => {
      const ticketsSold = lot.ticketsSold || 0
      // Criar um ingresso por vez (não agrupar)
      for (let i = 0; i < ticketsSold; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const name = `${firstName} ${lastName}`
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`
        
        // Gerar data de compra aleatória baseada no lote
        const lotParts = lot.startDate.split(' de ')
        const lotDay = parseInt(lotParts[0])
        const lotMonth = months.indexOf(lotParts[1])
        const lotYear = parseInt(lotParts[2])
        
        // Data aleatória entre início do lote e fim do lote (ou hoje se ainda estiver ativo)
        const lotStart = new Date(lotYear, lotMonth, lotDay)
        const lotEndParts = lot.endDate.split(' de ')
        const lotEndDay = parseInt(lotEndParts[0])
        const lotEndMonth = months.indexOf(lotEndParts[1])
        const lotEndYear = parseInt(lotEndParts[2])
        const lotEnd = new Date(lotEndYear, lotEndMonth, lotEndDay)
        const maxDate = lotEnd > new Date() ? new Date() : lotEnd
        const purchaseDate = new Date(lotStart.getTime() + Math.random() * (maxDate.getTime() - lotStart.getTime()))
        
        // Simular checkin (30% de chance de ter feito checkin)
        const hasCheckedIn = Math.random() < 0.3
        let checkinDate: string | undefined = undefined
        
        if (hasCheckedIn) {
          // Se fez checkin, gerar data de checkin entre a data de compra e a data do evento
          const eventDateParts = event.date.split(' de ')
          if (eventDateParts.length === 3) {
            const eventDay = parseInt(eventDateParts[0])
            const eventMonth = months.indexOf(eventDateParts[1])
            const eventYear = parseInt(eventDateParts[2])
            const eventDate = new Date(eventYear, eventMonth, eventDay)
            
            // Data de checkin entre compra e evento (ou até hoje se evento já passou)
            const maxCheckinDate = eventDate > new Date() ? new Date() : eventDate
            const checkinDateObj = new Date(
              purchaseDate.getTime() + 
              Math.random() * (maxCheckinDate.getTime() - purchaseDate.getTime())
            )
            checkinDate = checkinDateObj.toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          }
        }
        
        buyers.push({
          id: `buyer-${buyerId++}`,
          name: name,
          email: email,
          quantity: 1, // Sempre 1, pois cada linha é um ingresso
          lot: lot.name,
          purchaseDate: purchaseDate.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }),
          hasCheckedIn: hasCheckedIn,
          checkinDate: checkinDate
        })
      }
    })

    // Ordenar: quem não fez checkin primeiro, depois por data (mais recente primeiro)
    return buyers.sort((a, b) => {
      // Primeiro: quem não fez checkin vem primeiro
      if (a.hasCheckedIn !== b.hasCheckedIn) {
        return a.hasCheckedIn ? 1 : -1
      }
      // Depois: ordenar por data (mais recente primeiro)
      const dateA = new Date(a.purchaseDate.split('/').reverse().join('-'))
      const dateB = new Date(b.purchaseDate.split('/').reverse().join('-'))
      return dateB.getTime() - dateA.getTime()
    })
  }

  const handleShowTickets = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEventId(eventId)
    setIsModalOpen(true)
  }

  const selectedEvent = events.find(e => e.id === selectedEventId)
  const buyers = selectedEventId ? generateBuyers(selectedEventId) : []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              type="lots"
              title="Eventos"
              value={filteredEvents.length}
            />
            <StatCard
              type="default"
              title="Eventos realizados"
              value={eventsCompleted}
            />
            <StatCard
              type="tickets"
              title="Ingressos Vendidos"
              value={totalTicketsSold}
            />
            <StatCard
              type="money"
              title="Total Arrecadado"
              value={`R$ ${totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            />
          </div>

          {/* Filtros */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4">
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 pr-8 border border-gray-300 bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%233d2817%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right pr-8 bg-[length:12px_12px] bg-[right_0.75rem_center]"
              >
                <option value="">Todos os eventos</option>
                <option value="ativo">Eventos ativos</option>
                <option value="cancelado">Eventos cancelados</option>
                <option value="finalizados">Eventos finalizados</option>
              </select>

              <QuickDateFilter
                value={quickDateFilter}
                onChange={handleQuickDateSelect}
                onDateRangeChange={handleQuickDateChange}
              />

              <DateRangeInput
                dateFrom={dateFrom}
                dateTo={dateTo}
                onDateFromChange={(value) => handleManualDateChange(value, dateTo)}
                onDateToChange={(value) => handleManualDateChange(dateFrom, value)}
              />

              <EventTypeFilter
                value={typeFilter}
                onChange={setTypeFilter}
                availableTypes={availableTypes}
              />

              {(statusFilter || dateFrom || dateTo || typeFilter || quickDateFilter) && (
                <Button
                  variant="sextiary"
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm"
                >
                  × Limpar Filtros
                </Button>
              )}
            </div>
          </div>

          {/* Lista de Eventos */}
          <div>
            <h2 className="text-xl font-serif font-bold text-brown mb-4">
              Meus Eventos
            </h2>
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <div className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-8 text-center">
                  <p className="text-brown mb-4">Nenhum evento cadastrado ainda.</p>
                  <Button variant="primary" className="px-4 py-2.5 text-sm">
                    Cadastrar Primeiro Evento
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredEvents.map((event) => {
                    // Calcular estatísticas do evento
                    const eventTicketsSold = event.ticketsSold || 0
                    const eventRevenue = (event.lots || []).reduce((sum, lot) => {
                      return sum + ((lot.ticketsSold || 0) * lot.price)
                    }, 0)

                    const borderColor = event.published ? 'border-green-500' : 'border-gray-300'
                    const shadowColor = event.published ? 'shadow-[4px_4px_0_0_rgb(34,197,94)]' : 'shadow-[4px_4px_0_0_rgb(209,213,219)]'
                    const hoverShadowColor = event.published ? 'hover:shadow-[3px_3px_0_0_rgb(34,197,94)]' : 'hover:shadow-[3px_3px_0_0_rgb(209,213,219)]'
                    
                    return (
                      <div
                        key={event.id}
                        className={`bg-beige-light border-2 ${borderColor} ${shadowColor} ${hoverShadowColor} hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex flex-col h-full`}
                      >
                        {/* Imagem no topo */}
                        {event.imageUrl && (
                          <div 
                            onClick={() => navigate(`/dashboard/empresa/evento/${event.id}`)}
                            className="w-full h-40 border-b-2 border-brown overflow-hidden bg-gray-800 cursor-pointer"
                          >
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
                          <h3 
                            onClick={() => navigate(`/dashboard/empresa/evento/${event.id}`)}
                            className="text-base font-serif font-bold text-brown mb-2 text-center cursor-pointer hover:text-primary transition-colors truncate whitespace-nowrap overflow-hidden"
                            title={event.title}
                          >
                            {event.title}
                          </h3>
                          {event.description && (
                            <p className="text-sm text-brown/70 mb-3 text-center truncate whitespace-nowrap overflow-hidden" title={event.description}>
                              {event.description}
                            </p>
                          )}
                          <div className="space-y-1 text-sm text-brown/70 mb-3">
                            <p className="text-center"><span className="font-semibold">Data:</span> {event.date}</p>
                            <p className="text-center"><span className="font-semibold">Local:</span> {event.location}</p>
                          </div>

                          {/* Resumos do evento */}
                          <div className="space-y-2 mb-3 flex-grow">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-black/60">Ingressos vendidos:</span>
                              <span className="text-brown font-bold text-sm">{eventTicketsSold}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-black/60">Valor arrecadado:</span>
                              <span className="text-brown font-bold text-sm">
                                R$ {eventRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>

                          {/* Botão */}
                          <Button
                            variant="secondary"
                            onClick={(e) => handleShowTickets(event.id, e)}
                            className="px-3 py-2 text-xs w-full"
                          >
                            Mostrar ingressos vendidos
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de Ingressos Vendidos */}
      <TicketsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedEventId(null)
        }}
        eventTitle={selectedEvent?.title || ''}
        buyers={buyers}
      />
    </div>
  )
}

export default DashboardEmpresa

