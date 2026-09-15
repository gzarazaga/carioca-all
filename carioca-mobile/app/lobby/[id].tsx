import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGameStore } from '../../src/stores/gameStore'
import { useWebSocket } from '../../src/hooks/useWebSocket'
import * as api from '../../src/services/api'
import { loadSession } from '../../src/utils/storage'
import PlayerList from '../../src/components/lobby/PlayerList'
import GameCode from '../../src/components/lobby/GameCode'
import Button from '../../src/components/common/Button'
import NeonBackground from '../../src/components/common/NeonBackground'
import { neonTitleStyle } from '../../src/theme'

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
    <SafeAreaView className="flex-1 bg-felt-900">
      <NeonBackground variant="success" />
      <View className="flex-1 items-center justify-center p-5">
        <View className="w-full gap-5" style={{ maxWidth: 420 }}>
          <View className="items-center">
            <Text className="font-display-extrabold text-2xl mb-1" style={neonTitleStyle}>
              Sala de espera
            </Text>
            <Text className="text-felt-300 text-sm">Esperando jugadores...</Text>
          </View>

          {id && <GameCode partidaId={id} />}

          {estado && <PlayerList jugadores={estado.jugadores} currentPlayerId={jugadorId} />}

          <Button onPress={handleStart} disabled={!canStart} variant="warning" size="lg">
            {canStart ? 'Iniciar partida' : 'Esperando más jugadores...'}
          </Button>

          <Button onPress={() => router.replace('/')} variant="neutral" size="md" bold={false}>
            Volver al inicio
          </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}
