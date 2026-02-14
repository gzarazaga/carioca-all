import { useGameStore, useIsMyTurn } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import CardBack from '../card/CardBack'

export default function DrawPile() {
  const cartasEnMazo = useGameStore((s) => s.estado?.cartasEnMazo ?? 0)
  const estadoTurno = useGameStore((s) => s.estado?.estadoTurno)
  const isMyTurn = useIsMyTurn()
  const loading = useGameStore((s) => s.loading)
  const { robar } = useGameActions()

  const canDraw = isMyTurn && estadoTurno === 'ESPERANDO_ROBAR' && !loading

  return (
    <button
      onClick={() => canDraw && robar(true)}
      disabled={!canDraw}
      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
        canDraw
          ? 'hover:bg-green-700/50 cursor-pointer ring-2 ring-yellow-400/60'
          : 'opacity-70 cursor-default'
      }`}
    >
      <CardBack />
      <span className="text-xs text-green-300">{cartasEnMazo} cartas</span>
      {canDraw && <span className="text-xs text-yellow-300">Click para robar</span>}
    </button>
  )
}
