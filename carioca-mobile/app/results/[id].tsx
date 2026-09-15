import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGameStore } from '../../src/stores/gameStore'
import * as api from '../../src/services/api'
import { clearSession, loadSession } from '../../src/utils/storage'
import Scoreboard from '../../src/components/common/Scoreboard'
import Button from '../../src/components/common/Button'
import NeonBackground from '../../src/components/common/NeonBackground'
import { TrophyIcon, SparkIcon } from '../../src/components/common/icons'

export default function ResultsPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const estado = useGameStore((s) => s.estado)
  const setEstado = useGameStore((s) => s.setEstado)
  const setSession = useGameStore((s) => s.setSession)
  const partidaId = useGameStore((s) => s.partidaId)
  const jugadorId = useGameStore((s) => s.jugadorId)
  const reset = useGameStore((s) => s.reset)

  // Restore session if needed
  useEffect(() => {
    if (partidaId || !id) return
    loadSession().then((session) => {
      if (session && session.partidaId === id) {
        setSession(session.partidaId, session.jugadorId, session.nombreJugador)
      }
    })
  }, [partidaId, id, setSession])

  // Fetch final state
  useEffect(() => {
    if (!id) return
    api.obtenerEstado(id).then(setEstado).catch(() => {})
  }, [id, setEstado])

  const ganador = estado?.jugadores.find((j) => j.id === estado?.ganadorId)
  const isWinner = estado?.ganadorId === jugadorId

  const handleNewGame = async () => {
    await clearSession()
    reset()
    router.replace('/')
  }

  return (
    <SafeAreaView className="flex-1 bg-felt-900">
      <NeonBackground variant="warning" />
      <View className="flex-1 items-center justify-center p-5">
        <View className="w-full gap-6 items-center" style={{ maxWidth: 420 }}>
          <View className="flex-row items-center gap-2.5">
            {isWinner ? <SparkIcon size={28} /> : <TrophyIcon size={28} />}
            <Text className="font-display-extrabold text-3xl text-warning-400">
              {isWinner ? '¡Ganaste!' : 'Fin de la partida'}
            </Text>
          </View>

          {ganador && (
            <Text className="text-xl text-warning-300 text-center">
              Ganador: <Text className="font-body-bold">{ganador.nombre}</Text> con {ganador.puntosTotales} puntos
            </Text>
          )}

          {estado && <Scoreboard jugadores={estado.jugadores} ganadorId={estado.ganadorId} />}

          <Button onPress={handleNewGame} variant="primary" size="lg" style={{ width: '100%' }}>
            Nueva partida
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
