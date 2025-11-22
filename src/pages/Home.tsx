import { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import EventCardHome from '../components/EventCardHome'
import Footer from '../components/Footer'
import LocationFilter from '../components/LocationFilter'
import CordelTitleSection from '../components/CordelTitleSection'
import { useEvents } from '../contexts/EventsContext'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [locationDetected, setLocationDetected] = useState(false)
  const { events } = useEvents()

  // Lista de capitais do Brasil
  const capitalCities = useMemo(() => [
    "Aracaju",
    "Belém",
    "Belo Horizonte",
    "Boa Vista",
    "Brasília",
    "Campo Grande",
    "Cuiabá",
    "Curitiba",
    "Florianópolis",
    "Fortaleza",
    "Goiânia",
    "João Pessoa",
    "Macapá",
    "Maceió",
    "Manaus",
    "Natal",
    "Palmas",
    "Porto Alegre",
    "Porto Velho",
    "Recife",
    "Rio Branco",
    "Rio de Janeiro",
    "Salvador",
    "São Luís",
    "São Paulo",
    "Teresina",
    "Vitória"
  ], [])

  // Lista completa de cidades do Brasil (capitais + principais cidades)
  const allCities = useMemo(() => {
    const additionalCities = [
      "Anápolis",
      "Aparecida de Goiânia",
      "Araguaína",
      "Arapiraca",
      "Araraquara",
      "Araçatuba",
      "Barra Mansa",
      "Barreiras",
      "Bauru",
      "Betim",
      "Blumenau",
      "Brasília",
      "Cabo Frio",
      "Camaçari",
      "Campina Grande",
      "Campinas",
      "Campos dos Goytacazes",
      "Caruaru",
      "Cascavel",
      "Caxias do Sul",
      "Chapecó",
      "Contagem",
      "Criciúma",
      "Diadema",
      "Dourados",
      "Duque de Caxias",
      "Feira de Santana",
      "Franca",
      "Garanhuns",
      "Governador Valadares",
      "Guarulhos",
      "Guaíba",
      "Hortolândia",
      "Ilhéus",
      "Imperatriz",
      "Ipatinga",
      "Itabuna",
      "Itajaí",
      "Itaquaquecetuba",
      "Jaboatão dos Guararapes",
      "Jacareí",
      "Joinville",
      "Juazeiro",
      "Juazeiro do Norte",
      "Jundiaí",
      "Lages",
      "Limeira",
      "Londrina",
      "Luziânia",
      "Maringá",
      "Mauá",
      "Montes Claros",
      "Mossoró",
      "Niterói",
      "Nova Iguaçu",
      "Olinda",
      "Osasco",
      "Palhoça",
      "Paranaguá",
      "Paulista",
      "Petrolina",
      "Petrópolis",
      "Piracicaba",
      "Ponta Grossa",
      "Praia Grande",
      "Ribeirão Preto",
      "Rio Claro",
      "Rondonópolis",
      "Santa Maria",
      "Santos",
      "São Bernardo do Campo",
      "São Caetano do Sul",
      "São Gonçalo",
      "São José",
      "São José do Rio Preto",
      "São José dos Campos",
      "São João de Meriti",
      "Serra",
      "Sete Lagoas",
      "Sobral",
      "Sorocaba",
      "Suzano",
      "Taubaté",
      "Uberaba",
      "Uberlândia",
      "Várzea Grande",
      "Viamão",
      "Vila Velha",
      "Vitória da Conquista",
      "Volta Redonda"
    ]
    return [...new Set([...capitalCities, ...additionalCities])].sort((a, b) => a.localeCompare(b, 'pt-BR'))
  }, [capitalCities])

  // Detectar localização do usuário ao carregar a página
  useEffect(() => {
    // Verificar se já detectou a localização (evitar múltiplas chamadas)
    if (locationDetected || selectedCity) return
    
    // Verificar se o navegador suporta geolocalização
    if (!navigator.geolocation) {
      console.log('Geolocalização não suportada pelo navegador')
      return
    }

    // Função para obter cidade a partir de coordenadas (reverse geocoding)
    const getCityFromCoordinates = async (lat: number, lon: number): Promise<string | null> => {
      try {
        // Usando OpenStreetMap Nominatim API (gratuita, sem necessidade de API key)
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
          {
            headers: {
              'User-Agent': 'BaileAntecipado/1.0' // Nominatim requer User-Agent
            }
          }
        )
        
        if (!response.ok) return null
        
        const data = await response.json()
        const city = data.address?.city || data.address?.town || data.address?.municipality || data.address?.county
        
        if (!city) return null
        
        // Normalizar nome da cidade (remover acentos e converter para comparação)
        const normalizeCity = (name: string) => 
          name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        
        // Buscar correspondência na lista de cidades disponíveis
        const normalizedCity = normalizeCity(city)
        const matchedCity = allCities.find(availableCity => 
          normalizeCity(availableCity) === normalizedCity || 
          normalizeCity(availableCity).includes(normalizedCity) ||
          normalizedCity.includes(normalizeCity(availableCity))
        )
        
        return matchedCity || null
      } catch (error) {
        console.error('Erro ao obter cidade:', error)
        return null
      }
    }

    // Solicitar permissão e obter localização
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Obter cidade a partir das coordenadas
        const city = await getCityFromCoordinates(latitude, longitude)
        
        if (city) {
          setSelectedCity(city)
          setLocationDetected(true)
        }
      },
      (error) => {
        // Tratar erros silenciosamente (usuário negou permissão, timeout, etc.)
        console.log('Erro ao obter localização:', error.message)
      },
      {
        enableHighAccuracy: false, // Não precisa de alta precisão para cidade
        timeout: 10000, // Timeout de 10 segundos
        maximumAge: 300000 // Aceitar localização em cache de até 5 minutos
      }
    )
  }, [locationDetected, selectedCity, allCities])

  // Filtrar apenas eventos publicados
  const publishedEvents = useMemo(() => {
    return events.filter(event => event.published === true)
  }, [events])

  // Filtrar eventos baseado na pesquisa e cidade
  const filteredEvents = useMemo(() => {
    return publishedEvents.filter(event => {
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (event.city && event.city.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const matchesCity = !selectedCity || event.city === selectedCity
      
      return matchesSearch && matchesCity
    })
  }, [publishedEvents, searchQuery, selectedCity])

  // Separar eventos em destaque e todos os eventos
  const featuredEvents = useMemo(() => {
    return filteredEvents.filter(event => event.featured === true).slice(0, 4)
  }, [filteredEvents])

  const allEvents = useMemo(() => {
    return filteredEvents.filter(event => !event.featured || featuredEvents.length < 4 || !featuredEvents.find(fe => fe.id === event.id))
  }, [filteredEvents, featuredEvents])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-20 overflow-x-hidden">
        <section className="w-full px-3 py-[1.05rem] sm:px-4 sm:py-[1.4rem] md:px-8 md:py-[2.1rem]">
          <div className="max-w-7xl mx-auto">
            {/* Campo de Pesquisa e Filtro de Localização */}
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-center max-w-2xl mx-auto">
                {/* Filtro de Localização - à esquerda */}
                <div className="flex-shrink-0">
                  <LocationFilter
                    selectedCity={selectedCity}
                    onCitySelect={setSelectedCity}
                    capitalCities={capitalCities}
                    allCities={allCities}
                  />
                </div>
                
                {/* Campo de Pesquisa - ocupa o restante do espaço */}
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder="Pesquisar eventos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2.5 sm:py-3 border-2 border-brown bg-white hover:bg-beige-light text-brown placeholder-brown/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm sm:text-base shadow-[2px_2px_0px_0px_rgba(61,40,23,1)] hover:shadow-[1px_1px_0px_0px_rgba(61,40,23,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
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
            </div>

            {/* Bloco de Eventos em Destaque */}
            {featuredEvents.length > 0 && (
              <div className="mb-12">
                <CordelTitleSection title="Bailes só o luxo" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {featuredEvents.map((event) => (
                    <EventCardHome
                      key={event.id}
                      title={event.title}
                      date={event.date}
                      location={event.location}
                      city={event.city}
                      imageUrl={event.imageUrl}
                      openingTime={event.openingTime}
                      eventId={event.id}
                      isFeatured={true}
                      producer={event.producer}
                      description={event.description}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Bloco de Todos os Eventos */}
            {allEvents.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold text-brown mb-6 text-center">
                  Todos os Eventos
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {allEvents.map((event) => (
                    <EventCardHome
                      key={event.id}
                      title={event.title}
                      date={event.date}
                      location={event.location}
                      city={event.city}
                      imageUrl={event.imageUrl}
                      openingTime={event.openingTime}
                      eventId={event.id}
                      producer={event.producer}
                      description={event.description}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Mensagem quando não há eventos */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-brown text-base sm:text-lg font-serif">
                  {selectedCity 
                    ? `Nenhum evento encontrado${searchQuery ? ` para "${searchQuery}"` : ''} em ${selectedCity}`
                    : searchQuery 
                      ? `Nenhum evento encontrado para "${searchQuery}"`
                      : 'Nenhum evento encontrado'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Home

