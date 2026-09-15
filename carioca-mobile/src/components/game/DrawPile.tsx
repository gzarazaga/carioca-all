import { Pressable, Text } from 'react-native'
import Animated from 'react-native-reanimated'
import { useGameStore, useIsMyTurn } from '../../stores/gameStore'
import { useGameActions } from '../../hooks/useGameActions'
import { usePulse } from '../../hooks/usePulse'
import { colors } from '../../theme'
import CardBack from '../card/CardBack'

export default function DrawPile() {
  const cartasEnMazo = useGameStore((s) => s.estado?.cartasEnMazo ?? 0)
  const estadoTurno = useGameStore((s) => s.estado?.estadoTurno)
  const isMyTurn = useIsMyTurn()
  const loading = useGameStore((s) => s.loading)
  const { robar } = useGameActions()

  const canDraw = isMyTurn && estadoTurno === 'ESPERANDO_ROBAR' && !loading
  const glowStyle = usePulse(canDraw)

  return (
    <Animated.View
      style={[
        { borderRadius: 16, shadowColor: colors.warning[400], shadowOffset: { width: 0, height: 0 } },
        glowStyle,
      ]}
    >
      <Pressable
        onPress={() => canDraw && robar(true)}
        disabled={!canDraw}
        className="items-center gap-1.5 p-2.5 rounded-2xl"
        style={[
          canDraw && { borderWidth: 2, borderColor: 'rgba(237,180,23,0.6)' },
          !canDraw && { opacity: 0.7 },
        ]}
      >
        <CardBack />
        <Text className="text-xs text-felt-300">{cartasEnMazo} cartas</Text>
        {canDraw && <Text className="text-xs text-warning-300">Tocá para robar</Text>}
      </Pressable>
    </Animated.View>
  )
}
