import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEvents, Lot, generateUUID } from '../contexts/EventsContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'
import PageHeader from '../components/PageHeader'

const EditEvent = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { events, updateEvent, addEvent } = useEvents()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isNewEvent = eventId === 'novo'
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    status: 'ativo',
    imageUrl: '',
    description: '',
    saleEndDate: '',
    lots: [] as Lot[],
    type: 'Forró'
  })

  const [insertedLots, setInsertedLots] = useState<Lot[]>([])
  const [editingLot, setEditingLot] = useState<Lot | null>(null)
  const [hasTicketSales, setHasTicketSales] = useState(false)

  // Função para converter data brasileira para formato date input (YYYY-MM-DD)
  const convertToDateInput = (dateStr: string): string => {
    if (!dateStr) return ''
    // Se já está no formato YYYY-MM-DD, retorna
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    
    // Tenta converter formato brasileiro para YYYY-MM-DD
    const months: { [key: string]: string } = {
      'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
      'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
      'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
    }
    
    const cleaned = dateStr.toLowerCase().replace(/,/g, '').trim()
    const parts = cleaned.split(' de ')
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0')
      const month = months[parts[1]] || '01'
      const year = parts[2]
      return `${year}-${month}-${day}`
    }
    return ''
  }

  // Função para converter formato date input para brasileiro
  const convertToBrazilianDate = (dateStr: string): string => {
    if (!dateStr) return ''
    // Se já está no formato brasileiro, retorna
    if (dateStr.includes(' de ')) return dateStr
    
    // Converte YYYY-MM-DD para formato brasileiro
    const [year, month, day] = dateStr.split('-')
    const months: { [key: string]: string } = {
      '01': 'janeiro', '02': 'fevereiro', '03': 'março', '04': 'abril',
      '05': 'maio', '06': 'junho', '07': 'julho', '08': 'agosto',
      '09': 'setembro', '10': 'outubro', '11': 'novembro', '12': 'dezembro'
    }
    return `${parseInt(day)} de ${months[month] || 'janeiro'}, ${year}`
  }

  // Carregar dados do evento
  useEffect(() => {
    if (isNewEvent) return // Não carregar dados se for novo evento
    
    const event = events.find(e => e.id === eventId)
    if (event) {
      setFormData({
        title: event.title,
        date: convertToDateInput(event.date),
        location: event.location,
        status: event.status,
        imageUrl: event.imageUrl,
        description: event.description || '',
        saleEndDate: convertToDateInput(event.saleEndDate || ''),
        lots: event.lots || [],
        type: event.type || 'Forró'
      })
      setInsertedLots((event.lots || []).map(lot => ({
        ...lot,
        startDate: convertToDateInput(lot.startDate),
        endDate: convertToDateInput(lot.endDate)
      })))
      // Verificar se há vendas de ingressos
      setHasTicketSales((event.ticketsSold || 0) > 0)
    }
  }, [eventId, events, isNewEvent])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNewEvent) {
      // Criar novo evento
      const newEvent = {
        ...formData,
        id: generateUUID(),
        date: convertToBrazilianDate(formData.date),
        saleEndDate: convertToBrazilianDate(formData.saleEndDate),
        lots: insertedLots.map(lot => ({
          ...lot,
          startDate: convertToBrazilianDate(lot.startDate),
          endDate: convertToBrazilianDate(lot.endDate)
        })),
        ticketsSold: 0
      }
      addEvent(newEvent)
      navigate('/dashboard/empresa')
    } else if (eventId) {
      // Converter datas de volta para formato brasileiro antes de salvar
      updateEvent(eventId, {
        ...formData,
        date: convertToBrazilianDate(formData.date),
        saleEndDate: convertToBrazilianDate(formData.saleEndDate),
        lots: insertedLots.map(lot => ({
          ...lot,
          startDate: convertToBrazilianDate(lot.startDate),
          endDate: convertToBrazilianDate(lot.endDate)
        }))
      })
      navigate('/dashboard/empresa')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddLot = () => {
    if (editingLot) return // Não permite adicionar se já está editando
    
    const newLot: Lot = {
      id: generateUUID(),
      name: '',
      price: 0,
      quantity: 0,
      startDate: '',
      endDate: ''
    }
    setEditingLot(newLot)
  }

  const handleIncludeLot = () => {
    if (!editingLot) return
    
    // Validar se o lote está preenchido
    if (!editingLot.name || editingLot.price <= 0 || editingLot.quantity <= 0) {
      alert('Por favor, preencha todos os campos obrigatórios do lote')
      return
    }

    // Converter datas para formato brasileiro antes de incluir
    const lotToInsert = {
      ...editingLot,
      startDate: convertToBrazilianDate(editingLot.startDate),
      endDate: convertToBrazilianDate(editingLot.endDate)
    }

    // Se o lote já existe (está sendo editado), atualizar, senão adicionar
    const existingIndex = insertedLots.findIndex(lot => lot.id === editingLot.id)
    if (existingIndex >= 0) {
      setInsertedLots(prev => prev.map((lot, index) => 
        index === existingIndex ? lotToInsert : lot
      ))
    } else {
      setInsertedLots(prev => [...prev, lotToInsert])
    }
    
    setEditingLot(null)
  }

  const handleRemoveLot = (lotId: string) => {
    // Se há vendas, não permitir excluir lotes existentes
    if (hasTicketSales) {
      alert('Não é possível excluir lotes que já possuem vendas.')
      return
    }
    setInsertedLots(prev => prev.filter(lot => lot.id !== lotId))
  }

  const handleEditLot = (lot: Lot) => {
    // Se há vendas, não permitir editar lotes existentes
    if (hasTicketSales && insertedLots.find(l => l.id === lot.id)) {
      alert('Não é possível editar lotes que já possuem vendas. Você pode apenas criar novos lotes.')
      return
    }
    
    setEditingLot({ 
      ...lot,
      startDate: convertToDateInput(lot.startDate),
      endDate: convertToDateInput(lot.endDate)
    })
  }

  const handleLotChange = (field: keyof Lot, value: string | number) => {
    if (!editingLot) return
    
    setEditingLot(prev => prev ? { ...prev, [field]: value } : null)
  }

  const handleCancelEditLot = () => {
    setEditingLot(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <PageHeader title={isNewEvent ? "Novo Evento" : "Editar Evento"} />

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-beige-light border-2 border-brown p-6">
              {/* Título */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-brown font-semibold mb-2 text-sm">
                  Título do Evento *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              {/* Descrição */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-brown font-semibold mb-2 text-sm">
                  Descrição *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm resize-none"
                />
              </div>

              {/* Data */}
              <div className="mb-4">
                <label htmlFor="date" className="block text-brown font-semibold mb-2 text-sm">
                  Data do evento *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              {/* Local */}
              <div className="mb-4">
                <label htmlFor="location" className="block text-brown font-semibold mb-2 text-sm">
                  Local *
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              {/* Upload de Imagem */}
              <div className="mb-4">
                <label htmlFor="imageUpload" className="block text-brown font-semibold mb-2 text-sm">
                  Imagem do Evento
                </label>
                <input
                  ref={fileInputRef}
                  id="imageUpload"
                  name="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="flex gap-4 items-start">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg hover:bg-beige-light transition-colors font-serif text-sm"
                  >
                    Escolher Arquivo
                  </button>
                  {formData.imageUrl && (
                    <div className="w-32 h-32 border-2 border-brown overflow-hidden bg-gray-800 flex-shrink-0">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        style={{ filter: 'grayscale(100%)' }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Data Final para Venda */}
              <div className="mb-4">
                <label htmlFor="saleEndDate" className="block text-brown font-semibold mb-2 text-sm">
                  Data Final para Venda dos Ingressos *
                </label>
                <input
                  id="saleEndDate"
                  name="saleEndDate"
                  type="date"
                  value={formData.saleEndDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              {/* Status */}
              <div className="mb-4">
                <label htmlFor="status" className="block text-brown font-semibold mb-2 text-sm">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              {/* Tipo de Evento */}
              <div className="mb-4">
                <label htmlFor="type" className="block text-brown font-semibold mb-2 text-sm">
                  Tipo de Evento *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                >
                  <option value="Forró">Forró</option>
                  <option value="Sertanejo">Sertanejo</option>
                  <option value="Axé">Axé</option>
                  <option value="Pagode">Pagode</option>
                  <option value="MPB">MPB</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
            </div>

            {/* Lotes */}
            <div className="bg-beige-light border-2 border-brown p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-bold text-brown">
                  Lotes de Ingressos
                </h2>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddLot}
                  disabled={!!editingLot}
                  className="px-4 py-2.5 text-sm"
                >
                  + Adicionar Lote
                </Button>
              </div>

              {/* Lotes Inseridos (Cards) */}
              {insertedLots.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-serif font-semibold text-brown mb-3">
                    Lotes Cadastrados
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {insertedLots.map((lot, index) => {
                      // Se há vendas, não permitir editar lotes existentes (todos os lotes exibidos são existentes)
                      const canEdit = !hasTicketSales
                      return (
                      <div
                        key={lot.id}
                        onClick={() => canEdit && handleEditLot(lot)}
                        className={`bg-white border-2 border-brown shadow-[4px_4px_0_0_#000] p-4 transition-all ${
                          canEdit 
                            ? 'cursor-pointer hover:shadow-[3px_3px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px]' 
                            : 'cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-brown text-sm">{lot.name || `Lote ${index + 1}`}</h4>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveLot(lot.id)
                              }}
                              className="text-red-600 hover:text-red-800 text-xs font-semibold"
                            >
                              Excluir
                            </button>
                          )}
                          {!canEdit && (
                            <span className="text-xs text-brown/50 italic">Com vendas</span>
                          )}
                        </div>
                        <div className="space-y-1 text-xs text-brown/70">
                          <p><span className="font-semibold">Preço:</span> R$ {lot.price.toFixed(2)}</p>
                          <p><span className="font-semibold">Quantidade:</span> {lot.quantity}</p>
                          {lot.startDate && <p><span className="font-semibold">Início:</span> {lot.startDate}</p>}
                          {lot.endDate && <p><span className="font-semibold">Fim:</span> {lot.endDate}</p>}
                        </div>
                      </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Formulário de Edição/Criação de Lote */}
              {editingLot && (
                <div className="border-2 border-brown p-4 bg-white relative">
                  <div className="mb-3">
                    <h3 className="font-semibold text-brown">
                      {insertedLots.find(l => l.id === editingLot.id) ? 'Editar Lote' : 'Novo Lote'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-12">
                    <div>
                      <label className="block text-brown font-semibold mb-1 text-xs">
                        Nome do Lote *
                      </label>
                      <input
                        type="text"
                        value={editingLot.name}
                        onChange={(e) => handleLotChange('name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                        placeholder="Ex: Lote 1 - Promocional"
                      />
                    </div>
                    <div>
                      <label className="block text-brown font-semibold mb-1 text-xs">
                        Preço (R$) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingLot.price}
                        onChange={(e) => handleLotChange('price', parseFloat(e.target.value) || 0)}
                        required
                        min="0"
                        className="w-full px-3 py-2 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-brown font-semibold mb-1 text-xs">
                        Quantidade *
                      </label>
                      <input
                        type="number"
                        value={editingLot.quantity}
                        onChange={(e) => handleLotChange('quantity', parseInt(e.target.value) || 0)}
                        required
                        min="1"
                        className="w-full px-3 py-2 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-brown font-semibold mb-1 text-xs">
                        Data Início
                      </label>
                      <input
                        type="date"
                        value={editingLot.startDate}
                        onChange={(e) => handleLotChange('startDate', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-brown font-semibold mb-1 text-xs">
                        Data Fim
                      </label>
                      <input
                        type="date"
                        value={editingLot.endDate}
                        onChange={(e) => handleLotChange('endDate', e.target.value)}
                        className="w-full px-3 py-2 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                      type="button"
                      variant="sextiary"
                      onClick={handleCancelEditLot}
                      className="px-4 py-2.5 text-sm"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="button"
                      variant="quintary"
                      onClick={handleIncludeLot}
                      className="px-4 py-2.5 text-sm"
                    >
                      Incluir
                    </Button>
                  </div>
                </div>
              )}

              {insertedLots.length === 0 && !editingLot && (
                <p className="text-brown/70 text-sm text-center py-4">
                  Nenhum lote cadastrado. Clique em "Adicionar Lote" para começar.
                </p>
              )}
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="tertiary"
                onClick={() => navigate('/dashboard/empresa')}
                className="px-4 py-2.5 text-sm"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="px-4 py-2.5 text-sm"
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default EditEvent

