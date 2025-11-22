
type StatCardType = 'money' | 'tickets' | 'lots' | 'default'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  type?: StatCardType
}

const StatCard = ({ title, value, subtitle, type = 'default' }: StatCardProps) => {
  // Cores de fundo para os ícones
  const iconStyles = {
    money: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      iconColor: 'text-green-700'
    },
    tickets: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      iconColor: 'text-blue-700'
    },
    lots: {
      bg: 'bg-amber-100',
      border: 'border-amber-300',
      iconColor: 'text-amber-700'
    },
    default: {
      bg: 'bg-beige-light',
      border: 'border-brown/30',
      iconColor: 'text-brown'
    }
  }

  // Ícones estilo Cordel para cada tipo
  const getIcon = () => {
    const iconStyle = iconStyles[type]
    const iconClass = `w-8 h-8 ${iconStyle.iconColor}`
    
    switch (type) {
      case 'money':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        )
      case 'tickets':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path>
            <path d="M13 5v2"></path>
            <path d="M13 17v2"></path>
            <path d="M13 11v2"></path>
          </svg>
        )
      case 'lots':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <line x1="15" y1="3" x2="15" y2="21"></line>
            <line x1="3" y1="9" x2="21" y2="9"></line>
            <line x1="3" y1="15" x2="21" y2="15"></line>
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={iconClass}>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        )
    }
  }

  const iconStyle = iconStyles[type]

  return (
    <div className="bg-white border border-gray-300 p-4 transition-all cursor-default shadow-sm hover:shadow-md hover:translate-x-[1px] hover:translate-y-[1px]">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h3 className="text-black font-semibold text-sm mb-1">{title}</h3>
          <p className="text-brown text-2xl font-bold">{value}</p>
          {subtitle && (
            <p className="text-black/60 text-xs mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`${iconStyle.bg} ${iconStyle.border} border rounded p-2 flex-shrink-0 ml-2 flex items-center justify-center`}>
          {getIcon()}
        </div>
      </div>
    </div>
  )
}

export default StatCard

