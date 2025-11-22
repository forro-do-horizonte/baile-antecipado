import { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import EventCardHome from '../components/EventCardHome'
import Footer from '../components/Footer'
import LocationFilter from '../components/LocationFilter'
import CordelTitleSection from '../components/CordelTitleSection'
import SearchInput from '../components/SearchInput'
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
    if (locationDetected) return
    
    // Desabilitar detecção automática em desenvolvimento (localhost) devido a problemas de CORS
    const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    if (isDevelopment) {
      console.log('Detecção automática de localização desabilitada em desenvolvimento devido a CORS')
      return
    }
    
    // Verificar se o navegador suporta geolocalização
    if (!navigator.geolocation) {
      console.log('Geolocalização não suportada pelo navegador')
      return
    }

    // Função para obter cidade a partir de coordenadas (reverse geocoding)
    const getCityFromCoordinates = async (lat: number, lon: number): Promise<string | null> => {
      try {
        // Usando OpenStreetMap Nominatim API (gratuita, sem necessidade de API key)
        // IMPORTANTE: Nominatim requer um User-Agent identificável e tem políticas de uso
        // Em produção, considere usar um proxy no backend para evitar problemas de CORS
        
        // Tentar usar uma API alternativa que funciona melhor com CORS
        // Usando a API do MapBox (requer token, mas tem melhor suporte) ou
        // Usar uma solução via proxy no backend
        
        // Por enquanto, vamos tentar o Nominatim com tratamento melhor de erros
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1&zoom=10`,
          {
            method: 'GET',
            headers: {
              'User-Agent': 'BaileAntecipado/1.0 (https://baileantecipado.com.br; contato@baileantecipado.com.br)',
              'Accept-Language': 'pt-BR,pt;q=0.9',
              'Referer': window.location.origin
            },
            mode: 'cors', // Explicitamente definir CORS
            credentials: 'omit' // Não enviar cookies
          }
        )
        
        if (!response.ok) {
          // Se for 403, pode ser bloqueio por CORS ou rate limiting
          if (response.status === 403) {
            console.warn('Acesso negado pela API Nominatim. Isso pode ser devido a CORS ou rate limiting.')
            console.warn('Em desenvolvimento, a detecção automática está desabilitada. Use a seleção manual de cidade.')
          } else {
            console.warn('Erro ao obter cidade da API Nominatim:', response.status, response.statusText)
          }
          return null
        }
        
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
      } catch (error: any) {
        // Tratar especificamente erros de CORS
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
          console.warn('Erro de CORS ao acessar API de geolocalização. Em desenvolvimento, use a seleção manual de cidade.')
          console.warn('Em produção, considere implementar um proxy no backend para evitar problemas de CORS.')
        } else {
          console.error('Erro ao obter cidade:', error)
        }
        return null
      }
    }

    // Solicitar permissão e obter localização
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        // Adicionar um pequeno delay antes de fazer a requisição para respeitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
        
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
        <section className="w-full px-3 pb-[1.05rem] sm:px-4 sm:pb-[1.4rem] md:px-8 md:pb-[2.1rem]">
          <div className="max-w-7xl mx-auto">
            {/* Campo de Pesquisa e Filtro de Localização */}
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-row gap-3 items-center justify-center max-w-2xl mx-auto">
                {/* Campo de Pesquisa - ocupa o restante do espaço */}
                <SearchInput
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholderTexts={[
                    'Pesquise o baile pelo nome',
                    'Vai de forró hj?',
                    'Qual xaxadão você tá procurando?',
                    'Um baião não se recusa',
                    'Já dançou hoje? Que tal um xote?'
                  ]}
                  placeholderInterval={5000}
                />
                
                {/* Filtro de Localização - à direita */}
                <div className="flex-shrink-0">
                  <LocationFilter
                    selectedCity={selectedCity}
                    onCitySelect={setSelectedCity}
                    capitalCities={capitalCities}
                    allCities={allCities}
                  />
                </div>
              </div>
            </div>

            {/* Bloco de Eventos em Destaque */}
            {featuredEvents.length > 0 && (
              <div className="mb-12">
                <CordelTitleSection title="Bailes só o luxo" className="mt-6" />
                <div 
                  className={`grid gap-4 ${
                    featuredEvents.length === 1 
                      ? 'grid-cols-1 justify-items-center' 
                      : featuredEvents.length === 2 
                      ? 'grid-cols-1 sm:grid-cols-2 justify-items-center' 
                      : featuredEvents.length === 3 
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center' 
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                  }`}
                  style={featuredEvents.length < 4 ? { maxWidth: 'fit-content', margin: '0 auto' } : {}}
                >
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
                <h2 className="text-2xl font-bold text-brown mb-6 text-center" style={{ fontFamily: 'SpecialElite, serif' }}>
                  Todos os Eventos
                </h2>
                <div 
                  className={`grid gap-4 ${
                    allEvents.length === 1 
                      ? 'grid-cols-1 justify-items-center' 
                      : allEvents.length === 2 
                      ? 'grid-cols-1 sm:grid-cols-2 justify-items-center' 
                      : allEvents.length === 3 
                      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-items-center' 
                      : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
                  }`}
                  style={allEvents.length < 4 ? { maxWidth: 'fit-content', margin: '0 auto' } : {}}
                >
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

