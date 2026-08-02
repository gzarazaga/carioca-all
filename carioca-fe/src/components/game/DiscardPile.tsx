import { useGameStore, useIsMyTurn } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Card from '../card/Card'

export default function DiscardPile() {
  const topCard = useGameStore((s) => s.estado?.cartaSuperiorDescarte)
  const estadoTurno = useGameStore((s) => s.estado?.estadoTurno)
  const isMyTurn = useIsMyTurn()
  const loading = useGameStore((s) => s.loading)
  const { robar } = useGameActions()

  const canDraw = isMyTurn && estadoTurno === 'ESPERANDO_ROBAR' && !loading && topCard

  return (
    <button
      onClick={() => canDraw && robar(false)}
      disabled={!canDraw}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 ${
        canDraw
          ? 'hover:bg-felt-700/50 cursor-pointer ring-2 ring-warning-400/60'
          : 'cursor-default'
      }`}
    >
      {topCard ? (
        <Card carta={topCard} />
      ) : (
        <div className="w-16 h-24 rounded-lg border-2 border-dashed border-felt-600 flex items-center justify-center text-felt-600 text-xs">
          Vacío
        </div>
      )}
      <span className="text-xs text-felt-300">Descarte</span>
      {canDraw && <span className="text-xs text-warning-300">Click para tomar</span>}
    </button>
  )
}
