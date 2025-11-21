import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserSettings } from '../contexts/UserSettingsContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Button from '../components/Button'

const Settings = () => {
  const navigate = useNavigate()
  const { settings, updateSettings } = useUserSettings()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateSettings({ profileImage: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          {/* Cabeçalho */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/dashboard/empresa')}
              className="text-brown hover:text-primary mb-4 text-sm font-medium"
            >
              ← Voltar para Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brown">
              Configurações
            </h1>
          </div>

          {/* Formulário */}
          <div className="space-y-6">
            <div className="bg-beige-light border-2 border-brown p-6">
              <h2 className="text-xl font-serif font-bold text-brown mb-4">
                Foto de Perfil
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Preview da foto */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-brown">
                    {settings.profileImage ? (
                      <img
                        src={settings.profileImage}
                        alt="Perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-brown flex items-center justify-center text-white text-4xl font-bold">
                        U
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload */}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 text-sm w-auto"
                  >
                    Escolher Foto
                  </Button>
                  <p className="text-sm text-brown/70 mt-2">
                    Selecione uma imagem para usar como foto de perfil
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Settings

