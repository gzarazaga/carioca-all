import { Text, View } from 'react-native'
import type { Jugador } from '../../types/game'
import GlassPanel from '../common/GlassPanel'

interface Props {
  jugadores: Jugador[]
  currentPlayerId: string | null
}

export default function PlayerList({ jugadores, currentPlayerId }: Props) {
  return (
    <GlassPanel>
      <View className="p-5">
        <Text className="font-display-semibold text-sm text-white mb-3">Jugadores ({jugadores.length}/6)</Text>
        <View className="gap-2">
          {jugadores.map((j) => (
            <View key={j.id} className="flex-row items-center gap-2 bg-felt-700/50 rounded-xl px-3.5 py-2.5">
              <View className={`w-2 h-2 rounded-full ${j.conectado ? 'bg-success-400' : 'bg-neutral-500'}`} />
              <Text className="font-body-medium text-white">{j.nombre}</Text>
              {j.id === currentPlayerId && (
                <Text className="text-[10px] font-body-bold uppercase tracking-wider bg-primary-600/25 text-primary-300 px-2 py-0.5 rounded-md ml-auto">
                  Tú
                </Text>
              )}
            </View>
          ))}
        </View>
        {jugadores.length < 2 && (
          <Text className="text-sm text-warning-300 mt-3">
            Se necesitan al menos 2 jugadores para iniciar
          </Text>
        )}
      </View>
    </GlassPanel>
  )
}
