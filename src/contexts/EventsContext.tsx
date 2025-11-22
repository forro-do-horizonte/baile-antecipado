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
  type?: string
  published?: boolean
  featured?: boolean
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
  const [events, setEvents] = useState<Event[]>([
    // EVENTOS ATIVOS
    {
      id: 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789',
      title: 'Arrasta-pé na Capital',
      date: '20 de Janeiro, 2025',
      location: 'Clube do Sertão',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      description: 'Uma noite de pura animação com o melhor do forró tradicional.',
      saleEndDate: '19 de Janeiro, 2025',
      lots: [
        {
          id: 'lote-1',
          name: 'Lote 1 - Promocional',
          price: 50.00,
          quantity: 100,
          startDate: '01 de Janeiro, 2025',
          endDate: '10 de Janeiro, 2025',
          ticketsSold: 75
        },
        {
          id: 'lote-2',
          name: 'Lote 2 - Regular',
          price: 80.00,
          quantity: 200,
          startDate: '11 de Janeiro, 2025',
          endDate: '18 de Janeiro, 2025',
          ticketsSold: 120
        },
        {
          id: 'lote-3',
          name: 'Lote 3 - VIP',
          price: 150.00,
          quantity: 50,
          startDate: '19 de Janeiro, 2025',
          endDate: '20 de Janeiro, 2025',
          ticketsSold: 30
        }
      ],
      ticketsSold: 225,
      type: 'Forró',
      published: true,
      featured: true,
      openingTime: '20:00',
      city: 'Uberlândia',
      producer: 'Produtor Genérico'
    },
    {
      id: 'b2c3d4e5-f6a7-4890-b123-c4d5e6f7a890',
      title: 'Forró Pé de Serra',
      date: '15 de Fevereiro, 2025',
      location: 'Centro de Convenções',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      description: 'O melhor do forró pé de serra com grandes nomes da música nordestina.',
      saleEndDate: '14 de Fevereiro, 2025',
      lots: [
        {
          id: 'lote-1-feb',
          name: 'Lote Promocional',
          price: 60.00,
          quantity: 150,
          startDate: '01 de Fevereiro, 2025',
          endDate: '07 de Fevereiro, 2025',
          ticketsSold: 98
        },
        {
          id: 'lote-2-feb',
          name: 'Lote Regular',
          price: 90.00,
          quantity: 250,
          startDate: '08 de Fevereiro, 2025',
          endDate: '14 de Fevereiro, 2025',
          ticketsSold: 187
        }
      ],
      ticketsSold: 285,
      type: 'Forró',
      published: true,
      featured: true,
      openingTime: '21:00',
      city: 'São Paulo',
      producer: 'Produtor Genérico'
    },
    {
      id: 'c3d4e5f6-a7b8-4901-c234-d5e6f7a8b901',
      title: 'São João Antecipado',
      date: '20 de Junho, 2025',
      location: 'Parque de Exposições',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      description: 'Celebre o São João com muita música, quadrilha e comidas típicas.',
      saleEndDate: '19 de Junho, 2025',
      lots: [
        {
          id: 'lote-1-jun',
          name: 'Lote 1 - Ingresso Social',
          price: 40.00,
          quantity: 300,
          startDate: '01 de Maio, 2025',
          endDate: '15 de Maio, 2025',
          ticketsSold: 245
        },
        {
          id: 'lote-2-jun',
          name: 'Lote 2 - Ingresso Comum',
          price: 60.00,
          quantity: 400,
          startDate: '16 de Maio, 2025',
          endDate: '19 de Junho, 2025',
          ticketsSold: 312
        }
      ],
      ticketsSold: 557,
      type: 'Forró',
      published: true,
      featured: true,
      openingTime: '20:00',
      city: 'Rio de Janeiro',
      producer: 'Produtor Genérico'
    },
    {
      id: 'd4e5f6a7-b8c9-4012-d345-e6f7a8b9c012',
      title: 'Festival de Forró',
      date: '10 de Março, 2025',
      location: 'Arena Multiuso',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      description: 'O maior festival de forró da região com 3 dias de muita animação.',
      saleEndDate: '09 de Março, 2025',
      lots: [
        {
          id: 'lote-1-mar',
          name: 'Lote Único',
          price: 120.00,
          quantity: 500,
          startDate: '01 de Janeiro, 2025',
          endDate: '09 de Março, 2025',
          ticketsSold: 423
        }
      ],
      ticketsSold: 423,
      type: 'Forró',
      published: true,
      featured: true,
      openingTime: '22:00',
      city: 'Brasília',
      producer: 'Produtor Genérico'
    },
    {
      id: 'e5f6a7b8-c9d0-4123-e456-f7a8b9c0d123',
      title: 'Forró no Sertão',
      date: '05 de Abril, 2025',
      location: 'Fazenda Eventos',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      description: 'Uma experiência única no sertão com forró ao vivo e gastronomia regional.',
      saleEndDate: '04 de Abril, 2025',
      lots: [
        {
          id: 'lote-1-abr',
          name: 'Lote Promocional',
          price: 70.00,
          quantity: 200,
          startDate: '01 de Março, 2025',
          endDate: '20 de Março, 2025',
          ticketsSold: 156
        },
        {
          id: 'lote-2-abr',
          name: 'Lote Regular',
          price: 100.00,
          quantity: 300,
          startDate: '21 de Março, 2025',
          endDate: '04 de Abril, 2025',
          ticketsSold: 234
        }
      ],
      ticketsSold: 390,
      type: 'Forró',
      published: true,
      openingTime: '19:00',
      city: 'Belo Horizonte',
      producer: 'Produtor Genérico'
    },
    // EVENTOS FECHADOS/REALIZADOS
    {
      id: 'f6a7b8c9-d0e1-4234-f567-a8b9c0d1e234',
      title: 'Arrasta-pé de Natal',
      date: '20 de Dezembro, 2024',
      location: 'Centro de Eventos',
      status: 'inativo',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      description: 'Celebração natalina com muito forró e alegria.',
      saleEndDate: '19 de Dezembro, 2024',
      lots: [
        {
          id: 'lote-1-dez',
          name: 'Lote 1',
          price: 55.00,
          quantity: 150,
          startDate: '01 de Novembro, 2024',
          endDate: '15 de Novembro, 2024',
          ticketsSold: 150
        },
        {
          id: 'lote-2-dez',
          name: 'Lote 2',
          price: 75.00,
          quantity: 200,
          startDate: '16 de Novembro, 2024',
          endDate: '19 de Dezembro, 2024',
          ticketsSold: 200
        }
      ],
      ticketsSold: 350,
      type: 'Forró'
    },
    {
      id: 'a7b8c9d0-e1f2-4345-a678-b9c0d1e2f345',
      title: 'Forró das Águas',
      date: '15 de Novembro, 2024',
      location: 'Clube Aquático',
      status: 'inativo',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      description: 'Forró com vista para o lago, uma experiência única.',
      saleEndDate: '14 de Novembro, 2024',
      lots: [
        {
          id: 'lote-1-nov',
          name: 'Lote Único',
          price: 65.00,
          quantity: 250,
          startDate: '01 de Outubro, 2024',
          endDate: '14 de Novembro, 2024',
          ticketsSold: 198
        }
      ],
      ticketsSold: 198,
      type: 'Forró'
    },
    {
      id: 'b8c9d0e1-f2a3-4456-b789-c0d1e2f3a456',
      title: 'Baile da Primavera',
      date: '25 de Setembro, 2024',
      location: 'Salão de Festas',
      status: 'inativo',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      description: 'Celebre a chegada da primavera com muito forró.',
      saleEndDate: '24 de Setembro, 2024',
      lots: [
        {
          id: 'lote-1-set',
          name: 'Lote Promocional',
          price: 45.00,
          quantity: 180,
          startDate: '01 de Agosto, 2024',
          endDate: '15 de Agosto, 2024',
          ticketsSold: 180
        },
        {
          id: 'lote-2-set',
          name: 'Lote Regular',
          price: 65.00,
          quantity: 220,
          startDate: '16 de Agosto, 2024',
          endDate: '24 de Setembro, 2024',
          ticketsSold: 195
        }
      ],
      ticketsSold: 375,
      type: 'Forró'
    },
    {
      id: 'c9d0e1f2-a3b4-4567-c890-d1e2f3a4b567',
      title: 'Forró do Interior',
      date: '10 de Agosto, 2024',
      location: 'Praça Central',
      status: 'inativo',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      description: 'Evento ao ar livre com o melhor do forró tradicional.',
      saleEndDate: '09 de Agosto, 2024',
      lots: [
        {
          id: 'lote-1-ago',
          name: 'Lote Único',
          price: 50.00,
          quantity: 300,
          startDate: '01 de Julho, 2024',
          endDate: '09 de Agosto, 2024',
          ticketsSold: 287
        }
      ],
      ticketsSold: 287,
      type: 'Forró'
    },
    // EVENTOS CANCELADOS
    {
      id: 'd0e1f2a3-b4c5-4678-d901-e2f3a4b5c678',
      title: 'Forró da Lua Cheia',
      date: '28 de Outubro, 2024',
      location: 'Parque Municipal',
      status: 'cancelado',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      description: 'Evento cancelado devido a condições climáticas adversas.',
      saleEndDate: '27 de Outubro, 2024',
      lots: [
        {
          id: 'lote-1-out',
          name: 'Lote Único',
          price: 60.00,
          quantity: 200,
          startDate: '01 de Setembro, 2024',
          endDate: '27 de Outubro, 2024',
          ticketsSold: 45
        }
      ],
      ticketsSold: 45,
      type: 'Forró'
    },
    {
      id: 'e1f2a3b4-c5d6-4789-e012-f3a4b5c6d789',
      title: 'Festival de Inverno',
      date: '05 de Julho, 2024',
      location: 'Centro Cultural',
      status: 'cancelado',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      description: 'Evento cancelado por motivos de força maior.',
      saleEndDate: '04 de Julho, 2024',
      lots: [
        {
          id: 'lote-1-jul',
          name: 'Lote Promocional',
          price: 55.00,
          quantity: 150,
          startDate: '01 de Maio, 2024',
          endDate: '20 de Maio, 2024',
          ticketsSold: 23
        },
        {
          id: 'lote-2-jul',
          name: 'Lote Regular',
          price: 80.00,
          quantity: 200,
          startDate: '21 de Maio, 2024',
          endDate: '04 de Julho, 2024',
          ticketsSold: 12
        }
      ],
      ticketsSold: 35,
      type: 'Forró'
    },
    {
      id: 'f2a3b4c5-d6e7-4890-f123-a4b5c6d7e890',
      title: 'Forró Country',
      date: '12 de Maio, 2025',
      location: 'Rancho Eventos',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      description: 'Mistura de forró e country em um ambiente rústico e acolhedor.',
      saleEndDate: '11 de Maio, 2025',
      lots: [
        {
          id: 'lote-1-mai',
          name: 'Lote 1 - Early Bird',
          price: 85.00,
          quantity: 100,
          startDate: '01 de Março, 2025',
          endDate: '31 de Março, 2025',
          ticketsSold: 87
        },
        {
          id: 'lote-2-mai',
          name: 'Lote 2 - Regular',
          price: 110.00,
          quantity: 150,
          startDate: '01 de Abril, 2025',
          endDate: '11 de Maio, 2025',
          ticketsSold: 98
        }
      ],
      ticketsSold: 185,
      type: 'Forró',
      published: true,
      openingTime: '20:00',
      city: 'Goiânia',
      producer: 'Produtor Genérico'
    },
    {
      id: 'a3b4c5d6-e7f8-4901-a234-b5c6d7e8f901',
      title: 'Forró na Praia',
      date: '30 de Janeiro, 2025',
      location: 'Beach Club',
      status: 'ativo',
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      description: 'Forró com vista para o mar, o melhor do verão nordestino.',
      saleEndDate: '29 de Janeiro, 2025',
      lots: [
        {
          id: 'lote-1-jan',
          name: 'Lote Promocional',
          price: 90.00,
          quantity: 180,
          startDate: '01 de Dezembro, 2024',
          endDate: '15 de Dezembro, 2024',
          ticketsSold: 145
        },
        {
          id: 'lote-2-jan',
          name: 'Lote Regular',
          price: 120.00,
          quantity: 220,
          startDate: '16 de Dezembro, 2024',
          endDate: '29 de Janeiro, 2025',
          ticketsSold: 178
        }
      ],
      ticketsSold: 323,
      type: 'Forró',
      published: true,
      openingTime: '22:00',
      city: 'Florianópolis',
      producer: 'Produtor Genérico'
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

