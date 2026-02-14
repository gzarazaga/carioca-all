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
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
        canDraw
          ? 'hover:bg-green-700/50 cursor-pointer ring-2 ring-yellow-400/60'
          : 'cursor-default'
      }`}
    >
      {topCard ? (
        <Card carta={topCard} />
      ) : (
        <div className="w-16 h-24 rounded-lg border-2 border-dashed border-green-600 flex items-center justify-center text-green-600 text-xs">
          Vacío
        </div>
      )}
      <span className="text-xs text-green-300">Descarte</span>
      {canDraw && <span className="text-xs text-yellow-300">Click para tomar</span>}
    </button>
  )
}
