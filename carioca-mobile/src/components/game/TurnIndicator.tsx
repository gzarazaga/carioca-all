import Animated from 'react-native-reanimated'
import { Text } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useGameStore, useIsMyTurn } from '../../stores/gameStore'
import { usePulse } from '../../hooks/usePulse'
import { colors, fonts } from '../../theme'
import GlassPanel from '../common/GlassPanel'

export default function TurnIndicator() {
  const estado = useGameStore((s) => s.estado)
  const isMyTurn = useIsMyTurn()
  const glowStyle = usePulse(isMyTurn)

  if (!estado || estado.estado !== 'EN_CURSO') return null

  if (!isMyTurn) {
    return (
      <GlassPanel>
        <Text className="font-display-semibold text-sm text-white px-5 py-2.5 text-center">
          {`Turno de ${estado.jugadorActualNombre}`}
        </Text>
      </GlassPanel>
    )
  }

  const turnLabel = estado.estadoTurno === 'ESPERANDO_ROBAR' ? 'debe robar' : 'debe descartar'

  return (
    <Animated.View
      style={[
        { borderRadius: 14, overflow: 'hidden', shadowColor: colors.warning[500], shadowOffset: { width: 0, height: 0 } },
        glowStyle,
      ]}
    >
      <LinearGradient
        colors={[colors.warning[500], colors.warning[600]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ paddingHorizontal: 20, paddingVertical: 10 }}
      >
        <Text style={{ fontFamily: fonts.displaySemibold, fontSize: 13, color: colors.felt[900], textAlign: 'center' }}>
          {`Tu turno — ${turnLabel}`}
        </Text>
      </LinearGradient>
    </Animated.View>
  )
}
