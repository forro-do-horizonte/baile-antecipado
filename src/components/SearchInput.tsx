import { useState, useEffect } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  placeholderTexts?: string[]
  placeholderInterval?: number
  className?: string
}

const SearchInput = ({ 
  value, 
  onChange, 
  placeholder,
  placeholderTexts = [],
  placeholderInterval = 5000,
  className = ''
}: SearchInputProps) => {
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [charIndex, setCharIndex] = useState(0)

  // Se não houver textos dinâmicos, usar placeholder estático
  const texts = placeholderTexts.length > 0 ? placeholderTexts : (placeholder ? [placeholder] : ['Pesquisar...'])

  useEffect(() => {
    if (placeholderTexts.length === 0 && placeholder) {
      // Se não houver textos dinâmicos, usar placeholder estático
      setDisplayedPlaceholder(placeholder)
      return
    }

    if (placeholderTexts.length === 0) {
      return
    }

    const currentText = texts[currentTextIndex]
    
    if (isTyping) {
      // Efeito de digitação (entrando)
      if (charIndex < currentText.length) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(currentText.substring(0, charIndex + 1))
          setCharIndex(charIndex + 1)
        }, 80) // Velocidade de digitação (80ms por letra)
        
        return () => clearTimeout(timeout)
      } else {
        // Texto completo, aguardar antes de apagar
        const waitTimeout = setTimeout(() => {
          setIsTyping(false)
        }, placeholderInterval)
        
        return () => clearTimeout(waitTimeout)
      }
    } else {
      // Efeito de apagar (saindo)
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayedPlaceholder(currentText.substring(0, charIndex - 1))
          setCharIndex(charIndex - 1)
        }, 50) // Velocidade de apagar (50ms por letra)
        
        return () => clearTimeout(timeout)
      } else {
        // Texto apagado, mudar para próximo texto
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
        setIsTyping(true)
      }
    }
  }, [charIndex, isTyping, currentTextIndex, texts, placeholderInterval, placeholderTexts.length, placeholder])

  return (
    <div className={`relative flex-1 w-full ${className}`}>
      <input
        type="text"
        placeholder={displayedPlaceholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  )
}

export default SearchInput

