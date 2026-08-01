import { useEffect } from 'react'
import { View, Text, Pressable, Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useGameStore } from '../../src/stores/gameStore'
import { useWebSocket } from '../../src/hooks/useWebSocket'
import { useGameActions } from '../../src/hooks/useGameActions'
import { loadSession } from '../../src/utils/storage'
import GameBoard from '../../src/components/game/GameBoard'
import ActionBar from '../../src/components/actions/ActionBar'
import FormationBuilder from '../../src/components/actions/FormationBuilder'
import PegarDialog from '../../src/components/actions/PegarDialog'
import Scoreboard from '../../src/components/common/Scoreboard'

export default function GamePage() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const estado = useGameStore((s) => s.estado)
  const partidaId = useGameStore((s) => s.partidaId)
  const setSession = useGameStore((s) => s.setSession)
  const roundEndInfo = useGameStore((s) => s.roundEndInfo)
  const setRoundEndInfo = useGameStore((s) => s.setRoundEndInfo)
  const gameEndInfo = useGameStore((s) => s.gameEndInfo)

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

  // Connect WebSocket + initial fetch
  useWebSocket()
  const { refresh } = useGameActions()

  useEffect(() => {
    if (partidaId) refresh()
  }, [partidaId, refresh])

  // Redirect when game ends
  useEffect(() => {
    if (estado?.estado === 'FINALIZADA' || gameEndInfo) {
      const timer = setTimeout(() => router.replace(`/results/${id}`), 3000)
      return () => clearTimeout(timer)
    }
  }, [estado?.estado, gameEndInfo, id, router])

  return (
    <SafeAreaView className="flex-1 bg-green-900">
      <GameBoard />
      <ActionBar />
      <FormationBuilder />
      <PegarDialog />

      {/* Round end overlay */}
      <Modal visible={!!roundEndInfo} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center p-4">
          <View className="bg-green-900 border border-green-600 rounded-xl p-6 max-w-md w-full items-center">
            <Text className="text-2xl font-bold mb-4 text-white">Ronda terminada!</Text>
            {estado && roundEndInfo && (
              <Scoreboard jugadores={estado.jugadores} ganadorId={roundEndInfo.ganadorId} />
            )}
            <Pressable
              onPress={() => setRoundEndInfo(null)}
              className="mt-4 px-6 py-2 bg-blue-600 rounded-lg"
            >
              <Text className="font-bold text-white">Continuar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Game end overlay */}
      <Modal visible={!!gameEndInfo} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center p-4">
          <View className="bg-green-900 border border-yellow-500 rounded-xl p-6 max-w-md w-full items-center">
            <Text className="text-3xl font-bold mb-2 text-white">🏆 Partida terminada!</Text>
            <Text className="text-green-300 mb-4">Redirigiendo a resultados...</Text>
            {estado && gameEndInfo && (
              <Scoreboard jugadores={estado.jugadores} ganadorId={gameEndInfo.ganadorId} />
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
