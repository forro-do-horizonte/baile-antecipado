import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface UserSettings {
  profileImage: string
}

interface UserSettingsContextType {
  settings: UserSettings
  updateSettings: (newSettings: Partial<UserSettings>) => void
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined)

interface UserSettingsProviderProps {
  children: ReactNode
}

export const UserSettingsProvider = ({ children }: UserSettingsProviderProps) => {
  const [settings, setSettings] = useState<UserSettings>({
    profileImage: ''
  })

  // Carregar configurações do localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings')
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings))
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      }
    }
  }, [])

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings }
      localStorage.setItem('userSettings', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <UserSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext)
  if (context === undefined) {
    throw new Error('useUserSettings deve ser usado dentro de um UserSettingsProvider')
  }
  return context
}

