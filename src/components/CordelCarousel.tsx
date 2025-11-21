import { useState, useEffect } from 'react'
import EventBanner from './EventBanner'

interface Event {
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
  buttonText: string
  onButtonClick?: () => void
}

interface CordelCarouselProps {
  events: Event[]
  autoPlay?: boolean
  autoPlayInterval?: number
}

const CordelCarousel = ({ 
  events, 
  autoPlay = true, 
  autoPlayInterval = 5000 
}: CordelCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoPlay || events.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        // Sempre move da direita para esquerda (incrementa)
        const nextIndex = prev + 1
        // Quando chegar no último, recomeça do primeiro (sem voltar visualmente)
        return nextIndex >= events.length ? 0 : nextIndex
      })
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, events.length])

  const handleNext = () => {
    // Sempre move da direita para esquerda
    setCurrentIndex((prev) => (prev + 1) % events.length)
  }

  const handleBannerClick = (index: number) => {
    setCurrentIndex(index)
  }

  // Largura das bandeirolas: central (2x) e laterais (1x) - dobro do tamanho
  const activeWidth = 2
  const inactiveWidth = 1
  const totalWidth = activeWidth + (inactiveWidth * (events.length - 1))
  
  // Criar array com eventos duplicados para loop infinito
  // Adicionar eventos antes e depois para garantir visibilidade dos lados
  const extendedEvents = [...events, ...events, ...events]
  const startOffset = events.length

  // Calcular offset para centralizar o card ativo usando o array estendido
  const calculateOffset = () => {
    if (events.length === 0) return 0
    
    // Porcentagem de cada card no total
    const activeCardPercent = (activeWidth / totalWidth) * 100
    const inactiveCardPercent = (inactiveWidth / totalWidth) * 100
    
    // Usar o índice relativo (currentIndex) para calcular offset
    const relativeIndex = currentIndex
    
    // Soma das larguras dos cards antes do ativo
    const widthBeforeActive = relativeIndex * inactiveCardPercent
    
    // Posição do centro do card ativo
    const activeCardCenter = widthBeforeActive + (activeCardPercent / 2)
    
    return activeCardCenter
  }

  const canGoNext = events.length > 1
  const currentEvent = events[currentIndex]

  return (
    <div className="w-full relative">
      {/* Varal - linha sutil que atravessa toda a largura */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brown/60 z-20"></div>

      {/* Container do carrossel */}
      <div className="relative mt-6 overflow-hidden px-2 sm:px-4">
        <div className="relative h-[320px] sm:h-[400px] md:h-[450px]">
          {/* Seta de navegação - sempre move para frente (direita -> esquerda) */}
          {canGoNext && (
            <button
              onClick={handleNext}
              className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 border-2 border-brown"
              aria-label="Próximo"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div 
            className="flex transition-transform duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] h-full"
            style={{
              transform: `translateX(calc(50% - ${calculateOffset()}%))`,
              willChange: 'transform'
            }}
          >
            {extendedEvents.map((event, index) => {
              const realIndex = index % events.length
              const displayIndex = startOffset + currentIndex
              const isActive = index === displayIndex
              const widthPercent = isActive 
                ? `${(activeWidth / totalWidth) * 100}%` 
                : `${(inactiveWidth / totalWidth) * 100}%`
              
              return (
                <div
                  key={`${realIndex}-${index}`}
                  className="flex-shrink-0 px-1 sm:px-1.5 h-full"
                  style={{ width: widthPercent }}
                >
                  <EventBanner
                    title={event.title}
                    description={event.description}
                    date={event.date}
                    location={event.location}
                    imageUrl={event.imageUrl}
                    buttonText={event.buttonText}
                    isActive={isActive}
                    onButtonClick={() => {
                      event.onButtonClick?.()
                      handleBannerClick(realIndex)
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Indicadores de posição */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => handleBannerClick(index)}
            className={`transition-all duration-500 ease-out ${
              index === currentIndex 
                ? 'w-3 h-3 bg-primary border-2 border-brown' 
                : 'w-2.5 h-2.5 bg-brown/30 border border-brown/50 hover:bg-brown/50'
            } rounded-full`}
            aria-label={`Ir para evento ${index + 1}`}
          />
        ))}
      </div>

      {/* Informações do evento ativo abaixo do carrossel */}
      {currentEvent && (
        <div className="mt-6 text-center">
          <h3 className="font-serif font-bold text-brown text-xl md:text-2xl mb-2">
            {currentEvent.title}
          </h3>
          <p className="text-brown text-sm md:text-base mb-1">
            {currentEvent.location}
          </p>
          <p className="text-brown text-sm md:text-base">
            {currentEvent.date}
          </p>
        </div>
      )}
    </div>
  )
}

export default CordelCarousel

