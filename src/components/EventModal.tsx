import { useState, useEffect, useRef, useCallback } from 'react'
import { useEvents, Lot, generateUUID } from '../contexts/EventsContext'
import { useEventModal } from '../contexts/EventModalContext'
import { useConfirmModal } from '../contexts/ConfirmModalContext'
import Button from './Button'

const EventModal = () => {
  const { isOpen, eventId, closeModal } = useEventModal()
  const { events, updateEvent, addEvent } = useEvents()
  const { openModal: openConfirmModal } = useConfirmModal()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const isNewEvent = eventId === null
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    status: 'ativo',
    imageUrl: '',
    description: '',
    saleEndDate: '',
    lots: [] as Lot[],
    type: 'Forró',
    openingTime: '',
    producer: ''
  })

  const [insertedLots, setInsertedLots] = useState<Lot[]>([])
  const [editingLot, setEditingLot] = useState<Lot | null>(null)
  const [hasTicketSales, setHasTicketSales] = useState(false)

  // Função para converter data brasileira para formato date input (YYYY-MM-DD)
  const convertToDateInput = (dateStr: string): string => {
    if (!dateStr) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    
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
    if (dateStr.includes(' de ')) return dateStr
    
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
    if (isNewEvent) {
      // Resetar formulário para novo evento
      setFormData({
        title: '',
        date: '',
        location: '',
        status: 'ativo',
        imageUrl: '',
        description: '',
        saleEndDate: '',
        lots: [],
        type: 'Forró',
        openingTime: '',
        producer: ''
      })
      setInsertedLots([])
      setHasTicketSales(false)
      return
    }
    
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
        type: event.type || 'Forró',
        openingTime: event.openingTime || '',
        producer: event.producer || ''
      })
      setInsertedLots((event.lots || []).map(lot => ({
        ...lot,
        startDate: convertToDateInput(lot.startDate),
        endDate: convertToDateInput(lot.endDate)
      })))
      setHasTicketSales((event.ticketsSold || 0) > 0)
    }
  }, [eventId, events, isNewEvent])

  const handleRequestClose = useCallback(() => {
    openConfirmModal({
      title: 'Cancelar',
      message: 'Eita, você vai perder tudo que escreveu aqui, quer cancelar mesmo?',
      confirmLabel: 'Sim, cancelar',
      cancelLabel: 'Não, continuar',
      confirmVariant: 'tertiary',
      cancelVariant: 'primary',
      onConfirm: () => closeModal()
    })
  }, [openConfirmModal, closeModal])

  // Fechar modal apenas com ESC (mas mostrar confirmação)
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleRequestClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, handleRequestClose])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNewEvent) {
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
        ticketsSold: 0,
        openingTime: formData.openingTime,
        producer: formData.producer || 'Produtor Genérico'
      }
      addEvent(newEvent)
      closeModal()
    } else if (eventId) {
      updateEvent(eventId, {
        ...formData,
        date: convertToBrazilianDate(formData.date),
        saleEndDate: convertToBrazilianDate(formData.saleEndDate),
        lots: insertedLots.map(lot => ({
          ...lot,
          startDate: convertToBrazilianDate(lot.startDate),
          endDate: convertToBrazilianDate(lot.endDate)
        })),
        openingTime: formData.openingTime,
        producer: formData.producer || 'Produtor Genérico'
      })
      closeModal()
    }
  }

  const handleAddLot = () => {
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

  const handleSaveLot = () => {
    if (!editingLot) return
    
    if (editingLot.id && insertedLots.find(l => l.id === editingLot.id)) {
      setInsertedLots(prev => prev.map(lot => lot.id === editingLot.id ? editingLot : lot))
    } else {
      setInsertedLots(prev => [...prev, { ...editingLot, id: editingLot.id || generateUUID() }])
    }
    setEditingLot(null)
  }

  const handleCancelLot = () => {
    setEditingLot(null)
  }

  const handleDeleteLot = (lotId: string) => {
    setInsertedLots(prev => prev.filter(lot => lot.id !== lotId))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="bg-beige-light border-2 border-brown shadow-[4px_4px_0_0_#000] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-brown">
              {isNewEvent ? 'Novo Evento' : 'Editar Evento'}
            </h2>
            <button
              onClick={handleRequestClose}
              className="text-brown hover:text-primary text-3xl font-bold transition-colors"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label htmlFor="title" className="block text-brown font-semibold mb-2 text-sm">
                  Título do Evento *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="date" className="block text-brown font-semibold mb-2 text-sm">
                  Data do Evento *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="block text-brown font-semibold mb-2 text-sm">
                  Local *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

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

              <div className="mb-4">
                <label htmlFor="saleEndDate" className="block text-brown font-semibold mb-2 text-sm">
                  Data de Encerramento de Vendas
                </label>
                <input
                  type="date"
                  id="saleEndDate"
                  name="saleEndDate"
                  value={formData.saleEndDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="openingTime" className="block text-brown font-semibold mb-2 text-sm">
                  Horário de Abertura
                </label>
                <input
                  type="time"
                  id="openingTime"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="producer" className="block text-brown font-semibold mb-2 text-sm">
                  Produtor
                </label>
                <input
                  type="text"
                  id="producer"
                  name="producer"
                  value={formData.producer}
                  onChange={handleChange}
                  placeholder="Nome do produtor"
                  className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-brown font-semibold mb-2 text-sm">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm resize-none"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-brown font-semibold mb-2 text-sm">
                URL da Imagem
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-brown bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
              />
            </div>

            {/* Lotes - versão simplificada para modal */}
            <div className="bg-white border-2 border-brown p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-serif font-bold text-brown">Lotes de Ingressos</h3>
                {!editingLot && (
                  <Button type="button" variant="secondary" onClick={handleAddLot} className="px-3 py-1.5 text-xs">
                    + Adicionar Lote
                  </Button>
                )}
              </div>

              {editingLot && (
                <div className="mb-4 p-4 bg-beige-light border border-brown">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Nome do lote"
                      value={editingLot.name}
                      onChange={(e) => setEditingLot({ ...editingLot, name: e.target.value })}
                      className="px-3 py-2 border border-brown rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Preço"
                      value={editingLot.price || ''}
                      onChange={(e) => setEditingLot({ ...editingLot, price: parseFloat(e.target.value) || 0 })}
                      className="px-3 py-2 border border-brown rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Quantidade"
                      value={editingLot.quantity || ''}
                      onChange={(e) => setEditingLot({ ...editingLot, quantity: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border border-brown rounded text-sm"
                    />
                    <input
                      type="date"
                      placeholder="Data início"
                      value={editingLot.startDate}
                      onChange={(e) => setEditingLot({ ...editingLot, startDate: e.target.value })}
                      className="px-3 py-2 border border-brown rounded text-sm"
                    />
                    <input
                      type="date"
                      placeholder="Data fim"
                      value={editingLot.endDate}
                      onChange={(e) => setEditingLot({ ...editingLot, endDate: e.target.value })}
                      className="px-3 py-2 border border-brown rounded text-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="primary" onClick={handleSaveLot} className="px-3 py-1.5 text-xs">
                      Salvar
                    </Button>
                    <Button type="button" variant="sextiary" onClick={handleCancelLot} className="px-3 py-1.5 text-xs">
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {insertedLots.map((lot) => (
                  <div key={lot.id} className="flex justify-between items-center p-2 bg-beige-light border border-brown">
                    <span className="text-sm text-brown">{lot.name} - R$ {lot.price.toFixed(2)}</span>
                    <Button
                      type="button"
                      variant="sextiary"
                      onClick={() => handleDeleteLot(lot.id)}
                      className="px-2 py-1 text-xs"
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="sextiary" onClick={handleRequestClose} className="px-4 py-2">
                Cancelar
              </Button>
              <Button type="submit" variant="primary" className="px-4 py-2">
                {isNewEvent ? 'Criar Evento' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EventModal

