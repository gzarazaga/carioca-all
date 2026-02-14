const STORAGE_KEY = 'carioca_session'

interface SessionData {
  partidaId: string
  jugadorId: string
  nombreJugador: string
}

export function saveSession(data: SessionData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function loadSession(): SessionData | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
