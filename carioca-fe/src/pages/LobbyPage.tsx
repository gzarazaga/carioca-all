import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { useWebSocket } from '../hooks/useWebSocket'
import * as api from '../services/api'
import { loadSession } from '../utils/storage'
import PlayerList from '../components/lobby/PlayerList'
import GameCode from '../components/lobby/GameCode'
import Button from '../components/common/Button'
import AdUnit from '../components/common/AdUnit'

export default function LobbyPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const estado = useGameStore((s) => s.estado)
  const partidaId = useGameStore((s) => s.partidaId)
  const jugadorId = useGameStore((s) => s.jugadorId)
  const setSession = useGameStore((s) => s.setSession)
  const setEstado = useGameStore((s) => s.setEstado)
  const addToast = useGameStore((s) => s.addToast)

  // Restore session if needed
  useEffect(() => {
    if (!partidaId && id) {
      const session = loadSession()
      if (session && session.partidaId === id) {
        setSession(session.partidaId, session.jugadorId, session.nombreJugador)
      } else {
        navigate('/')
      }
    }
  }, [partidaId, id, setSession, navigate])

  // Connect WebSocket
  useWebSocket()

  // Initial fetch
  useEffect(() => {
    if (!id) return
    api.obtenerEstado(id).then(setEstado).catch(() => {
      addToast('Error al cargar partida', 'error')
      navigate('/')
    })
  }, [id, setEstado, addToast, navigate])

  // Redirect when game starts
  useEffect(() => {
    if (estado?.estado === 'EN_CURSO') {
      navigate(`/game/${id}`)
    } else if (estado?.estado === 'FINALIZADA') {
      navigate(`/results/${id}`)
    }
  }, [estado?.estado, id, navigate])

  const handleStart = async () => {
    if (!id) return
    try {
      const newEstado = await api.iniciarPartida(id)
      setEstado(newEstado)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al iniciar', 'error')
    }
  }

  const canStart = estado && estado.jugadores.length >= 2

  return (
    <div className="min-h-screen bg-felt-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute -top-56 -left-40 w-[620px] h-[620px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-primary-600) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-60 -right-44 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-success-600) 0%, transparent 70%)' }}
      />
      <div className="max-w-md w-full space-y-6 relative z-10">
        <div className="text-center">
          <h1 className="font-display font-extrabold text-2xl neon-text mb-1">Sala de espera</h1>
          <p className="text-felt-300 text-sm">Esperando jugadores...</p>
        </div>

        {id && <GameCode partidaId={id} />}

        {estado && (
          <PlayerList jugadores={estado.jugadores} currentPlayerId={jugadorId} />
        )}

        <Button onClick={handleStart} disabled={!canStart} variant="warning" size="lg" className="w-full">
          {canStart ? 'Iniciar partida' : 'Esperando mas jugadores...'}
        </Button>

        <Button onClick={() => navigate('/')} variant="neutral" size="md" bold={false} className="w-full">
          Volver al inicio
        </Button>

        <AdUnit slot="1208048497" />
      </div>
    </div>
  )
}
