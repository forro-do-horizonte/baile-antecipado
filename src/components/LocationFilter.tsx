import { useState, useEffect } from 'react'
import Button from './Button'

interface LocationFilterProps {
  selectedCity: string | null
  onCitySelect: (city: string | null) => void
  capitalCities: string[]
  allCities: string[]
}

const LocationFilter = ({ selectedCity, onCitySelect, capitalCities, allCities }: LocationFilterProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Resetar pesquisa quando o modal abrir
  useEffect(() => {
    if (isModalOpen) {
      setSearchQuery('')
    }
  }, [isModalOpen])

  // Determinar quais cidades mostrar
  // Se há pesquisa, usar lista completa; senão, mostrar apenas capitais
  const citiesToShow = searchQuery.trim() 
    ? allCities.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.localeCompare(b, 'pt-BR'))
    : capitalCities.sort((a, b) => a.localeCompare(b, 'pt-BR'))

  const handleCityClick = (city: string | null) => {
    onCitySelect(city)
    setIsModalOpen(false)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSearchQuery('')
  }

  return (
    <>
      {/* Botão de Filtro de Localização */}
      <Button
        variant="quaternary"
        onClick={() => setIsModalOpen(true)}
        className="w-auto flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 sm:py-2.5 text-sm sm:text-base whitespace-nowrap"
      >
        <svg 
          className="w-4 h-4 text-brown flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
          />
          <circle 
            cx="12" 
            cy="10" 
            r="3" 
            fill="currentColor"
            stroke="none"
          />
        </svg>
        <span className="text-brown text-sm sm:text-base">{selectedCity || 'Qualquer lugar'}</span>
        <svg 
          className="w-3 h-3 text-brown flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </Button>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-beige-light border-2 border-brown rounded-lg shadow-lg w-full max-w-md max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-4 sm:p-6 border-b-2 border-brown">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brown text-center">
                Selecionar Cidade
              </h2>
            </div>

            {/* Barra de Pesquisa no Modal */}
            <div className="p-4 sm:p-6 border-b-2 border-brown">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar cidade..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 sm:py-3 border-2 border-brown bg-white text-brown placeholder-brown/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm sm:text-base"
                />
                <svg 
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown/50" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Lista de Cidades */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {citiesToShow.length > 0 ? (
                <div className="space-y-2">
                  {/* Opção "Qualquer lugar" */}
                  <button
                    onClick={() => handleCityClick(null)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                      selectedCity === null
                        ? 'bg-primary text-white border-brown shadow-[2px_2px_0px_0px_rgba(61,40,23,1)]'
                        : 'bg-white text-brown border-brown hover:bg-beige-light'
                    }`}
                  >
                    <span className="font-serif font-medium">Qualquer lugar</span>
                  </button>

                  {/* Lista de cidades */}
                  {citiesToShow.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityClick(city)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${
                        selectedCity === city
                          ? 'bg-primary text-white border-brown shadow-[2px_2px_0px_0px_rgba(61,40,23,1)]'
                          : 'bg-white text-brown border-brown hover:bg-beige-light'
                      }`}
                    >
                      <span className="font-serif font-medium">{city}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-brown text-base sm:text-lg font-serif">
                    Nenhuma cidade encontrada
                  </p>
                </div>
              )}
            </div>

            {/* Footer do Modal com Botão Fechar */}
            <div className="p-4 sm:p-6 border-t-2 border-brown">
              <Button
                variant="tertiary"
                onClick={handleClose}
                className="w-full"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default LocationFilter

