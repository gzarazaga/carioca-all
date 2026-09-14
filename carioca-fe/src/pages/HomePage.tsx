import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '../services/api'
import { useGameStore } from '../stores/gameStore'
import { saveSession, loadSession, clearSession } from '../utils/storage'
import Button from '../components/common/Button'
import CardBackground from '../components/common/CardBackground'

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
    <div className="min-h-screen bg-felt-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute -top-56 -left-40 w-[620px] h-[620px] rounded-full opacity-40 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-primary-600) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-60 -right-44 w-[640px] h-[640px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-success-600) 0%, transparent 70%)' }}
      />
      <CardBackground />
      <div className="max-w-md w-full glass-panel rounded-2xl p-10 space-y-6 relative z-10 shadow-2xl">
        <div className="text-center flex flex-col items-center gap-2">
          <svg width="38" height="38" viewBox="0 0 38 38" className="mb-1">
            <rect x="3" y="1" width="24" height="34" rx="5" fill="none" stroke="var(--color-pink-500)" strokeWidth="1.6" transform="rotate(-10 15 18)" />
            <rect x="9" y="3" width="24" height="34" rx="5" fill="var(--color-felt-900)" stroke="var(--color-success-600)" strokeWidth="1.6" />
          </svg>
          <h1 className="font-display font-extrabold text-4xl neon-text">Carioca</h1>
          <p className="text-felt-300 text-sm">Juego de cartas para 2-6 jugadores</p>
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-felt-300 mb-2">Tu nombre</label>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
            maxLength={50}
            className="w-full px-4 py-3.5 bg-felt-800/80 border border-felt-600 rounded-xl text-white placeholder:text-felt-500 focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-success-500"
          />
        </div>

        {/* Create game */}
        <Button onClick={handleCreate} disabled={loading} variant="primary" size="lg" className="w-full">
          Crear nueva partida
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-felt-600" />
          <span className="text-felt-400 text-xs uppercase tracking-wider">o unirse a una</span>
          <div className="flex-1 h-px bg-felt-600" />
        </div>

        {/* Join game */}
        <div className="flex gap-2">
          <input
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Codigo de partida"
            className="flex-1 px-4 py-3.5 bg-felt-800/80 border border-felt-600 rounded-xl text-white placeholder:text-felt-500 focus:outline-none focus:ring-2 focus:ring-success-500 focus:border-success-500"
          />
          <Button onClick={handleJoin} disabled={loading} variant="success" size="lg">
            Unirse
          </Button>
        </div>
      </div>
    </div>
  )
}
