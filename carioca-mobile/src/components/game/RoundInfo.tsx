import { Text, View } from 'react-native'
import { useGameStore } from '../../stores/gameStore'
import GlassPanel from '../common/GlassPanel'

export default function RoundInfo() {
  const estado = useGameStore((s) => s.estado)
  if (!estado) return null

  return (
    <GlassPanel>
      <View className="px-5 py-2.5 items-center">
        <Text className="text-[10px] uppercase tracking-wider text-felt-300">Ronda {estado.numeroRonda} / 7</Text>
        <Text className="font-display-semibold text-sm text-white mt-0.5">{estado.descripcionRonda}</Text>
      </View>
    </GlassPanel>
  )
}
