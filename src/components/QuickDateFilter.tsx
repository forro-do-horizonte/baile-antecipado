import React from 'react'

interface QuickDateFilterProps {
  value: string
  onChange: (value: string) => void
  onDateRangeChange: (from: string, to: string) => void
}

const QuickDateFilter = ({ value, onChange, onDateRangeChange }: QuickDateFilterProps) => {
  const handleQuickDateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const option = e.target.value
    onChange(option)
    
    if (!option) {
      onDateRangeChange('', '')
      return
    }
    
    const today = new Date()
    let from = ''
    let to = today.toISOString().split('T')[0] // YYYY-MM-DD
    
    switch (option) {
      case 'last-week':
        const lastWeek = new Date(today)
        lastWeek.setDate(today.getDate() - 7)
        from = lastWeek.toISOString().split('T')[0]
        break
      case 'last-15-days':
        const last15Days = new Date(today)
        last15Days.setDate(today.getDate() - 15)
        from = last15Days.toISOString().split('T')[0]
        break
      case 'current-month':
        from = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`
        break
      case 'last-month':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayLastMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        from = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}-01`
        to = `${lastDayLastMonth.getFullYear()}-${String(lastDayLastMonth.getMonth() + 1).padStart(2, '0')}-${String(lastDayLastMonth.getDate()).padStart(2, '0')}`
        break
      case 'current-year':
        from = `${today.getFullYear()}-01-01`
        break
      default:
        from = ''
        to = ''
    }
    
    onDateRangeChange(from, to)
  }

  return (
    <select
      value={value}
      onChange={handleQuickDateSelect}
      className="px-4 py-2 pr-8 border border-gray-300 bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%233d2817%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-right pr-8 bg-[length:12px_12px] bg-[right_0.75rem_center]"
    >
      <option value="">Datas rápidas</option>
      <option value="last-week">Última semana</option>
      <option value="last-15-days">Últimos 15 dias</option>
      <option value="current-month">Mês atual</option>
      <option value="last-month">Mês passado</option>
      <option value="current-year">Ano atual</option>
    </select>
  )
}

export default QuickDateFilter

