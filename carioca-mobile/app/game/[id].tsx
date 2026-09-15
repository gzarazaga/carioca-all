import { useEffect } from 'react'
import { View, Text, Modal } from 'react-native'
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
import Button from '../../src/components/common/Button'
import GlassPanel from '../../src/components/common/GlassPanel'
import NeonBackground from '../../src/components/common/NeonBackground'
import { TrophyIcon } from '../../src/components/common/icons'

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
    <SafeAreaView className="flex-1 bg-felt-900">
      <NeonBackground variant="success" />
      <GameBoard />
      <ActionBar />
      <FormationBuilder />
      <PegarDialog />

      {/* Round end overlay */}
      <Modal visible={!!roundEndInfo} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center p-4">
          <GlassPanel style={{ width: '100%', maxWidth: 420, borderRadius: 24 }}>
            <View className="p-6 items-center">
              <Text className="font-display-semibold text-xl text-white mb-4">Ronda terminada!</Text>
              {estado && roundEndInfo && (
                <Scoreboard jugadores={estado.jugadores} ganadorId={roundEndInfo.ganadorId} />
              )}
              <Button onPress={() => setRoundEndInfo(null)} variant="primary" size="md" style={{ marginTop: 16, width: '100%' }}>
                Continuar
              </Button>
            </View>
          </GlassPanel>
        </View>
      </Modal>

      {/* Game end overlay */}
      <Modal visible={!!gameEndInfo} transparent animationType="fade">
        <View className="flex-1 bg-black/70 items-center justify-center p-4">
          <GlassPanel style={{ width: '100%', maxWidth: 420, borderRadius: 24, borderColor: 'rgba(237,180,23,0.5)' }}>
            <View className="p-6 items-center">
              <View className="flex-row items-center gap-2 mb-2">
                <TrophyIcon size={26} color="#eba000" />
                <Text className="font-display-bold text-2xl text-warning-400">Partida terminada!</Text>
              </View>
              <Text className="text-felt-300 mb-4 text-sm">Redirigiendo a resultados...</Text>
              {estado && gameEndInfo && (
                <Scoreboard jugadores={estado.jugadores} ganadorId={gameEndInfo.ganadorId} />
              )}
            </View>
          </GlassPanel>
        </View>
      </Modal>
    </SafeAreaView>
  )
}
