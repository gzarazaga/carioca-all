import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGameStore } from '../../src/stores/gameStore'
import * as api from '../../src/services/api'
import { clearSession, loadSession } from '../../src/utils/storage'
import Scoreboard from '../../src/components/common/Scoreboard'

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
    <SafeAreaView className="flex-1 bg-green-900">
      <View className="flex-1 items-center justify-center p-4">
        <View className="max-w-md w-full gap-6 items-center">
          <Text className="text-4xl font-bold text-white text-center">
            {isWinner ? '🎉 Ganaste!' : '🏆 Fin de la partida'}
          </Text>

          {ganador && (
            <Text className="text-xl text-yellow-300 text-center">
              Ganador: <Text className="font-bold">{ganador.nombre}</Text> con {ganador.puntosTotales} puntos
            </Text>
          )}

          {estado && (
            <Scoreboard jugadores={estado.jugadores} ganadorId={estado.ganadorId} />
          )}

          <Pressable
            onPress={handleNewGame}
            className="w-full px-4 py-3 bg-blue-600 active:bg-blue-700 rounded-lg"
          >
            <Text className="font-bold text-lg text-white text-center">Nueva partida</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
