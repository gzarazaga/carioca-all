import { Text, View } from 'react-native'
import type { Jugador } from '../../types/game'
import GlassPanel from './GlassPanel'
import { TrophyIcon } from './icons'

interface Props {
  jugadores: Jugador[]
  ganadorId?: string | null
}

export default function Scoreboard({ jugadores, ganadorId }: Props) {
  const sorted = [...jugadores].sort((a, b) => a.puntosTotales - b.puntosTotales)

  return (
    <GlassPanel style={{ width: '100%', maxWidth: 400 }}>
      <View className="p-5">
        <Text className="font-display-semibold text-base text-white mb-3 text-center">Tabla de puntos</Text>

        <View className="flex-row border-b border-felt-600 pb-1.5">
          <Text className="text-felt-300 text-[11px] uppercase tracking-wider w-8">#</Text>
          <Text className="text-felt-300 text-[11px] uppercase tracking-wider flex-1">Jugador</Text>
          <Text className="text-felt-300 text-[11px] uppercase tracking-wider">Puntos</Text>
        </View>

        {sorted.map((j, i) => {
          const isWinner = j.id === ganadorId
          return (
            <View key={j.id} className="flex-row items-center border-b border-felt-700/30 py-2">
              <Text className={`text-sm w-8 ${isWinner ? 'text-warning-300 font-body-bold' : 'text-white'}`}>
                {i + 1}
              </Text>
              <View className="flex-1 flex-row items-center gap-1.5">
                <Text className={`${isWinner ? 'text-warning-300 font-body-bold' : 'text-white'}`}>{j.nombre}</Text>
                {isWinner && <TrophyIcon size={14} color="#f2c86c" />}
              </View>
              <Text className={`font-mono ${isWinner ? 'text-warning-300 font-body-bold' : 'text-white'}`}>
                {j.puntosTotales}
              </Text>
            </View>
          )
        })}
      </View>
    </GlassPanel>
  )
}
