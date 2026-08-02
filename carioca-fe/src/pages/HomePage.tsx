import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'
import { useGameStore } from '../stores/gameStore'
import { saveSession, loadSession, clearSession } from '../utils/storage'
import Button from '../components/common/Button'

export default function HomePage() {
  const navigate = useNavigate()
  const setSession = useGameStore((s) => s.setSession)
  const addToast = useGameStore((s) => s.addToast)

  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedSession, setSavedSession] = useState(loadSession())

  // Check for existing session on mount
  useEffect(() => {
    const session = loadSession()
    if (session) setSavedSession(session)
  }, [])

  const handleCreate = async () => {
    if (!nombre.trim() || nombre.trim().length < 2) {
      addToast('El nombre debe tener al menos 2 caracteres', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await api.crearPartida(nombre.trim())
      setSession(res.partidaId, res.jugadorId, res.nombreJugador)
      saveSession({ partidaId: res.partidaId, jugadorId: res.jugadorId, nombreJugador: res.nombreJugador })
      navigate(`/lobby/${res.partidaId}`)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al crear partida', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!nombre.trim() || nombre.trim().length < 2) {
      addToast('El nombre debe tener al menos 2 caracteres', 'error')
      return
    }
    if (!codigo.trim()) {
      addToast('Ingresa el codigo de la partida', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await api.unirsePartida(codigo.trim(), nombre.trim())
      setSession(res.partidaId, res.jugadorId, res.nombreJugador)
      saveSession({ partidaId: res.partidaId, jugadorId: res.jugadorId, nombreJugador: res.nombreJugador })
      navigate(`/lobby/${res.partidaId}`)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al unirse', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRejoin = async () => {
    if (!savedSession) return
    setSession(savedSession.partidaId, savedSession.jugadorId, savedSession.nombreJugador)
    try {
      const estado = await api.obtenerEstado(savedSession.partidaId)
      if (estado.estado === 'EN_CURSO') {
        navigate(`/game/${savedSession.partidaId}`)
      } else if (estado.estado === 'FINALIZADA') {
        navigate(`/results/${savedSession.partidaId}`)
      } else {
        navigate(`/lobby/${savedSession.partidaId}`)
      }
    } catch {
      clearSession()
      setSavedSession(null)
      addToast('Sesion anterior no encontrada', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-felt-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2">🃏 Carioca</h1>
          <p className="text-felt-300">Juego de cartas para 2-6 jugadores</p>
        </div>

        {/* Rejoin banner */}
        {savedSession && (
          <div className="bg-warning-600/20 border border-warning-500/40 rounded-lg p-4">
            <p className="text-sm text-warning-200 mb-2">
              Tienes una partida en curso como <strong>{savedSession.nombreJugador}</strong>
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRejoin} variant="warning" size="md">
                Volver a la partida
              </Button>
              <Button
                onClick={() => { clearSession(); setSavedSession(null) }}
                variant="neutral"
                size="md"
              >
                Descartar
              </Button>
            </div>
          </div>
        )}

        {/* Name input */}
        <div>
          <label className="block text-sm text-felt-300 mb-1">Tu nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
            maxLength={50}
            className="w-full px-4 py-3 bg-felt-800 border border-felt-600 rounded-lg text-white placeholder:text-felt-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Create game */}
        <Button onClick={handleCreate} disabled={loading} variant="primary" size="lg" className="w-full">
          Crear nueva partida
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-felt-600" />
          <span className="text-felt-400 text-sm">o unirse a una</span>
          <div className="flex-1 h-px bg-felt-600" />
        </div>

        {/* Join game */}
        <div className="flex gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Codigo de partida"
            className="flex-1 px-4 py-3 bg-felt-800 border border-felt-600 rounded-lg text-white placeholder:text-felt-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button onClick={handleJoin} disabled={loading} variant="success" size="lg">
            Unirse
          </Button>
        </div>
      </div>
    </div>
  )
}
