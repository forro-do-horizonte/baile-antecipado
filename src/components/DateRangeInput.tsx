interface DateRangeInputProps {
  dateFrom: string
  dateTo: string
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
}

const DateRangeInput = ({ dateFrom, dateTo, onDateFromChange, onDateToChange }: DateRangeInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
        placeholder="De"
      />
      <span className="text-brown font-semibold">-</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm"
        placeholder="Até"
      />
    </div>
  )
}

export default DateRangeInput

