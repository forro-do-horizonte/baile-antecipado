import { useNavigate } from 'react-router-dom'
import EventCalendar from './EventCalendar'

interface EventCardHomeProps {
  title: string
  date: string
  location: string
  city?: string
  imageUrl: string
  openingTime?: string
  eventId: string
  isFeatured?: boolean
  producer?: string
  description?: string
}

const EventCardHome = ({ 
  title, 
  date, 
  location,
  city,
  imageUrl, 
  openingTime,
  eventId,
  producer
}: EventCardHomeProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/evento/${eventId}`)
  }

  return (
    <div 
      onClick={handleClick}
      className="bg-beige-light flex flex-col h-full border border-gray-300 cursor-pointer transition-all hover:shadow-md hover:translate-x-[1px] hover:translate-y-[1px]"
    >
      {/* Image */}
      <div className="w-full h-48 sm:h-56 overflow-hidden bg-gray-800">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Data e Horário de Início */}
        <div className="flex items-center gap-3 mb-3">
          <EventCalendar date={date} />
          <div className="flex-1">
            {openingTime && (
              <p className="text-brown/70 text-xs">
                <span className="font-semibold">Abertura:</span> {openingTime}
              </p>
            )}
            <p className="text-brown/70 text-xs mt-1">
              {city && `${city}/SP`}
              {city && location && ' • '}
              {location}
            </p>
          </div>
        </div>

        {/* Produtor */}
        {producer && (
          <div className="mb-2">
            <p className="text-brown/80 text-xs font-semibold">
              {producer}
            </p>
          </div>
        )}

        {/* Resumo do Evento (Título) */}
        <h3 className="font-serif font-bold text-brown text-base line-clamp-2 flex-grow">
          {title}
        </h3>
      </div>
    </div>
  )
}

export default EventCardHome

