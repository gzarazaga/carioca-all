import type { Carta } from '../../types/game'
import Card from './Card'

interface Props {
  cartas: Carta[]
  selectedIds: string[]
  onCardClick?: (cardId: string) => void
}

export default function CardHand({ cartas, selectedIds, onCardClick }: Props) {
  const total = cartas.length
  const maxSpread = 40
  const spreadAngle = Math.min(maxSpread, total * 3)

  return (
    <div className="flex items-end justify-center min-h-[120px] relative">
      {cartas.map((carta, i) => {
        const angle = total > 1
          ? -spreadAngle / 2 + (i / (total - 1)) * spreadAngle
          : 0
        const offsetY = Math.abs(angle) * 0.3

        return (
          <div
            key={carta.id}
            className="transition-all duration-200"
            style={{
              transform: `rotate(${angle}deg) translateY(${offsetY}px)`,
              marginLeft: i === 0 ? 0 : '-20px',
              zIndex: i,
            }}
          >
            <Card
              carta={carta}
              selected={selectedIds.includes(carta.id)}
              onClick={onCardClick ? () => onCardClick(carta.id) : undefined}
            />
          </div>
        )
      })}
    </div>
  )
}
