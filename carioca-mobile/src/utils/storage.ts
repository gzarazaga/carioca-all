import AsyncStorage from '@react-native-async-storage/async-storage'

const STORAGE_KEY = 'carioca_session'

interface SessionData {
  partidaId: string
  jugadorId: string
  nombreJugador: string
}

export async function saveSession(data: SessionData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export async function loadSession(): Promise<SessionData | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY)
}
