import type { EstadoJuego, PartidaResponse, MovimientoResponse, Carta, FormacionInput } from '../types/game'

const BASE = '/api/partidas'

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const body = await res.text()
    let message: string
    try {
      const parsed = JSON.parse(body)
      message = parsed.message || parsed.mensaje || parsed.error || body
    } catch {
      message = body || `Error ${res.status}`
    }
    throw new Error(message)
  }
  return res.json()
}

export function crearPartida(nombreJugador: string): Promise<PartidaResponse> {
  return request(`${BASE}`, {
    method: 'POST',
    body: JSON.stringify({ nombreJugador }),
  })
}

export function unirsePartida(partidaId: string, nombreJugador: string): Promise<PartidaResponse> {
  return request(`${BASE}/${partidaId}/unirse`, {
    method: 'POST',
    body: JSON.stringify({ nombreJugador }),
  })
}

export function obtenerEstado(partidaId: string): Promise<EstadoJuego> {
  return request(`${BASE}/${partidaId}`)
}

export function iniciarPartida(partidaId: string): Promise<EstadoJuego> {
  return request(`${BASE}/${partidaId}/iniciar`, { method: 'POST' })
}

export function robarCarta(partidaId: string, jugadorId: string, delMazo: boolean): Promise<MovimientoResponse> {
  return request(`${BASE}/${partidaId}/juego/robar`, {
    method: 'POST',
    body: JSON.stringify({ jugadorId, delMazo }),
  })
}

export function descartarCarta(partidaId: string, jugadorId: string, cartaId: string): Promise<MovimientoResponse> {
  return request(`${BASE}/${partidaId}/juego/descartar`, {
    method: 'POST',
    body: JSON.stringify({ jugadorId, cartaId }),
  })
}

export function bajarFormacion(
  partidaId: string,
  jugadorId: string,
  formaciones: FormacionInput[],
): Promise<MovimientoResponse> {
  return request(`${BASE}/${partidaId}/juego/bajar`, {
    method: 'POST',
    body: JSON.stringify({ jugadorId, formaciones }),
  })
}

export function pegarCarta(
  partidaId: string,
  jugadorId: string,
  cartaId: string,
  formacionId: string,
  alInicio: boolean,
): Promise<MovimientoResponse> {
  return request(`${BASE}/${partidaId}/juego/pegar`, {
    method: 'POST',
    body: JSON.stringify({ jugadorId, cartaId, formacionId, alInicio }),
  })
}

export function obtenerCartas(partidaId: string, jugadorId: string): Promise<Carta[]> {
  return request(`${BASE}/${partidaId}/jugadores/${jugadorId}/cartas`)
}

export function obtenerJugador(partidaId: string, jugadorId: string) {
  return request<import('../types/game').Jugador>(`${BASE}/${partidaId}/jugadores/${jugadorId}`)
}
