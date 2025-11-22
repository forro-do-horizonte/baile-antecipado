import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EventDetail from './pages/EventDetail'
import Login from './pages/Login'
import DashboardEmpresa from './pages/DashboardEmpresa'
import DashboardUsuario from './pages/DashboardUsuario'
import EditEvent from './pages/EditEvent'
import EventDashboard from './pages/EventDashboard'
import Settings from './pages/Settings'
import ProtectedRoute from './components/ProtectedRoute'
import { PrimaryActionProvider } from './contexts/PrimaryActionContext'
import { EventModalProvider } from './contexts/EventModalContext'
import { ConfirmModalProvider, useConfirmModal } from './contexts/ConfirmModalContext'
import EventModal from './components/EventModal'
import ConfirmModal from './components/ConfirmModal'

function App() {
  return (
    <Router>
      <EventModalProvider>
        <ConfirmModalProvider>
          <PrimaryActionProvider>
            <EventModal />
            <ConfirmModalWrapper />
            <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/evento/:eventId" element={<EventDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/empresa"
          element={
            <ProtectedRoute requiredRole="empresa">
              <DashboardEmpresa />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/empresa/evento/:eventId"
          element={
            <ProtectedRoute requiredRole="empresa">
              <EventDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/empresa/evento/:eventId/editar"
          element={
            <ProtectedRoute requiredRole="empresa">
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/empresa/evento/novo"
          element={
            <ProtectedRoute requiredRole="empresa">
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/empresa/configuracoes"
          element={
            <ProtectedRoute requiredRole="empresa">
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/usuario"
          element={
            <ProtectedRoute requiredRole="usuario">
              <DashboardUsuario />
            </ProtectedRoute>
          }
        />
            </Routes>
          </PrimaryActionProvider>
        </ConfirmModalProvider>
      </EventModalProvider>
    </Router>
  )
}

const ConfirmModalWrapper = () => {
  const { isOpen, config, closeModal } = useConfirmModal()
  
  if (!config) return null
  
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={closeModal}
      onConfirm={config.onConfirm}
      title={config.title}
      message={config.message}
      confirmLabel={config.confirmLabel}
      cancelLabel={config.cancelLabel}
      confirmVariant={config.confirmVariant}
      cancelVariant={config.cancelVariant}
    />
  )
}

export default App

