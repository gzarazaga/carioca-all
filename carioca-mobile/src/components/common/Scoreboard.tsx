import { View, Text } from 'react-native'
import type { Jugador } from '../../types/game'

interface Props {
  jugadores: Jugador[]
  ganadorId?: string | null
}

export default function Scoreboard({ jugadores, ganadorId }: Props) {
  const sorted = [...jugadores].sort((a, b) => a.puntosTotales - b.puntosTotales)

  return (
    <View className="bg-green-800/60 rounded-lg p-4 w-full max-w-md">
      <Text className="text-lg font-bold mb-3 text-center text-white">Tabla de puntos</Text>

      <View className="flex-row border-b border-green-600 pb-1">
        <Text className="text-green-300 text-sm w-8">#</Text>
        <Text className="text-green-300 text-sm flex-1">Jugador</Text>
        <Text className="text-green-300 text-sm">Puntos</Text>
      </View>

      {sorted.map((j, i) => {
        const isWinner = j.id === ganadorId
        return (
          <View
            key={j.id}
            className="flex-row items-center border-b border-green-700/30 py-2"
          >
            <Text className={`text-sm w-8 ${isWinner ? 'text-yellow-300 font-bold' : 'text-white'}`}>
              {i + 1}
            </Text>
            <Text className={`flex-1 ${isWinner ? 'text-yellow-300 font-bold' : 'text-white'}`}>
              {j.nombre}
              {isWinner && ' 🏆'}
            </Text>
            <Text className={`font-mono ${isWinner ? 'text-yellow-300 font-bold' : 'text-white'}`}>
              {j.puntosTotales}
            </Text>
          </View>
        )
      })}
    </View>
  )
}
