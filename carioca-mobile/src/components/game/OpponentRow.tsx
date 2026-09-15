import { Text, View } from 'react-native'
import { useOpponents, useGameStore } from '../../stores/gameStore'
import CardBack from '../card/CardBack'
import GlassPanel from '../common/GlassPanel'

export default function OpponentRow() {
  const opponents = useOpponents()
  const currentPlayerId = useGameStore((s) => s.estado?.jugadorActualId)

  return (
    <View className="flex-row gap-3 justify-center flex-wrap">
      {opponents.map((opp) => {
        const isCurrent = opp.id === currentPlayerId
        return (
          <GlassPanel key={opp.id} style={isCurrent ? { borderColor: '#edb417', borderWidth: 2 } : undefined}>
            <View className="items-center gap-1.5 px-4 py-2.5">
              <Text className="text-sm font-body-semibold text-white">
                {opp.nombre}
                {!opp.conectado && <Text className="text-danger-400"> (offline)</Text>}
              </Text>
              <View className="flex-row items-center">
                {Array.from({ length: Math.min(opp.cartasEnMano, 6) }).map((_, i) => (
                  <View key={i} style={{ marginLeft: i === 0 ? 0 : -14 }}>
                    <CardBack small />
                  </View>
                ))}
                {opp.cartasEnMano > 6 && (
                  <Text className="text-xs text-white ml-2">+{opp.cartasEnMano - 6}</Text>
                )}
              </View>
              <Text className="text-xs text-felt-300">
                {opp.cartasEnMano} cartas · {opp.puntosTotales} pts
                {opp.haBajado && <Text className="text-warning-300"> · Bajado</Text>}
              </Text>
            </View>
          </GlassPanel>
        )
      })}
    </View>
  )
}
