import { useState, useEffect } from 'react'
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as api from '../src/services/api'
import { useGameStore } from '../src/stores/gameStore'
import { saveSession, loadSession, clearSession } from '../src/utils/storage'
import Button from '../src/components/common/Button'
import GlassPanel from '../src/components/common/GlassPanel'
import NeonBackground from '../src/components/common/NeonBackground'
import { neonTitleStyle } from '../src/theme'

interface SavedSession {
  partidaId: string
  jugadorId: string
  nombreJugador: string
}

export default function HomePage() {
  const router = useRouter()
  const setSession = useGameStore((s) => s.setSession)
  const addToast = useGameStore((s) => s.addToast)

  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [savedSession, setSavedSession] = useState<SavedSession | null>(null)

  useEffect(() => {
    loadSession().then((session) => {
      if (session) setSavedSession(session)
    })
  }, [])

  const handleCreate = async () => {
    if (!nombre.trim() || nombre.trim().length < 2) {
      addToast('El nombre debe tener al menos 2 caracteres', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await api.crearPartida(nombre.trim())
      setSession(res.partidaId, res.jugadorId, res.nombreJugador)
      await saveSession({ partidaId: res.partidaId, jugadorId: res.jugadorId, nombreJugador: res.nombreJugador })
      router.push(`/lobby/${res.partidaId}`)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al crear partida', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    if (!nombre.trim() || nombre.trim().length < 2) {
      addToast('El nombre debe tener al menos 2 caracteres', 'error')
      return
    }
    if (!codigo.trim()) {
      addToast('Ingresa el codigo de la partida', 'error')
      return
    }
    setLoading(true)
    try {
      const res = await api.unirsePartida(codigo.trim(), nombre.trim())
      setSession(res.partidaId, res.jugadorId, res.nombreJugador)
      await saveSession({ partidaId: res.partidaId, jugadorId: res.jugadorId, nombreJugador: res.nombreJugador })
      router.push(`/lobby/${res.partidaId}`)
    } catch (e) {
      addToast(e instanceof Error ? e.message : 'Error al unirse', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleRejoin = async () => {
    if (!savedSession) return
    setSession(savedSession.partidaId, savedSession.jugadorId, savedSession.nombreJugador)
    try {
      const estado = await api.obtenerEstado(savedSession.partidaId)
      if (estado.estado === 'EN_CURSO') {
        router.push(`/game/${savedSession.partidaId}`)
      } else if (estado.estado === 'FINALIZADA') {
        router.push(`/results/${savedSession.partidaId}`)
      } else {
        router.push(`/lobby/${savedSession.partidaId}`)
      }
    } catch {
      await clearSession()
      setSavedSession(null)
      addToast('Sesion anterior no encontrada', 'error')
    }
  }

  const handleDiscardSession = async () => {
    await clearSession()
    setSavedSession(null)
  }

  return (
    <SafeAreaView className="flex-1 bg-felt-900">
      <NeonBackground variant="success" />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerClassName="flex-1 items-center justify-center p-5">
          <View className="w-full gap-6" style={{ maxWidth: 420 }}>
            <View className="items-center gap-1.5">
              <Text className="font-display-extrabold text-4xl" style={neonTitleStyle}>
                Carioca
              </Text>
              <Text className="text-felt-300 text-sm">Juego de cartas para 2-6 jugadores</Text>
            </View>

            <GlassPanel>
              <View className="p-6 gap-5">
                {savedSession && (
                  <View className="bg-warning-600/20 border border-warning-500/40 rounded-xl p-3.5 gap-2.5">
                    <Text className="text-sm text-warning-200">
                      Tenés una partida en curso como <Text className="font-body-bold">{savedSession.nombreJugador}</Text>
                    </Text>
                    <View className="flex-row gap-2">
                      <Button onPress={handleRejoin} variant="warning" size="sm" style={{ flex: 1 }}>
                        Volver a la partida
                      </Button>
                      <Button onPress={handleDiscardSession} variant="neutral" size="sm">
                        Descartar
                      </Button>
                    </View>
                  </View>
                )}

                <View>
                  <Text className="text-[11px] font-body-bold uppercase tracking-wider text-felt-300 mb-2">Tu nombre</Text>
                  <TextInput
                    value={nombre}
                    onChangeText={setNombre}
                    placeholder="Ingresá tu nombre"
                    placeholderTextColor="#535461"
                    maxLength={50}
                    className="w-full px-4 py-3.5 bg-felt-800/80 border border-felt-600 rounded-xl text-white"
                  />
                </View>

                <Button onPress={handleCreate} disabled={loading} variant="primary" size="lg">
                  Crear nueva partida
                </Button>

                <View className="flex-row items-center gap-3">
                  <View className="flex-1 h-px bg-felt-600" />
                  <Text className="text-felt-400 text-[11px] uppercase tracking-wider">o unirse a una</Text>
                  <View className="flex-1 h-px bg-felt-600" />
                </View>

                <View className="flex-row gap-2">
                  <TextInput
                    value={codigo}
                    onChangeText={setCodigo}
                    placeholder="Código de partida"
                    placeholderTextColor="#535461"
                    className="flex-1 px-4 py-3.5 bg-felt-800/80 border border-felt-600 rounded-xl text-white"
                  />
                  <Button onPress={handleJoin} disabled={loading} variant="success" size="lg">
                    Unirse
                  </Button>
                </View>
              </View>
            </GlassPanel>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
