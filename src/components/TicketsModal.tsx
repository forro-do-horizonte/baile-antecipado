import { useEffect, useRef, useState, useMemo } from 'react'
import TextFilter from './TextFilter'

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

interface TicketsModalProps {
  isOpen: boolean
  onClose: () => void
  eventTitle: string
  buyers: TicketBuyer[]
}

const TicketsModal = ({ isOpen, onClose, eventTitle, buyers }: TicketsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [searchText, setSearchText] = useState('')
  const [checkinFilter, setCheckinFilter] = useState<string>('')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Filtrar ingressos
  const filteredBuyers = useMemo(() => {
    return buyers.filter(buyer => {
      // Filtro de texto (nome ou email)
      if (searchText) {
        const searchLower = searchText.toLowerCase()
        const matchesName = buyer.name.toLowerCase().includes(searchLower)
        const matchesEmail = buyer.email.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesEmail) return false
      }
      
      // Filtro de checkin
      if (checkinFilter) {
        if (checkinFilter === 'checked' && !buyer.hasCheckedIn) return false
        if (checkinFilter === 'not-checked' && buyer.hasCheckedIn) return false
      }
      
      return true
    })
  }, [buyers, searchText, checkinFilter])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-serif font-bold text-brown">
            Ingressos Vendidos - {eventTitle}
          </h2>
          <button
            onClick={onClose}
            className="text-brown hover:text-primary text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <TextFilter
            value={searchText}
            onChange={setSearchText}
            placeholder="Pesquisar por nome ou email..."
          />
          <select
            value={checkinFilter}
            onChange={(e) => setCheckinFilter(e.target.value)}
            className="px-4 py-2 pr-8 border border-gray-300 bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%233d2817%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right pr-8 bg-[length:12px_12px] bg-[right_0.75rem_center]"
          >
            <option value="">Todos</option>
            <option value="checked">Com check-in</option>
            <option value="not-checked">Sem check-in</option>
          </select>
        </div>

        {filteredBuyers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-brown">Nenhum ingresso encontrado.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBuyers.map((buyer) => (
              <div
                key={buyer.id}
                className="bg-white border border-gray-300 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div className="flex items-center gap-3">
                    {/* Ícone de checkin */}
                    <div className="flex-shrink-0">
                      {buyer.hasCheckedIn ? (
                        <div className="w-8 h-8 rounded-full bg-green-100 border border-green-300 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-700">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                          </svg>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-brown">{buyer.name}</p>
                      <p className="text-sm text-brown/70">{buyer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-brown/70">Lote: <span className="font-semibold">{buyer.lot}</span></p>
                    <p className="text-xs text-brown/60 mt-1">Compra: {buyer.purchaseDate}</p>
                    <p className="text-xs text-brown/60 mt-1">
                      Check-in: {buyer.checkinDate || '-'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TicketsModal

