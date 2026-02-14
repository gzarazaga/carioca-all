import { useGameStore } from '../../stores/gameStore'
import CardHand from '../card/CardHand'

export default function PlayerHand() {
  const misCartas = useGameStore((s) => s.misCartas)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const toggleCardSelection = useGameStore((s) => s.toggleCardSelection)

  if (misCartas.length === 0) return null

  return (
    <div className="w-full">
      <div className="text-xs text-green-300 text-center mb-1">
        Tu mano ({misCartas.length} cartas)
        {selectedCardIds.length > 0 && (
          <span className="ml-2 text-blue-300">
            {selectedCardIds.length} seleccionada{selectedCardIds.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <CardHand
        cartas={misCartas}
        selectedIds={selectedCardIds}
        onCardClick={toggleCardSelection}
      />
    </div>
  )
}
