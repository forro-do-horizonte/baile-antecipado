import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { EventsProvider } from './contexts/EventsContext'
import { UserSettingsProvider } from './contexts/UserSettingsContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <EventsProvider>
        <UserSettingsProvider>
          <App />
        </UserSettingsProvider>
      </EventsProvider>
    </AuthProvider>
  </React.StrictMode>,
)

