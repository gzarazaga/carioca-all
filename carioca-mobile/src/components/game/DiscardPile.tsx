import { View, Text, Pressable } from 'react-native'
import { useGameStore, useIsMyTurn } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import Card from '../card/Card'

export default function DiscardPile() {
  const topCard = useGameStore((s) => s.estado?.cartaSuperiorDescarte)
  const estadoTurno = useGameStore((s) => s.estado?.estadoTurno)
  const isMyTurn = useIsMyTurn()
  const loading = useGameStore((s) => s.loading)
  const { robar } = useGameActions()

  const canDraw = Boolean(isMyTurn && estadoTurno === 'ESPERANDO_ROBAR' && !loading && topCard)

  return (
    <Pressable
      onPress={() => canDraw && robar(false)}
      disabled={!canDraw}
      className={`items-center gap-1 p-2 rounded-lg ${canDraw ? 'border-2 border-yellow-400/60' : ''}`}
    >
      {topCard ? (
        <Card carta={topCard} />
      ) : (
        <View className="w-16 h-24 rounded-lg border-2 border-dashed border-green-600 items-center justify-center">
          <Text className="text-green-600 text-xs">Vacío</Text>
        </View>
      )}
      <Text className="text-xs text-green-300">Descarte</Text>
      {canDraw && <Text className="text-xs text-yellow-300">Tocá para tomar</Text>}
    </Pressable>
  )
}
