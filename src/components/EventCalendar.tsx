interface EventCalendarProps {
  date: string
}

const EventCalendar = ({ date }: EventCalendarProps) => {
  // Função para extrair mês, dia e dia da semana da data
  const parseDate = (dateStr: string) => {
    const months: { [key: string]: { name: string, number: number } } = {
      'janeiro': { name: 'JAN', number: 0 },
      'fevereiro': { name: 'FEV', number: 1 },
      'março': { name: 'MAR', number: 2 },
      'marco': { name: 'MAR', number: 2 }, // sem acento
      'abril': { name: 'ABR', number: 3 },
      'maio': { name: 'MAI', number: 4 },
      'junho': { name: 'JUN', number: 5 },
      'julho': { name: 'JUL', number: 6 },
      'agosto': { name: 'AGO', number: 7 },
      'setembro': { name: 'SET', number: 8 },
      'outubro': { name: 'OUT', number: 9 },
      'novembro': { name: 'NOV', number: 10 },
      'dezembro': { name: 'DEZ', number: 11 }
    }
    
    const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
    
    // Formato esperado: "20 de Janeiro, 2025" ou "20 de Janeiro 2025"
    const cleaned = dateStr.toLowerCase().replace(/,/g, '').trim()
    const parts = cleaned.split(' de ')
    
    if (parts.length >= 2) {
      const day = parseInt(parts[0].trim())
      const monthAndYear = parts[1].trim().split(' ')
      const monthName = monthAndYear[0]
      const year = parseInt(monthAndYear[1] || monthAndYear[monthAndYear.length - 1])
      const month = months[monthName]
      
      if (!isNaN(day) && month && !isNaN(year)) {
        const dateObj = new Date(year, month.number, day)
        const dayOfWeek = days[dateObj.getDay()]
        return {
          day: day.toString(),
          month: month.name,
          dayOfWeek: dayOfWeek
        }
      }
    }
    return {
      day: '',
      month: '',
      dayOfWeek: ''
    }
  }

  const { day, month, dayOfWeek } = parseDate(date)

  // Sempre renderizar, mesmo se não conseguir parsear
  const displayMonth = month || '---'
  const displayDay = day || '??'
  const displayDayOfWeek = dayOfWeek || '---'

  return (
    <div className="flex-shrink-0 w-16 h-16 border border-brown rounded bg-white overflow-hidden">
      {/* Mês */}
      <div className="bg-brown text-white text-xs font-bold text-center py-1">
        {displayMonth}
      </div>
      {/* Dia */}
      <div className="text-center py-1">
        <span className="text-brown font-bold text-xl">{displayDay}</span>
      </div>
      {/* Dia da Semana */}
      <div className="text-center pb-1">
        <span className="text-brown font-bold text-xs uppercase">{displayDayOfWeek}</span>
      </div>
    </div>
  )
}

export default EventCalendar

