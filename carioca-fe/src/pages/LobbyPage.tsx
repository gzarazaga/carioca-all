import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { useWebSocket } from '../hooks/useWebSocket'
import * as api from '../services/api'
import { loadSession } from '../utils/storage'
import PlayerList from '../components/lobby/PlayerList'
import GameCode from '../components/lobby/GameCode'

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
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-1">🃏 Sala de espera</h1>
          <p className="text-green-300">Esperando jugadores...</p>
        </div>

        {id && <GameCode partidaId={id} />}

        {estado && (
          <PlayerList jugadores={estado.jugadores} currentPlayerId={jugadorId} />
        )}

        <button
          onClick={handleStart}
          disabled={!canStart}
          className="w-full px-4 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-lg disabled:opacity-50 transition-colors"
        >
          {canStart ? 'Iniciar partida' : 'Esperando mas jugadores...'}
        </button>

        <button
          onClick={() => navigate('/')}
          className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
