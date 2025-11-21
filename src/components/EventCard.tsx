import { useNavigate } from 'react-router-dom'
import Button from './Button'

interface EventCardProps {
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
  isFeatured?: boolean
  eventId?: string | number
}

const EventCard = ({ 
  title, 
  description, 
  date, 
  location, 
  imageUrl, 
  isFeatured = false,
  eventId
}: EventCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/evento/${eventId || title.toLowerCase().replace(/\s+/g, '-')}`)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevenir que o clique no botão dispare o clique do card
    navigate(`/evento/${eventId || title.toLowerCase().replace(/\s+/g, '-')}`)
  }

  return (
    <div 
      onClick={handleClick}
      className={`bg-beige-light flex flex-col h-full border-2 border-brown cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[4px_4px_0_0_#000]`}
    >
      {/* Image */}
      <div className="border-b-2 border-brown">
        <div 
          className={`w-full bg-cover bg-center bg-gray-800 ${isFeatured ? 'h-40 sm:h-48 md:h-56' : 'h-32 sm:h-40 md:h-48'}`}
          style={{
            backgroundImage: `url(${imageUrl})`,
            filter: 'grayscale(100%)'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className={`flex flex-col flex-grow ${isFeatured ? 'p-3 sm:p-4 md:p-5' : 'p-2.5 sm:p-3 md:p-4'}`}>
        {/* Título */}
        <h3 className={`font-serif font-bold text-brown mb-2 text-center ${isFeatured ? 'text-lg sm:text-xl md:text-2xl' : 'text-base sm:text-lg md:text-xl'}`}>
          {title}
        </h3>

        {/* Descrição */}
        <p className={`text-brown mb-3 sm:mb-4 flex-grow text-center leading-relaxed ${isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
          {description}
        </p>
        
        {/* Details */}
        <div className={`mb-3 sm:mb-4 space-y-1.5 sm:space-y-2`}>
          <p className={`text-brown text-center ${isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
            <span className="font-semibold">Data:</span> {date}
          </p>
          <p className={`text-brown text-center ${isFeatured ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'}`}>
            <span className="font-semibold">Local:</span> {location}
          </p>
        </div>

        {/* Button - Apenas para evento destacado */}
        {isFeatured && (
          <Button
            variant="primary"
            onClick={handleButtonClick}
            className="w-full mt-auto py-2.5 sm:py-3 px-4 sm:px-5 text-sm sm:text-base"
          >
            Comprar ingresso
          </Button>
        )}
      </div>
    </div>
  )
}

export default EventCard

