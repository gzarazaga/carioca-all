import { useGameStore, useIsMyTurn } from '../../stores/gameStore'

export default function TurnIndicator() {
  const estado = useGameStore((s) => s.estado)
  const isMyTurn = useIsMyTurn()

  if (!estado || estado.estado !== 'EN_CURSO') return null

  const turnLabel = estado.estadoTurno === 'ESPERANDO_ROBAR'
    ? 'debe robar'
    : 'debe descartar'

  return (
    <div className={`rounded-lg px-4 py-2 text-center font-bold ${
      isMyTurn ? 'bg-yellow-500 text-black animate-pulse' : 'bg-green-800/80'
    }`}>
      {isMyTurn
        ? `Tu turno — ${turnLabel}`
        : `Turno de ${estado.jugadorActualNombre}`
      }
    </div>
  )
}
