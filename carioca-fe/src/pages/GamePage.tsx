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
import Button from '../components/common/Button'
import { TrophyIcon } from '../components/common/icons'

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
    <div className="min-h-screen bg-felt-900 relative overflow-hidden">
      <div
        className="absolute -top-56 -left-40 w-[620px] h-[620px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-primary-600) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-60 -right-44 w-[640px] h-[640px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-success-600) 0%, transparent 70%)' }}
      />
      <div className="relative z-10">
        <GameBoard />
        <ActionBar />
      </div>
      <FormationBuilder />
      <PegarDialog />

      {/* Round end overlay */}
      {roundEndInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel bg-felt-900/95 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl">
            <h2 className="font-display font-semibold text-xl mb-4">Ronda terminada!</h2>
            {estado && (
              <Scoreboard jugadores={estado.jugadores} ganadorId={roundEndInfo.ganadorId} />
            )}
            <Button onClick={() => setRoundEndInfo(null)} variant="primary" size="md" className="mt-4">
              Continuar
            </Button>
          </div>
        </div>
      )}

      {/* Game end overlay */}
      {gameEndInfo && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="glass-panel bg-felt-900/95 rounded-2xl p-6 max-w-md w-full text-center shadow-2xl ring-1 ring-warning-500/50">
            <h2 className="font-display font-bold text-2xl mb-2 flex items-center justify-center gap-2 text-warning-400">
              <TrophyIcon className="w-7 h-7" />
              Partida terminada!
            </h2>
            <p className="text-felt-300 mb-4 text-sm">Redirigiendo a resultados...</p>
            {estado && (
              <Scoreboard jugadores={estado.jugadores} ganadorId={gameEndInfo.ganadorId} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
