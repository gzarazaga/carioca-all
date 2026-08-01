import { useState, useEffect } from 'react'
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import * as api from '../src/services/api'
import { useGameStore } from '../src/stores/gameStore'
import { saveSession, loadSession, clearSession } from '../src/utils/storage'

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
    <SafeAreaView className="flex-1 bg-green-900">
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="flex-1 items-center justify-center p-4">
        <View className="max-w-md w-full gap-6">
          <View className="items-center">
            <Text className="text-5xl font-bold mb-2 text-white text-center">🃏 Carioca</Text>
            <Text className="text-green-300">Juego de cartas para 2-6 jugadores</Text>
          </View>

          {savedSession && (
            <View className="bg-yellow-600/20 border border-yellow-500/40 rounded-lg p-4 gap-2">
              <Text className="text-sm text-yellow-200 mb-2">
                Tienes una partida en curso como <Text className="font-bold">{savedSession.nombreJugador}</Text>
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleRejoin}
                  className="px-4 py-2 bg-yellow-600 active:bg-yellow-700 rounded-lg"
                >
                  <Text className="font-bold text-sm text-white">Volver a la partida</Text>
                </Pressable>
                <Pressable
                  onPress={handleDiscardSession}
                  className="px-4 py-2 bg-gray-600 active:bg-gray-700 rounded-lg"
                >
                  <Text className="text-sm text-white">Descartar</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View>
            <Text className="text-sm text-green-300 mb-1">Tu nombre</Text>
            <TextInput
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingresa tu nombre"
              placeholderTextColor="#6ee7a5"
              maxLength={50}
              className="w-full px-4 py-3 bg-green-800 border border-green-600 rounded-lg text-white"
            />
          </View>

          <Pressable
            onPress={handleCreate}
            disabled={loading}
            className={`w-full px-4 py-3 bg-blue-600 active:bg-blue-700 rounded-lg ${loading ? 'opacity-50' : ''}`}
          >
            <Text className="font-bold text-lg text-white text-center">Crear nueva partida</Text>
          </Pressable>

          <View className="flex-row items-center gap-4">
            <View className="flex-1 h-px bg-green-600" />
            <Text className="text-green-400 text-sm">o unirse a una</Text>
            <View className="flex-1 h-px bg-green-600" />
          </View>

          <View className="flex-row gap-2">
            <TextInput
              value={codigo}
              onChangeText={setCodigo}
              placeholder="Codigo de partida"
              placeholderTextColor="#6ee7a5"
              className="flex-1 px-4 py-3 bg-green-800 border border-green-600 rounded-lg text-white"
            />
            <Pressable
              onPress={handleJoin}
              disabled={loading}
              className={`px-6 py-3 bg-green-600 active:bg-green-700 rounded-lg justify-center ${loading ? 'opacity-50' : ''}`}
            >
              <Text className="font-bold text-white">Unirse</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
