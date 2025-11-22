import { createContext, useContext, useState, ReactNode } from 'react'

interface EventModalContextType {
  isOpen: boolean
  eventId: string | null
  openModal: (eventId: string | null) => void // null = novo evento
  closeModal: () => void
}

const EventModalContext = createContext<EventModalContextType | undefined>(undefined)

interface EventModalProviderProps {
  children: ReactNode
}

export const EventModalProvider = ({ children }: EventModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [eventId, setEventId] = useState<string | null>(null)

  const openModal = (id: string | null) => {
    setEventId(id)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setIsOpen(false)
    setEventId(null)
    document.body.style.overflow = ''
  }

  return (
    <EventModalContext.Provider value={{ isOpen, eventId, openModal, closeModal }}>
      {children}
    </EventModalContext.Provider>
  )
}

export const useEventModal = () => {
  const context = useContext(EventModalContext)
  if (context === undefined) {
    throw new Error('useEventModal deve ser usado dentro de um EventModalProvider')
  }
  return context
}

