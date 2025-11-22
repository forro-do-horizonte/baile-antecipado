import { createContext, useContext, useState, ReactNode } from 'react'

interface ConfirmModalConfig {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: 'primary' | 'secondary' | 'tertiary'
  cancelVariant?: 'primary' | 'secondary' | 'tertiary' | 'sextiary'
  onConfirm: () => void
}

interface ConfirmModalContextType {
  isOpen: boolean
  config: ConfirmModalConfig | null
  openModal: (config: ConfirmModalConfig) => void
  closeModal: () => void
}

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(undefined)

interface ConfirmModalProviderProps {
  children: ReactNode
}

export const ConfirmModalProvider = ({ children }: ConfirmModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ConfirmModalConfig | null>(null)

  const openModal = (newConfig: ConfirmModalConfig) => {
    setConfig(newConfig)
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setConfig(null)
  }

  return (
    <ConfirmModalContext.Provider value={{ isOpen, config, openModal, closeModal }}>
      {children}
    </ConfirmModalContext.Provider>
  )
}

export const useConfirmModal = () => {
  const context = useContext(ConfirmModalContext)
  if (context === undefined) {
    throw new Error('useConfirmModal deve ser usado dentro de um ConfirmModalProvider')
  }
  return context
}

