import { vi } from 'vitest'

export const mockCrearPartida = vi.fn()
export const mockUnirsePartida = vi.fn()
export const mockObtenerEstado = vi.fn()
export const mockIniciarPartida = vi.fn()
export const mockRobarCarta = vi.fn()
export const mockDescartarCarta = vi.fn()
export const mockBajarFormacion = vi.fn()
export const mockPegarCarta = vi.fn()
export const mockObtenerCartas = vi.fn()
export const mockObtenerJugador = vi.fn()

vi.mock('../../services/api', () => ({
  crearPartida: mockCrearPartida,
  unirsePartida: mockUnirsePartida,
  obtenerEstado: mockObtenerEstado,
  iniciarPartida: mockIniciarPartida,
  robarCarta: mockRobarCarta,
  descartarCarta: mockDescartarCarta,
  bajarFormacion: mockBajarFormacion,
  pegarCarta: mockPegarCarta,
  obtenerCartas: mockObtenerCartas,
  obtenerJugador: mockObtenerJugador,
}))

export function resetApiMocks() {
  mockCrearPartida.mockReset()
  mockUnirsePartida.mockReset()
  mockObtenerEstado.mockReset()
  mockIniciarPartida.mockReset()
  mockRobarCarta.mockReset()
  mockDescartarCarta.mockReset()
  mockBajarFormacion.mockReset()
  mockPegarCarta.mockReset()
  mockObtenerCartas.mockReset()
  mockObtenerJugador.mockReset()
}