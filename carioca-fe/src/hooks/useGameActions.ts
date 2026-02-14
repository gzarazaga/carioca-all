import { useCallback } from 'react'
import * as api from '../services/api'
import { useGameStore } from '../stores/gameStore'

export function useGameActions() {
  const partidaId = useGameStore((s) => s.partidaId)
  const jugadorId = useGameStore((s) => s.jugadorId)

  const refresh = useCallback(async () => {
    if (!partidaId || !jugadorId) return
    try {
      const [estado, cartas] = await Promise.all([
        api.obtenerEstado(partidaId),
        api.obtenerCartas(partidaId, jugadorId),
      ])
      useGameStore.getState().setEstado(estado)
      useGameStore.getState().setMisCartas(cartas)
    } catch (e) {
      useGameStore.getState().addToast(
        e instanceof Error ? e.message : 'Error al actualizar',
        'error',
      )
    }
  }, [partidaId, jugadorId])

  const robar = useCallback(
    async (delMazo: boolean) => {
      if (!partidaId || !jugadorId) return
      useGameStore.getState().setLoading(true)
      try {
        await api.robarCarta(partidaId, jugadorId, delMazo)
        await refresh()
      } catch (e) {
        useGameStore.getState().addToast(
          e instanceof Error ? e.message : 'Error al robar',
          'error',
        )
      } finally {
        useGameStore.getState().setLoading(false)
      }
    },
    [partidaId, jugadorId, refresh],
  )

  const descartar = useCallback(
    async (cartaId: string) => {
      if (!partidaId || !jugadorId) return
      useGameStore.getState().setLoading(true)
      try {
        await api.descartarCarta(partidaId, jugadorId, cartaId)
        useGameStore.getState().clearSelection()
        await refresh()
      } catch (e) {
        useGameStore.getState().addToast(
          e instanceof Error ? e.message : 'Error al descartar',
          'error',
        )
      } finally {
        useGameStore.getState().setLoading(false)
      }
    },
    [partidaId, jugadorId, refresh],
  )

  const bajar = useCallback(
    async (tipo: 'PIERNA' | 'ESCALERA', cartaIds: string[]) => {
      if (!partidaId || !jugadorId) return
      useGameStore.getState().setLoading(true)
      try {
        await api.bajarFormacion(partidaId, jugadorId, tipo, cartaIds)
        useGameStore.getState().clearSelection()
        useGameStore.getState().setShowFormationBuilder(false)
        useGameStore.getState().addToast('Formacion bajada!', 'success')
        await refresh()
      } catch (e) {
        useGameStore.getState().addToast(
          e instanceof Error ? e.message : 'Error al bajar',
          'error',
        )
      } finally {
        useGameStore.getState().setLoading(false)
      }
    },
    [partidaId, jugadorId, refresh],
  )

  const pegar = useCallback(
    async (cartaId: string, formacionId: string, alInicio: boolean) => {
      if (!partidaId || !jugadorId) return
      useGameStore.getState().setLoading(true)
      try {
        await api.pegarCarta(partidaId, jugadorId, cartaId, formacionId, alInicio)
        useGameStore.getState().clearSelection()
        useGameStore.getState().setShowPegarDialog(false)
        useGameStore.getState().addToast('Carta pegada!', 'success')
        await refresh()
      } catch (e) {
        useGameStore.getState().addToast(
          e instanceof Error ? e.message : 'Error al pegar',
          'error',
        )
      } finally {
        useGameStore.getState().setLoading(false)
      }
    },
    [partidaId, jugadorId, refresh],
  )

  return { refresh, robar, descartar, bajar, pegar }
}
