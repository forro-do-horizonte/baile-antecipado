import { createContext, useContext, useState, ReactNode } from 'react'

export interface Lot {
  id: string
  name: string
  price: number
  quantity: number
  startDate: string
  endDate: string
  ticketsSold?: number
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  status: string
  imageUrl: string
  description?: string
  saleEndDate?: string
  lots?: Lot[]
  ticketsSold?: number
}

interface EventsContextType {
  events: Event[]
  updateEvent: (eventId: string, updatedEvent: Partial<Event>) => void
  addEvent: (event: Event) => void
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

interface EventsProviderProps {
  children: ReactNode
}

// Função para gerar UUID
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const EventsProvider = ({ children }: EventsProviderProps) => {
  const [events, setEvents] = useState<Event[]>([
    {
      id: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789',
      title: 'Arrasta-pé na Capital',
      date: '20 de Julho, 2024',
      location: 'Clube do Sertão',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      description: 'Uma noite de pura animação com o melhor do forró tradicional.',
      saleEndDate: '19 de Julho, 2024',
      lots: [
        {
          id: 'lote-1',
          name: 'Lote 1 - Promocional',
          price: 50.00,
          quantity: 100,
          startDate: '01 de Julho, 2024',
          endDate: '10 de Julho, 2024',
          ticketsSold: 75
        },
        {
          id: 'lote-2',
          name: 'Lote 2 - Regular',
          price: 80.00,
          quantity: 200,
          startDate: '11 de Julho, 2024',
          endDate: '18 de Julho, 2024',
          ticketsSold: 120
        },
        {
          id: 'lote-3',
          name: 'Lote 3 - VIP',
          price: 150.00,
          quantity: 50,
          startDate: '19 de Julho, 2024',
          endDate: '20 de Julho, 2024',
          ticketsSold: 30
        }
      ],
      ticketsSold: 225
    }
  ])

  const updateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, ...updatedEvent } : event
      )
    )
  }

  const addEvent = (event: Event) => {
    const newEvent = { ...event, id: event.id || generateUUID() }
    setEvents(prevEvents => [...prevEvents, newEvent])
  }

  return (
    <EventsContext.Provider value={{ events, updateEvent, addEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

// Exportar função para gerar UUID
export { generateUUID }

export const useEvents = () => {
  const context = useContext(EventsContext)
  if (context === undefined) {
    throw new Error('useEvents deve ser usado dentro de um EventsProvider')
  }
  return context
}

