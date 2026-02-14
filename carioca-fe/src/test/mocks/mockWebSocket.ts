import { vi } from 'vitest'

export const mockConnect = vi.fn()
export const mockDisconnect = vi.fn()
export const mockOnMessage = vi.fn(() => vi.fn()) // returns unsubscribe function

vi.mock('../../services/websocket', () => ({
  GameWebSocket: vi.fn().mockImplementation(() => ({
    connect: mockConnect,
    disconnect: mockDisconnect,
    onMessage: mockOnMessage,
  })),
}))

export function resetWebSocketMocks() {
  mockConnect.mockReset()
  mockDisconnect.mockReset()
  mockOnMessage.mockReset().mockImplementation(() => vi.fn())
}