import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import { useWebSocket } from '../hooks/useWebSocket'
import { useGameActions } from '../hooks/useGameActions'
import { loadSession } from '../utils/storage'
import GameBoard from '../components/game/GameBoard'
import ActionBar from '../components/actions/ActionBar'
import FormationBuilder from '../components/actions/FormationBuilder'
import PegarDialog from '../components/actions/PegarDialog'
import Scoreboard from '../components/common/Scoreboard'

export default function GamePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const estado = useGameStore((s) => s.estado)
  const partidaId = useGameStore((s) => s.partidaId)
  const setSession = useGameStore((s) => s.setSession)
  const roundEndInfo = useGameStore((s) => s.roundEndInfo)
  const setRoundEndInfo = useGameStore((s) => s.setRoundEndInfo)
  const gameEndInfo = useGameStore((s) => s.gameEndInfo)

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

  // Connect WebSocket + initial fetch
  useWebSocket()
  const { refresh } = useGameActions()

  useEffect(() => {
    if (partidaId) refresh()
  }, [partidaId, refresh])

  // Redirect when game ends
  useEffect(() => {
    if (estado?.estado === 'FINALIZADA' || gameEndInfo) {
      const timer = setTimeout(() => navigate(`/results/${id}`), 3000)
      return () => clearTimeout(timer)
    }
  }, [estado?.estado, gameEndInfo, id, navigate])

  return (
    <div className="min-h-screen bg-green-900 relative">
      <GameBoard />
      <ActionBar />
      <FormationBuilder />
      <PegarDialog />

      {/* Round end overlay */}
      {roundEndInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-green-900 border border-green-600 rounded-xl p-6 max-w-md w-full text-center">
            <h2 className="text-2xl font-bold mb-4">Ronda terminada!</h2>
            {estado && (
              <Scoreboard jugadores={estado.jugadores} ganadorId={roundEndInfo.ganadorId} />
            )}
            <button
              onClick={() => setRoundEndInfo(null)}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      )}

      {/* Game end overlay */}
      {gameEndInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-green-900 border border-yellow-500 rounded-xl p-6 max-w-md w-full text-center">
            <h2 className="text-3xl font-bold mb-2">🏆 Partida terminada!</h2>
            <p className="text-green-300 mb-4">Redirigiendo a resultados...</p>
            {estado && (
              <Scoreboard jugadores={estado.jugadores} ganadorId={gameEndInfo.ganadorId} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
