interface EventBannerProps {
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
  buttonText: string
  isActive?: boolean
  onButtonClick?: () => void
}

const EventBanner = ({ 
  title, 
  description, 
  date, 
  location, 
  imageUrl, 
  buttonText,
  isActive = false,
  onButtonClick 
}: EventBannerProps) => {
  return (
    <div className="relative flex flex-col w-full h-full">
      {/* Ponto de conexão com o varal - mais sutil */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-brown rounded-full z-10"></div>
      
      {/* Bandeirola - formato retangular com ponta triangular inferior */}
      <div className={`relative bg-beige-light border-2 border-brown mt-1.5 flex flex-col h-full transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isActive 
          ? 'shadow-2xl' 
          : 'opacity-50 scale-95 hover:opacity-70 hover:scale-97'
      }`}>
        {/* Formato triangular na parte inferior (estilo bandeirola) */}
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[10px] border-l-transparent border-r-transparent border-t-brown"></div>
        
        {/* Conteúdo da bandeirola */}
        <div className={`flex flex-col h-full overflow-hidden ${isActive ? 'p-3 sm:p-4 md:p-5' : 'p-1.5 sm:p-2'}`}>
          {isActive ? (
            <>
              {/* Image para card ativo - dobro do tamanho original (h-48 md:h-64 -> h-96 md:h-128, mas vou usar menor) */}
              <div className="border-2 border-brown mb-2 sm:mb-3 overflow-hidden flex-shrink-0">
                <div 
                  className="w-full h-32 sm:h-40 md:h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    filter: 'grayscale(100%)'
                  }}
                ></div>
              </div>

              {/* Título */}
              <h3 className="font-serif font-bold text-brown text-center mb-1.5 sm:mb-2 text-sm sm:text-base md:text-lg flex-shrink-0">
                {title}
              </h3>

              {/* Descrição */}
              <p className="text-brown text-xs sm:text-sm mb-2 sm:mb-3 text-center leading-relaxed flex-grow line-clamp-2 sm:line-clamp-3">
                {description}
              </p>
              
              {/* Details */}
              <div className="mb-2 sm:mb-3 space-y-1 flex-shrink-0">
                <p className="text-brown text-xs sm:text-sm text-center">
                  <span className="font-semibold">Data:</span> {date}
                </p>
                <p className="text-brown text-xs sm:text-sm text-center">
                  <span className="font-semibold">Local:</span> {location}
                </p>
              </div>

              {/* Button */}
              <button
                onClick={onButtonClick}
                className="w-full bg-primary hover:bg-primary-dark text-white py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm font-semibold transition-all border-2 border-brown shadow-[3px_3px_0px_0px_rgba(61,40,23,1)] hover:shadow-[2px_2px_0px_0px_rgba(61,40,23,1)] hover:translate-x-[1px] hover:translate-y-[1px] flex-shrink-0"
              >
                {buttonText}
              </button>
            </>
          ) : (
            <>
              {/* Preview para cards inativos */}
              <div className="border border-brown/50 mb-1.5 overflow-hidden flex-shrink-0">
                <div 
                  className="w-full h-12 sm:h-14 md:h-16 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    filter: 'grayscale(100%) brightness(0.6)'
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-bold text-brown text-center text-[10px] sm:text-xs line-clamp-2 flex-grow">
                {title}
              </h3>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventBanner

