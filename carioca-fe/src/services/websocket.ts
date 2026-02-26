import type { WsMessage } from '../types/websocket'

type MessageHandler = (msg: WsMessage) => void

export class GameWebSocket {
  private ws: WebSocket | null = null
  private pingInterval: ReturnType<typeof setInterval> | null = null
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null
  private handlers: MessageHandler[] = []
  private partidaId: string = ''
  private jugadorId: string = ''
  private shouldReconnect = true

  connect(partidaId: string, jugadorId: string): void {
    this.partidaId = partidaId
    this.jugadorId = jugadorId
    this.shouldReconnect = true
    this.doConnect()
  }

  private doConnect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return

    const wsUrl = import.meta.env.DEV
      ? 'ws://localhost:8080/ws'
      : (import.meta.env.VITE_WS_URL ?? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`)
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      this.send({ tipo: 'JOIN', partidaId: this.partidaId, jugadorId: this.jugadorId })
      this.startPing()
    }

    this.ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data)
        this.handlers.forEach((h) => h(msg))
      } catch {
        // ignore unparseable messages
      }
    }

    this.ws.onclose = () => {
      this.stopPing()
      if (this.shouldReconnect) {
        this.reconnectTimeout = setTimeout(() => this.doConnect(), 3000)
      }
    }

    this.ws.onerror = () => {
      this.ws?.close()
    }
  }

  disconnect(): void {
    this.shouldReconnect = false
    this.stopPing()
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    this.ws?.close()
    this.ws = null
  }

  onMessage(handler: MessageHandler): () => void {
    this.handlers.push(handler)
    return () => {
      this.handlers = this.handlers.filter((h) => h !== handler)
    }
  }

  private send(data: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data))
    }
  }

  private startPing(): void {
    this.stopPing()
    this.pingInterval = setInterval(() => {
      this.send({ tipo: 'PING' })
    }, 30000)
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }
}
