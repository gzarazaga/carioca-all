import { Text, View } from 'react-native'
import { useGameStore } from '../../stores/gameStore'
import CardHand from '../card/CardHand'

export default function PlayerHand() {
  const misCartas = useGameStore((s) => s.misCartas)
  const selectedCardIds = useGameStore((s) => s.selectedCardIds)
  const toggleCardSelection = useGameStore((s) => s.toggleCardSelection)

  if (misCartas.length === 0) return null

  return (
    <View className="w-full">
      <Text className="text-[11px] text-felt-300 text-center mb-1.5">
        Tu mano ({misCartas.length} cartas)
        {selectedCardIds.length > 0 && (
          <Text className="text-pink-400 font-body-semibold"> {selectedCardIds.length} seleccionada{selectedCardIds.length > 1 ? 's' : ''}</Text>
        )}
      </Text>
      <CardHand
        cartas={misCartas}
        selectedIds={selectedCardIds}
        onCardPress={toggleCardSelection}
      />
    </View>
  )
}
