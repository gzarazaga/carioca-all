import { Pressable, Text, View } from 'react-native'
import Animated from 'react-native-reanimated'
import { useGameStore, useIsMyTurn } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import { usePulse } from '../../hooks/usePulse'
import { colors } from '../../theme'
import Card from '../card/Card'

export default function DiscardPile() {
  const topCard = useGameStore((s) => s.estado?.cartaSuperiorDescarte)
  const estadoTurno = useGameStore((s) => s.estado?.estadoTurno)
  const isMyTurn = useIsMyTurn()
  const loading = useGameStore((s) => s.loading)
  const { robar } = useGameActions()

  const canDraw = Boolean(isMyTurn && estadoTurno === 'ESPERANDO_ROBAR' && !loading && topCard)
  const glowStyle = usePulse(canDraw)

  return (
    <Animated.View
      style={[
        { borderRadius: 16, shadowColor: colors.warning[400], shadowOffset: { width: 0, height: 0 } },
        glowStyle,
      ]}
    >
      <Pressable
        onPress={() => canDraw && robar(false)}
        disabled={!canDraw}
        className="items-center gap-1.5 p-2.5 rounded-2xl"
        style={canDraw ? { borderWidth: 2, borderColor: 'rgba(237,180,23,0.6)' } : undefined}
      >
        {topCard ? (
          <Card carta={topCard} />
        ) : (
          <View className="w-16 h-24 rounded-lg border-2 border-dashed border-felt-600 items-center justify-center">
            <Text className="text-felt-600 text-xs">Vacío</Text>
          </View>
        )}
        <Text className="text-xs text-felt-300">Descarte</Text>
        {canDraw && <Text className="text-xs text-warning-300">Tocá para tomar</Text>}
      </Pressable>
    </Animated.View>
  )
}
