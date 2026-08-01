import { View } from 'react-native'
import type { Carta } from '../../types/game'
import Card from './Card'

interface Props {
  cartas: Carta[]
  selectedIds: string[]
  onCardPress?: (cardId: string) => void
}

export default function CardHand({ cartas, selectedIds, onCardPress }: Props) {
  const total = cartas.length
  const maxSpread = 40
  const spreadAngle = Math.min(maxSpread, total * 3)

  return (
    <View className="flex-row items-end justify-center min-h-[120px]">
      {cartas.map((carta, i) => {
        const angle = total > 1
          ? -spreadAngle / 2 + (i / (total - 1)) * spreadAngle
          : 0
        const offsetY = Math.abs(angle) * 0.3

        return (
          <View
            key={carta.id}
            style={{
              transform: [{ rotate: `${angle}deg` }, { translateY: offsetY }],
              marginLeft: i === 0 ? 0 : -20,
              zIndex: i,
            }}
          >
            <Card
              carta={carta}
              selected={selectedIds.includes(carta.id)}
              onPress={onCardPress ? () => onCardPress(carta.id) : undefined}
            />
          </View>
        )
      })}
    </View>
  )
}
