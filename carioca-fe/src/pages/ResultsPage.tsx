import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGameStore } from '../stores/gameStore'
import * as api from '../services/api'
import { clearSession, loadSession } from '../utils/storage'
import Scoreboard from '../components/common/Scoreboard'
import Button from '../components/common/Button'
import { TrophyIcon, SparkIcon } from '../components/common/icons'
import AdUnit from '../components/common/AdUnit'

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
    <div className="min-h-screen bg-felt-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute -top-56 -left-40 w-[620px] h-[620px] rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-primary-600) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-60 -right-44 w-[640px] h-[640px] rounded-full opacity-25 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, var(--color-warning-500) 0%, transparent 70%)' }}
      />
      <div className="max-w-md w-full space-y-6 text-center relative z-10">
        <h1 className="font-display font-extrabold text-3xl flex items-center justify-center gap-2.5 text-warning-400">
          {isWinner ? <SparkIcon className="w-7 h-7" /> : <TrophyIcon className="w-7 h-7" />}
          {isWinner ? 'Ganaste!' : 'Fin de la partida'}
        </h1>

        {ganador && (
          <p className="text-xl text-warning-300">
            Ganador: <strong>{ganador.nombre}</strong> con {ganador.puntosTotales} puntos
          </p>
        )}

        {estado && (
          <div className="flex justify-center">
            <Scoreboard jugadores={estado.jugadores} ganadorId={estado.ganadorId} />
          </div>
        )}

        <Button onClick={handleNewGame} variant="primary" size="lg" className="w-full">
          Nueva partida
        </Button>

        <AdUnit slot="7779352396" />
      </div>
    </div>
  )
}
