import { useGameStore, useIsMyTurn } from '../../stores/gameStore'

export default function TurnIndicator() {
  const estado = useGameStore((s) => s.estado)
  const isMyTurn = useIsMyTurn()

  if (!estado || estado.estado !== 'EN_CURSO') return null

  const turnLabel = estado.estadoTurno === 'ESPERANDO_ROBAR'
    ? 'debe robar'
    : 'debe descartar'

  return (
    <div
      className={`rounded-xl px-5 py-2.5 text-center font-display font-semibold text-sm ${
        isMyTurn
          ? 'bg-gradient-to-r from-warning-500 to-warning-600 text-felt-900 pulse-amber'
          : 'glass-panel'
      }`}
    >
      {isMyTurn
        ? `Tu turno — ${turnLabel}`
        : `Turno de ${estado.jugadorActualNombre}`
      }
    </div>
  )
}
