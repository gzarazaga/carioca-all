import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import * as api from '../services/api'
import { clearSession, loadSession } from '../utils/storage'
import Scoreboard from '../components/common/Scoreboard'

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const estado = useGameStore((s) => s.estado)
  const setEstado = useGameStore((s) => s.setEstado)
  const setSession = useGameStore((s) => s.setSession)
  const partidaId = useGameStore((s) => s.partidaId)
  const jugadorId = useGameStore((s) => s.jugadorId)
  const reset = useGameStore((s) => s.reset)

  // Restore session if needed
  useEffect(() => {
    if (!partidaId && id) {
      const session = loadSession()
      if (session && session.partidaId === id) {
        setSession(session.partidaId, session.jugadorId, session.nombreJugador)
      }
    }
  }, [partidaId, id, setSession])

  // Fetch final state
  useEffect(() => {
    if (!id) return
    api.obtenerEstado(id).then(setEstado).catch(() => {})
  }, [id, setEstado])

  const ganador = estado?.jugadores.find((j) => j.id === estado?.ganadorId)
  const isWinner = estado?.ganadorId === jugadorId

  const handleNewGame = () => {
    clearSession()
    reset()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-green-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <h1 className="text-4xl font-bold">
          {isWinner ? '🎉 Ganaste!' : '🏆 Fin de la partida'}
        </h1>

        {ganador && (
          <p className="text-xl text-yellow-300">
            Ganador: <strong>{ganador.nombre}</strong> con {ganador.puntosTotales} puntos
          </p>
        )}

        {estado && (
          <div className="flex justify-center">
            <Scoreboard jugadores={estado.jugadores} ganadorId={estado.ganadorId} />
          </div>
        )}

        <button
          onClick={handleNewGame}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-colors"
        >
          Nueva partida
        </button>
      </div>
    </div>
  )
}
