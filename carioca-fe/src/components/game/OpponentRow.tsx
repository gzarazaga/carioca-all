import { useOpponents, useGameStore } from '../../stores/gameStore'
import CardBack from '../card/CardBack'

export default function OpponentRow() {
  const opponents = useOpponents()
  const currentPlayerId = useGameStore((s) => s.estado?.jugadorActualId)

  return (
    <div className="flex gap-6 justify-center flex-wrap">
      {opponents.map((opp) => {
        const isCurrent = opp.id === currentPlayerId
        return (
          <div
            key={opp.id}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              isCurrent ? 'ring-2 ring-yellow-400 bg-green-800/60' : ''
            }`}
          >
            <div className="text-sm font-bold">
              {opp.nombre}
              {!opp.conectado && <span className="text-red-400 ml-1">(offline)</span>}
            </div>
            <div className="flex -space-x-3">
              {Array.from({ length: Math.min(opp.cartasEnMano, 6) }).map((_, i) => (
                <CardBack key={i} small />
              ))}
              {opp.cartasEnMano > 6 && (
                <span className="text-xs self-center ml-2">+{opp.cartasEnMano - 6}</span>
              )}
            </div>
            <div className="text-xs text-green-300">
              {opp.cartasEnMano} cartas · {opp.puntosTotales} pts
              {opp.haBajado && <span className="text-yellow-300 ml-1">· Bajado</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
