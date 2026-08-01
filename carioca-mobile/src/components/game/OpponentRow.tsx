import { View, Text } from 'react-native'
import { useOpponents, useGameStore } from '../../stores/gameStore'
import CardBack from '../card/CardBack'

export default function OpponentRow() {
  const opponents = useOpponents()
  const currentPlayerId = useGameStore((s) => s.estado?.jugadorActualId)

  return (
    <View className="flex-row gap-6 justify-center flex-wrap">
      {opponents.map((opp) => {
        const isCurrent = opp.id === currentPlayerId
        return (
          <View
            key={opp.id}
            className={`items-center gap-1 p-2 rounded-lg ${isCurrent ? 'bg-green-800/60 border-2 border-yellow-400' : ''}`}
          >
            <Text className="text-sm font-bold text-white">
              {opp.nombre}
              {!opp.conectado && <Text className="text-red-400"> (offline)</Text>}
            </Text>
            <View className="flex-row items-center">
              {Array.from({ length: Math.min(opp.cartasEnMano, 6) }).map((_, i) => (
                <View key={i} style={{ marginLeft: i === 0 ? 0 : -12 }}>
                  <CardBack small />
                </View>
              ))}
              {opp.cartasEnMano > 6 && (
                <Text className="text-xs text-white ml-2">+{opp.cartasEnMano - 6}</Text>
              )}
            </View>
            <Text className="text-xs text-green-300">
              {opp.cartasEnMano} cartas · {opp.puntosTotales} pts
              {opp.haBajado && <Text className="text-yellow-300"> · Bajado</Text>}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
