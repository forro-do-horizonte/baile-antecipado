import CordelDivider from './CordelDivider'

interface CordelTitleSectionProps {
  title: string
  className?: string
}

const CordelTitleSection = ({ title, className = '' }: CordelTitleSectionProps) => {
  return (
    <div className={`relative mb-6 mt-6 flex items-center justify-center w-full overflow-visible ${className}`} style={{ position: 'relative' }}>
      <h2 
        className="text-2xl font-bold text-brown text-center relative inline-block z-10 animate-pulse-scale" 
        style={{ fontFamily: 'SpecialElite, serif' }}
      >
        <span className="relative z-10 px-4 inline-block" style={{ backgroundColor: '#F5F1E8' }}>
          {title.toUpperCase()}
        </span>
      </h2>
      {/* Linha de ícones que quebra o padding */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 z-0" 
        style={{ 
          height: '1rem',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          marginLeft: 'calc(-50vw + 50%)',
          marginRight: 'calc(-50vw + 50%)',
          position: 'absolute',
          overflow: 'visible',
          pointerEvents: 'none'
        }}
      >
        <CordelDivider height="1rem" />
      </div>
    </div>
  )
}

export default CordelTitleSection

