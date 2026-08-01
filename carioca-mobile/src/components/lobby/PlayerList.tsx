import { View, Text } from 'react-native'
import type { Jugador } from '../../types/game'

interface Props {
  jugadores: Jugador[]
  currentPlayerId: string | null
}

export default function PlayerList({ jugadores, currentPlayerId }: Props) {
  return (
    <View className="bg-green-800/60 rounded-lg p-4">
      <Text className="text-lg font-bold mb-3 text-white">Jugadores ({jugadores.length}/6)</Text>
      <View className="gap-2">
        {jugadores.map((j) => (
          <View
            key={j.id}
            className="flex-row items-center gap-2 bg-green-700/40 rounded px-3 py-2"
          >
            <View className={`w-2 h-2 rounded-full ${j.conectado ? 'bg-green-400' : 'bg-gray-500'}`} />
            <Text className="font-medium text-white">{j.nombre}</Text>
            {j.id === currentPlayerId && (
              <Text className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded ml-auto">Tu</Text>
            )}
          </View>
        ))}
      </View>
      {jugadores.length < 2 && (
        <Text className="text-sm text-yellow-300 mt-3">
          Se necesitan al menos 2 jugadores para iniciar
        </Text>
      )}
    </View>
  )
}
