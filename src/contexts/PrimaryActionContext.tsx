import { createContext, useContext, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useEventModal } from './EventModalContext'
import { useEvents } from './EventsContext'
import { useConfirmModal } from './ConfirmModalContext'

interface PrimaryActionContextType {
  label: string
  onClick: () => void
  secondaryAction?: {
    label: string
    onClick: () => void
    variant: 'secondary' | 'tertiary'
  }
}

const PrimaryActionContext = createContext<PrimaryActionContextType | undefined>(undefined)

interface PrimaryActionProviderProps {
  children: ReactNode
}

export const PrimaryActionProvider = ({ children }: PrimaryActionProviderProps) => {
  const location = useLocation()
  const { openModal } = useEventModal()
  const { events, togglePublishEvent } = useEvents()
  const { openModal: openConfirmModal } = useConfirmModal()

  const getAction = (): PrimaryActionContextType => {
    // Dashboard
    if (location.pathname === '/dashboard/empresa') {
      return {
        label: '+ Cadastrar Novo Evento',
        onClick: () => openModal(null) // null = novo evento
      }
    }

    // Página de evento específico
    const eventMatch = location.pathname.match(/^\/dashboard\/empresa\/evento\/([^/]+)$/)
    if (eventMatch && eventMatch[1] !== 'novo') {
      const eventId = eventMatch[1]
      const event = events.find(e => e.id === eventId)
      const isPublished = event?.published ?? false

      return {
        label: 'Editar Evento',
        onClick: () => openModal(eventId),
        secondaryAction: {
          label: isPublished ? 'Despublicar Evento' : 'Publicar Evento',
          onClick: () => {
            openConfirmModal({
              title: isPublished ? 'Despublicar Evento' : 'Publicar Evento',
              message: isPublished
                ? 'Tem certeza que deseja despublicar este evento? Ele não será mais exibido para os clientes.'
                : 'Publicar este evento? Ele será exibido na página principal do Baile Antecipado para os clientes começarem a comprar.',
              confirmLabel: isPublished ? 'Despublicar' : 'Publicar',
              cancelLabel: 'Cancelar',
              confirmVariant: isPublished ? 'tertiary' : 'primary',
              cancelVariant: isPublished ? 'primary' : 'sextiary',
              onConfirm: () => togglePublishEvent(eventId)
            })
          },
          variant: isPublished ? 'tertiary' : 'secondary'
        }
      }
    }

    // Default (páginas sem ação específica)
    return {
      label: '',
      onClick: () => {}
    }
  }

  return (
    <PrimaryActionContext.Provider value={getAction()}>
      {children}
    </PrimaryActionContext.Provider>
  )
}

export const usePrimaryAction = () => {
  const context = useContext(PrimaryActionContext)
  if (context === undefined) {
    throw new Error('usePrimaryAction deve ser usado dentro de um PrimaryActionProvider')
  }
  return context
}

