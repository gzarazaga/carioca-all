import { useEffect, useRef } from 'react'
import { GameWebSocket } from '../services/websocket'
import { useGameStore } from '../stores/gameStore'
import * as api from '../services/api'
import type { WsMessage } from '../types/websocket'

export function useWebSocket() {
  const wsRef = useRef<GameWebSocket | null>(null)
  const partidaId = useGameStore((s) => s.partidaId)
  const jugadorId = useGameStore((s) => s.jugadorId)
  const { setEstado, setMisCartas, addToast, setRoundEndInfo, setGameEndInfo } = useGameStore.getState()

  useEffect(() => {
    if (!partidaId || !jugadorId) return

    const ws = new GameWebSocket()
    wsRef.current = ws

    const refreshState = async () => {
      try {
        const [estado, cartas] = await Promise.all([
          api.obtenerEstado(partidaId),
          api.obtenerCartas(partidaId, jugadorId),
        ])
        setEstado(estado)
        setMisCartas(cartas)
      } catch (err) {
        console.error('[WS] Error refreshing state:', err)
      }
    }

    const unsubscribe = ws.onMessage((msg: WsMessage) => {
      switch (msg.tipo) {
        case 'JOIN_ACK':
          refreshState()
          break

        case 'ESTADO_PARTIDA':
        case 'TURNO':
        case 'CARTA_ROBADA':
        case 'CARTA_DESCARTADA':
        case 'FORMACION_BAJADA':
        case 'CARTA_PEGADA':
        case 'JUGADOR_UNIDO':
          refreshState()
          break

        case 'TUS_CARTAS':
          if (msg.payload?.cartas) {
            setMisCartas(msg.payload.cartas as import('../types/game').Carta[])
          } else {
            refreshState()
          }
          break

        case 'FIN_RONDA':
          if (msg.payload) {
            setRoundEndInfo({
              ganadorId: msg.payload.ganadorId as string,
              puntos: msg.payload.puntos as Record<string, number>,
            })
            addToast(`Ronda terminada`, 'info')
          }
          refreshState()
          break

        case 'FIN_PARTIDA':
          if (msg.payload) {
            setGameEndInfo({
              ganadorId: msg.payload.ganadorId as string,
              puntosTotales: msg.payload.puntosTotales as Record<string, number>,
            })
            addToast('Partida terminada!', 'success')
          }
          refreshState()
          break

        case 'ERROR':
          addToast(
            (msg.payload?.mensaje as string) ?? 'Error del servidor',
            'error',
          )
          break
      }
    })

    ws.connect(partidaId, jugadorId)

    return () => {
      unsubscribe()
      ws.disconnect()
      wsRef.current = null
    }
  }, [partidaId, jugadorId])

  return wsRef
}
