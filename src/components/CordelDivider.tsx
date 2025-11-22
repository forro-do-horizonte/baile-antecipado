import React from 'react'

interface CordelDividerProps {
  height?: string
}

const CordelDivider = ({ height = '1rem' }: CordelDividerProps) => {
  // Ícones SVG no estilo cordel/nordestino - definidos como componentes de função
  const SanfonaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
      <rect x="4" y="6" width="16" height="12" rx="2" fill="currentColor" />
      <rect x="6" y="8" width="12" height="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="10" x2="8" y2="14" stroke="currentColor" strokeWidth="1" />
      <line x1="12" y1="10" x2="12" y2="14" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="10" x2="16" y2="14" stroke="currentColor" strokeWidth="1" />
    </svg>
  )

  const PandeiroIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
      <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
      <circle cx="6" cy="18" r="1.5" fill="currentColor" />
      <circle cx="18" cy="18" r="1.5" fill="currentColor" />
    </svg>
  )

  const TrianguloIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 4 L20 18 L4 18 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <line x1="12" y1="4" x2="12" y2="18" stroke="currentColor" strokeWidth="1" />
    </svg>
  )

  const RabecaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
      <ellipse cx="8" cy="16" rx="3" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="4" width="4" height="12" rx="1" fill="currentColor" />
      <line x1="7" y1="8" x2="7" y2="14" stroke="white" strokeWidth="0.5" />
      <line x1="9" y1="8" x2="9" y2="14" stroke="white" strokeWidth="0.5" />
      <line x1="11" y1="8" x2="11" y2="14" stroke="white" strokeWidth="0.5" />
    </svg>
  )

  const ViolinoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8 2 L8 22 M16 2 L16 22" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="12" cy="12" rx="4" ry="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="10" y1="8" x2="10" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="14" y1="8" x2="14" y2="16" stroke="currentColor" strokeWidth="1" />
    </svg>
  )

  const FlautaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="8" width="12" height="2" rx="1" fill="currentColor" />
      <circle cx="9" cy="9" r="1" fill="white" />
      <circle cx="12" cy="9" r="1" fill="white" />
      <circle cx="15" cy="9" r="1" fill="white" />
    </svg>
  )

  const BateriaIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <ellipse cx="8" cy="14" rx="3" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="16" cy="14" rx="3" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="7" y="6" width="2" height="8" fill="currentColor" />
      <rect x="15" y="6" width="2" height="8" fill="currentColor" />
    </svg>
  )

  const BandeirolaIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4 L20 4 L16 12 L20 20 L4 20 Z" fill="currentColor" />
      <line x1="8" y1="8" x2="8" y2="16" stroke="white" strokeWidth="0.5" />
      <line x1="12" y1="8" x2="12" y2="16" stroke="white" strokeWidth="0.5" />
      <line x1="16" y1="8" x2="16" y2="16" stroke="white" strokeWidth="0.5" />
    </svg>
  )

  const ZabumbaIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <ellipse cx="12" cy="12" rx="6" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="10" x2="8" y2="14" stroke="currentColor" strokeWidth="1" />
      <line x1="16" y1="10" x2="16" y2="14" stroke="currentColor" strokeWidth="1" />
    </svg>
  )

  const CavaquinhoIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
      <ellipse cx="10" cy="16" rx="3" ry="4" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="8" y="4" width="4" height="12" rx="1" fill="currentColor" />
      <line x1="9" y1="8" x2="9" y2="14" stroke="white" strokeWidth="0.5" />
      <line x1="11" y1="8" x2="11" y2="14" stroke="white" strokeWidth="0.5" />
    </svg>
  )

  const iconComponents = [
    SanfonaIcon,
    PandeiroIcon,
    TrianguloIcon,
    RabecaIcon,
    ViolinoIcon,
    FlautaIcon,
    BateriaIcon,
    BandeirolaIcon,
    ZabumbaIcon,
    CavaquinhoIcon
  ]

  // Calcular quantos ícones são necessários para preencher toda a largura da viewport
  // Cada ícone tem aproximadamente 1.5rem (24px) + gap de 0.25rem (4px) = ~28px
  // Para uma tela de 1920px, precisamos de aproximadamente 68 ícones
  const [numberOfIcons, setNumberOfIcons] = React.useState(100)

  React.useEffect(() => {
    const calculateIcons = () => {
      const viewportWidth = window.innerWidth
      const iconWidth = 24 // 1.5rem em pixels
      const gap = 4 // 0.25rem em pixels
      const totalWidth = iconWidth + gap
      // Calcular ícones suficientes para cobrir 2x a viewport (para animação contínua)
      const icons = Math.ceil((viewportWidth * 2) / totalWidth) + 20 // +20 para garantir movimento contínuo
      setNumberOfIcons(icons)
    }

    calculateIcons()
    window.addEventListener('resize', calculateIcons)
    return () => window.removeEventListener('resize', calculateIcons)
  }, [])

  // Repetir ícones para criar uma linha contínua
  const repeatedIcons = Array.from({ length: numberOfIcons }, (_, i) => iconComponents[i % iconComponents.length])

  const iconHeight = height === '100%' ? '1rem' : height

  return (
    <div 
      style={{ 
        position: 'absolute',
        left: 0,
        width: '100vw',
        height: iconHeight,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        marginLeft: 'calc(-50vw + 50%)'
      }}
    >
      <div 
        className="flex items-center justify-start gap-1 animate-scroll-left"
        style={{ 
          height: iconHeight,
          width: '200vw',
          position: 'absolute',
          left: '0vw'
        }}
      >
      {/* Duplicar ícones para animação contínua */}
      {[...repeatedIcons, ...repeatedIcons].map((IconComponent, index) => {
        const Icon = IconComponent
        return (
          <div 
            key={index}
            className="flex-shrink-0 flex items-center justify-center"
            style={{ 
              width: '1.5rem', 
              height: iconHeight,
              color: 'rgba(61, 40, 23, 0.85)' // Suavizar cor em 15% (de 100% para 85%)
            }}
          >
            <div style={{ width: '1.2rem', height: '1.2rem', minWidth: '1.2rem', minHeight: '1.2rem' }}>
              <Icon />
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default CordelDivider
