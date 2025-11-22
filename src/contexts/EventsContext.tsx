import { createContext, useContext, useState, ReactNode } from 'react'
import eventsData from '../data/events.json'

export interface Lot {
  id: string
  name: string
  price: number
  quantity: number
  startDate: string
  endDate: string
  ticketsSold?: number
}

export type EventSectionType = 'SO_O_LUXO' | 'TODOS_EVENTOS'

export interface Event {
  id: string
  title: string
  date: string
  location: string
  status: string
  imageUrl: string
  description?: string
  longDescription?: string
  saleEndDate?: string
  lots?: Lot[]
  ticketsSold?: number
  type?: string
  published?: boolean
  featured?: boolean
  sectionType?: EventSectionType
  openingTime?: string
  city?: string
  producer?: string
}

interface EventsContextType {
  events: Event[]
  updateEvent: (eventId: string, updatedEvent: Partial<Event>) => void
  addEvent: (event: Event) => void
  togglePublishEvent: (eventId: string) => void
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
  const [events, setEvents] = useState<Event[]>(eventsData as Event[])

  const updateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, ...updatedEvent } : event
      )
    )
  }

  const addEvent = (event: Event) => {
    const newEvent = { ...event, id: event.id || generateUUID(), published: false }
    setEvents(prevEvents => [...prevEvents, newEvent])
  }

  const togglePublishEvent = (eventId: string) => {
    setEvents(prevEvents =>
      prevEvents.map(event =>
        event.id === eventId ? { ...event, published: !event.published } : event
      )
    )
  }

  return (
    <EventsContext.Provider value={{ events, updateEvent, addEvent, togglePublishEvent }}>
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

