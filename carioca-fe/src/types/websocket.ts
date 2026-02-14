export interface WsMessage {
  tipo: string
  partidaId?: string
  payload?: Record<string, unknown>
  timestamp?: number
}

export type WsMessageType =
  | 'JOIN_ACK'
  | 'PONG'
  | 'ERROR'
  | 'ESTADO_PARTIDA'
  | 'TURNO'
  | 'CARTA_ROBADA'
  | 'CARTA_DESCARTADA'
  | 'FORMACION_BAJADA'
  | 'CARTA_PEGADA'
  | 'FIN_RONDA'
  | 'FIN_PARTIDA'
  | 'TUS_CARTAS'
  | 'JUGADOR_UNIDO'
