import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import { useEvents } from '../contexts/EventsContext'

interface TicketType {
  id: string
  name: string
  price: number
  salesEndDate: string
  includesTicket?: boolean
  description?: string
}

const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const { events } = useEvents()
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>({})
  const [couponCode, setCouponCode] = useState('')
  const [showCouponInput, setShowCouponInput] = useState(false)
  const [showTaxModal, setShowTaxModal] = useState(false)

  // Buscar evento do contexto
  const eventData = events.find(e => e.id === eventId)
  
  // Converter lots para ticketTypes para compatibilidade com a interface existente
  const event = eventData ? {
    id: eventData.id,
    title: eventData.title,
    description: eventData.longDescription || eventData.description || '',
    date: eventData.date,
    time: eventData.openingTime || '20:00',
    location: eventData.location,
    city: eventData.city || '',
    imageUrl: eventData.imageUrl,
    ticketTypes: (eventData.lots || []).map((lot, index) => ({
      id: lot.id,
      name: lot.name,
      price: lot.price,
      salesEndDate: lot.endDate,
      includesTicket: true
    })) as TicketType[]
  } : null

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-brown text-xl">Evento não encontrado</p>
        </main>
        <Footer />
      </div>
    )
  }

  // Calcular parcelamento (12x sem juros)
  const calculateInstallment = (price: number) => {
    return (price / 12).toFixed(2)
  }

  // Ajustar quantidade de um tipo de ingresso
  const adjustQuantity = (ticketId: string, delta: number) => {
    setTicketQuantities(prev => {
      const current = prev[ticketId] || 0
      const newQuantity = Math.max(0, current + delta)
      if (newQuantity === 0) {
        const { [ticketId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [ticketId]: newQuantity }
    })
  }

  // Calcular subtotal (sem taxa)
  const calculateSubtotal = () => {
    return Object.entries(ticketQuantities).reduce((total, [ticketId, quantity]) => {
      const ticket = event.ticketTypes.find(t => t.id === ticketId)
      return total + (ticket ? ticket.price * quantity : 0)
    }, 0)
  }

  // Calcular taxa (10% do valor dos ingressos)
  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    return subtotal * 0.10
  }

  // Calcular total (subtotal + taxa)
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const subtotal = calculateSubtotal()
  const tax = calculateTax()
  const total = calculateTotal()
  const hasSelectedTickets = Object.keys(ticketQuantities).length > 0 && Object.values(ticketQuantities).some(qty => qty > 0)

  const handlePurchase = () => {
    if (!hasSelectedTickets) {
      alert('Selecione pelo menos um ingresso')
      return
    }
    // Lógica de compra aqui
    console.log('Comprando ingressos:', ticketQuantities)
    console.log('Total:', total)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-3 pb-6 sm:px-4 sm:pb-8 md:px-8 md:pb-12">
            {/* Layout de duas colunas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Coluna Esquerda - Detalhes do Evento */}
              <div className="lg:col-span-2 space-y-6">
                {/* Imagem do Evento */}
                <div className="w-full border-2 border-brown">
                  <div 
                    className="w-full h-64 sm:h-80 md:h-96 bg-cover bg-center bg-gray-800"
                    style={{
                      backgroundImage: `url(${event.imageUrl})`
                    }}
                  ></div>
                </div>

                {/* Título do Evento */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-brown cordel-text">
                  {event.title}
                </h1>

                {/* Descrição */}
                <p className="text-brown text-base sm:text-lg leading-relaxed font-serif">
                  {event.description}
                </p>

                {/* Data e Horário */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 text-brown" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                      />
                    </svg>
                    <span className="font-serif font-bold text-brown text-base sm:text-lg">Data e Horário</span>
                  </div>
                  <p className="text-brown text-sm sm:text-base font-serif ml-7">
                    {event.date}, às {event.time}
                  </p>
                </div>

                {/* Local */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 text-brown" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                      />
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                      />
                    </svg>
                    <span className="font-serif font-bold text-brown text-base sm:text-lg">Local</span>
                  </div>
                  <p className="text-brown text-sm sm:text-base font-serif ml-7">
                    {event.location}
                  </p>
                </div>
              </div>

              {/* Coluna Direita - Widget de Compra */}
              <div className="lg:col-span-1">
                <div className="border-2 border-brown rounded-lg overflow-hidden sticky top-4">
                  {/* Header */}
                  <div className="bg-brown px-4 py-3 sm:px-6 sm:py-4">
                    <h2 className="text-white text-lg sm:text-xl font-serif font-bold cordel-text">
                      Ingressos
                    </h2>
                  </div>

                  {/* Body */}
                  <div className="bg-white">
                    {/* Lista de Tipos de Ingresso */}
                    <div className="divide-y divide-brown/20">
                      {event.ticketTypes.map((ticket) => {
                        const quantity = ticketQuantities[ticket.id] || 0
                        const installmentPrice = calculateInstallment(ticket.price)
                        
                        return (
                          <div key={ticket.id} className="p-4 sm:p-5">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-serif font-bold text-brown text-base sm:text-lg">
                                    {ticket.name}
                                  </h3>
                                  {ticket.description && (
                                    <div className="group relative">
                                      <svg 
                                        className="w-4 h-4 text-primary cursor-help" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                      >
                                        <path 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round" 
                                          strokeWidth={2} 
                                          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                                        />
                                      </svg>
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-brown text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                                        {ticket.description}
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <p className="text-brown font-serif font-semibold text-lg sm:text-xl mb-1">
                                  R$ {ticket.price.toFixed(2).replace('.', ',')}
                                </p>
                                <p className="text-primary text-sm sm:text-base font-serif mb-1">
                                  em até 12x R$ {installmentPrice.replace('.', ',')}
                                </p>
                                <p className="text-brown/60 text-xs sm:text-sm font-serif">
                                  Vendas até {ticket.salesEndDate}
                                </p>
                              </div>
                              
                              {/* Seletor de Quantidade */}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                  onClick={() => adjustQuantity(ticket.id, -1)}
                                  disabled={quantity === 0}
                                  className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brown bg-beige-light hover:bg-beige text-brown disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors font-serif font-bold"
                                >
                                  -
                                </button>
                                <span className="w-8 sm:w-10 text-center font-serif font-semibold text-brown text-sm sm:text-base">
                                  {quantity}
                                </span>
                                <button
                                  onClick={() => adjustQuantity(ticket.id, 1)}
                                  className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-brown bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors font-serif font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Seção de Cupom */}
                    <div className="px-4 sm:px-5 py-4 border-t border-brown/20">
                      {!showCouponInput ? (
                        <button
                          onClick={() => setShowCouponInput(true)}
                          className="flex items-center gap-2 text-primary hover:text-primary-dark transition-colors font-serif text-sm sm:text-base"
                        >
                          <svg 
                            className="w-5 h-5" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
                            />
                          </svg>
                          <span>Inserir cupom de desconto</span>
                        </button>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Código do cupom"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-1 px-3 py-2 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                          />
                          <Button
                            variant="primary"
                            onClick={() => {
                              // Lógica de aplicação do cupom aqui
                              console.log('Aplicando cupom:', couponCode)
                              setShowCouponInput(false)
                            }}
                            className="px-4 py-2 text-sm whitespace-nowrap"
                          >
                            Aplicar
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Valor Total */}
                    {hasSelectedTickets && (
                      <div className="px-4 sm:px-5 py-4 border-t border-brown/20">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-brown font-serif text-sm sm:text-base">Subtotal:</span>
                            <span className="text-brown font-serif font-semibold text-sm sm:text-base">
                              R$ {subtotal.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-brown font-serif text-sm sm:text-base">Taxa de serviço:</span>
                            <span className="text-brown font-serif font-semibold text-sm sm:text-base">
                              R$ {tax.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <div className="border-t-2 border-brown pt-2 mt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-brown font-serif font-bold text-base sm:text-lg">Total:</span>
                              <span className="text-primary font-serif font-bold text-xl sm:text-2xl">
                                R$ {total.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botão de Ação */}
                    <div className="px-4 sm:px-5 pb-4">
                      <button
                        onClick={handlePurchase}
                        disabled={!hasSelectedTickets}
                        className={`w-full py-3 sm:py-4 text-base sm:text-lg font-medium transition-all bg-primary hover:bg-primary-dark text-white shadow-[4px_4px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px] ${!hasSelectedTickets ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ 
                          border: '2px solid #3D2817',
                          boxSizing: 'border-box'
                        }}
                      >
                        {hasSelectedTickets ? 'Continuar Compra' : 'Selecione um Ingresso'}
                      </button>
                    </div>

                    {/* Link para Taxas */}
                    <div className="px-4 sm:px-5 pb-4 text-center border-t border-brown/20 pt-4">
                      <button 
                        onClick={() => setShowTaxModal(true)}
                        className="flex items-center justify-center gap-2 text-primary hover:text-primary-dark transition-colors font-serif text-xs sm:text-sm"
                      >
                        <svg 
                          className="w-4 h-4" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <span className="underline">Entenda nossa taxa</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modal de Taxas */}
      {showTaxModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowTaxModal(false)}
        >
          <div 
            className="bg-beige-light border-2 border-brown rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-4 sm:p-6 border-b-2 border-brown">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brown text-center cordel-text">
                Entenda Nossa Taxa
              </h2>
            </div>

            {/* Conteúdo do Modal */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="space-y-4 text-brown font-serif text-sm sm:text-base leading-relaxed">
                <p>
                  A taxa de serviço é aplicada sobre o valor total dos ingressos selecionados.
                </p>
                <p>
                  Esta taxa cobre os custos operacionais da plataforma, incluindo:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Processamento de pagamento seguro</li>
                  <li>Manutenção da plataforma de vendas</li>
                  <li>Suporte ao cliente</li>
                  <li>Infraestrutura tecnológica</li>
                </ul>
                <p>
                  A taxa é calculada automaticamente e incluída no valor total antes da finalização da compra.
                </p>
                <div className="bg-white border-2 border-brown p-4 rounded-lg mt-4">
                  <p className="font-semibold mb-2">Exemplo:</p>
                  <p className="text-sm">
                    Ingresso: R$ 100,00<br />
                    Taxa de serviço: R$ 10,00<br />
                    <strong>Total: R$ 110,00</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="p-4 sm:p-6 border-t-2 border-brown">
              <Button
                variant="primary"
                onClick={() => setShowTaxModal(false)}
                className="w-full"
              >
                Entendi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetail
