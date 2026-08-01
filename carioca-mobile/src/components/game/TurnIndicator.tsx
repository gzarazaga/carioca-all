import { View, Text } from 'react-native'
import { useGameStore, useIsMyTurn } from '../../stores/gameStore'

export default function TurnIndicator() {
  const estado = useGameStore((s) => s.estado)
  const isMyTurn = useIsMyTurn()

  if (!estado || estado.estado !== 'EN_CURSO') return null

  const turnLabel = estado.estadoTurno === 'ESPERANDO_ROBAR'
    ? 'debe robar'
    : 'debe descartar'

  return (
    <View className={`rounded-lg px-4 py-2 items-center ${isMyTurn ? 'bg-yellow-500' : 'bg-green-800/80'}`}>
      <Text className={`font-bold ${isMyTurn ? 'text-black' : 'text-white'}`}>
        {isMyTurn
          ? `Tu turno — ${turnLabel}`
          : `Turno de ${estado.jugadorActualNombre}`}
      </Text>
    </View>
  )
}
