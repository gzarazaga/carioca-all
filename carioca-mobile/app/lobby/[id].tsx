import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGameStore } from '../../src/stores/gameStore'
import { useWebSocket } from '../../src/hooks/useWebSocket'
import * as api from '../../src/services/api'
import { loadSession } from '../../src/utils/storage'
import PlayerList from '../../src/components/lobby/PlayerList'
import GameCode from '../../src/components/lobby/GameCode'

export default function LobbyPage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const estado = useGameStore((s) => s.estado)
  const partidaId = useGameStore((s) => s.partidaId)
  const jugadorId = useGameStore((s) => s.jugadorId)
  const setSession = useGameStore((s) => s.setSession)
  const setEstado = useGameStore((s) => s.setEstado)
  const addToast = useGameStore((s) => s.addToast)

  // Restore session if needed
  useEffect(() => {
    if (partidaId || !id) return
    loadSession().then((session) => {
      if (session && session.partidaId === id) {
        setSession(session.partidaId, session.jugadorId, session.nombreJugador)
      } else {
        router.replace('/')
      }
    })
  }, [partidaId, id, setSession, router])

  // Connect WebSocket
  useWebSocket()

  // Initial fetch
  useEffect(() => {
    if (!id) return
    api.obtenerEstado(id).then(setEstado).catch(() => {
      addToast('Error al cargar partida', 'error')
      router.replace('/')
    })
  }, [id, setEstado, addToast, router])

  // Redirect when game starts
  useEffect(() => {
    if (estado?.estado === 'EN_CURSO') {
      router.replace(`/game/${id}`)
    } else if (estado?.estado === 'FINALIZADA') {
      router.replace(`/results/${id}`)
    }
  }, [estado?.estado, id, router])

  const handleStart = async () => {
    if (!id) return
    try {
      const newEstado = await api.iniciarPartida(id)
      setEstado(newEstado)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al iniciar', 'error')
    }
  }

  const canStart = estado && estado.jugadores.length >= 2

  return (
    <SafeAreaView className="flex-1 bg-green-900">
      <View className="flex-1 items-center justify-center p-4">
        <View className="max-w-md w-full gap-6">
          <View className="items-center">
            <Text className="text-3xl font-bold mb-1 text-white">🃏 Sala de espera</Text>
            <Text className="text-green-300">Esperando jugadores...</Text>
          </View>

          {id && <GameCode partidaId={id} />}

          {estado && (
            <PlayerList jugadores={estado.jugadores} currentPlayerId={jugadorId} />
          )}

          <Pressable
            onPress={handleStart}
            disabled={!canStart}
            className={`w-full px-4 py-3 bg-yellow-600 active:bg-yellow-700 rounded-lg ${!canStart ? 'opacity-50' : ''}`}
          >
            <Text className="font-bold text-lg text-white text-center">
              {canStart ? 'Iniciar partida' : 'Esperando mas jugadores...'}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/')}
            className="w-full px-4 py-2 bg-gray-600 active:bg-gray-700 rounded-lg"
          >
            <Text className="text-sm text-white text-center">Volver al inicio</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}
