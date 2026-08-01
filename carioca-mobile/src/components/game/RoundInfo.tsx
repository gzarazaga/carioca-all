import { View, Text } from 'react-native'
import { useGameStore } from '../../stores/gameStore'

export default function RoundInfo() {
  const estado = useGameStore((s) => s.estado)
  if (!estado) return null

  return (
    <View className="bg-green-800/80 rounded-lg px-4 py-2 items-center">
      <Text className="text-sm text-green-300">Ronda {estado.numeroRonda} / 7</Text>
      <Text className="text-lg font-bold text-white">{estado.descripcionRonda}</Text>
    </View>
  )
}
