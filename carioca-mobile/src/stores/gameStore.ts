import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'
import type { Carta, EstadoJuego, Formacion } from '../types/game'

interface ToastMessage {
  id: number
  text: string
  type: 'info' | 'success' | 'error'
}

interface GameState {
  // Session
  partidaId: string | null
  jugadorId: string | null
  nombreJugador: string | null

  // Game state from server
  estado: EstadoJuego | null
  misCartas: Carta[]

  // UI state
  selectedCardIds: string[]
  showFormationBuilder: boolean
  showPegarDialog: boolean
  pegarFormacionId: string | null
  toasts: ToastMessage[]
  loading: boolean
  roundEndInfo: { ganadorId: string; puntos: Record<string, number> } | null
  gameEndInfo: { ganadorId: string; puntosTotales: Record<string, number> } | null

  // Actions
  setSession: (partidaId: string, jugadorId: string, nombreJugador: string) => void
  setEstado: (estado: EstadoJuego) => void
  setMisCartas: (cartas: Carta[]) => void
  toggleCardSelection: (cardId: string) => void
  clearSelection: () => void
  setShowFormationBuilder: (show: boolean) => void
  setShowPegarDialog: (show: boolean, formacionId?: string) => void
  addToast: (text: string, type?: 'info' | 'success' | 'error') => void
  removeToast: (id: number) => void
  setLoading: (loading: boolean) => void
  setRoundEndInfo: (info: { ganadorId: string; puntos: Record<string, number> } | null) => void
  setGameEndInfo: (info: { ganadorId: string; puntosTotales: Record<string, number> } | null) => void
  reset: () => void
}

let toastId = 0

export const useGameStore = create<GameState>((set) => ({
  partidaId: null,
  jugadorId: null,
  nombreJugador: null,
  estado: null,
  misCartas: [],
  selectedCardIds: [],
  showFormationBuilder: false,
  showPegarDialog: false,
  pegarFormacionId: null,
  toasts: [],
  loading: false,
  roundEndInfo: null,
  gameEndInfo: null,

  setSession: (partidaId, jugadorId, nombreJugador) =>
    set({ partidaId, jugadorId, nombreJugador }),

  setEstado: (estado) => set({ estado }),

  setMisCartas: (cartas) => set({ misCartas: cartas }),

  toggleCardSelection: (cardId) =>
    set((s) => ({
      selectedCardIds: s.selectedCardIds.includes(cardId)
        ? s.selectedCardIds.filter((id) => id !== cardId)
        : [...s.selectedCardIds, cardId],
    })),

  clearSelection: () => set({ selectedCardIds: [] }),

  setShowFormationBuilder: (show) =>
    set({ showFormationBuilder: show }),

  setShowPegarDialog: (show, formacionId) =>
    set({ showPegarDialog: show, pegarFormacionId: formacionId ?? null }),

  addToast: (text, type = 'info') => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, text, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  setLoading: (loading) => set({ loading }),

  setRoundEndInfo: (info) => set({ roundEndInfo: info }),

  setGameEndInfo: (info) => set({ gameEndInfo: info }),

  reset: () =>
    set({
      partidaId: null,
      jugadorId: null,
      nombreJugador: null,
      estado: null,
      misCartas: [],
      selectedCardIds: [],
      showFormationBuilder: false,
      showPegarDialog: false,
      pegarFormacionId: null,
      loading: false,
      roundEndInfo: null,
      gameEndInfo: null,
    }),
}))

// Derived selectors
export function useIsMyTurn(): boolean {
  return useGameStore((s) => s.estado?.jugadorActualId === s.jugadorId)
}

export function useMyPlayer() {
  return useGameStore((s) => s.estado?.jugadores.find((j) => j.id === s.jugadorId))
}

export function useOpponents() {
  return useGameStore(
    useShallow((s) => s.estado?.jugadores.filter((j) => j.id !== s.jugadorId) ?? []),
  )
}

export function useFormaciones(): Formacion[] {
  return useGameStore(
    useShallow((s) => s.estado?.formacionesEnMesa ?? []),
  )
}
