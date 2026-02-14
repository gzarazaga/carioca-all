import type { Carta, Jugador, Formacion, EstadoJuego } from '../../types/game'

export function createCarta(overrides: Partial<Carta> = {}): Carta {
  return {
    id: 'carta-1',
    valor: '7',
    palo: 'CORAZONES',
    notacion: '7C',
    puntos: 7,
    ...overrides,
  }
}

export function createJugador(overrides: Partial<Jugador> = {}): Jugador {
  return {
    id: 'jugador-1',
    nombre: 'Jugador 1',
    cartasEnMano: 7,
    puntosTotales: 0,
    haBajado: false,
    conectado: true,
    cartas: null,
    ...overrides,
  }
}

export function createFormacion(overrides: Partial<Formacion> = {}): Formacion {
  return {
    id: 'formacion-1',
    tipo: 'PIERNA',
    propietarioId: 'jugador-1',
    cartas: [
      createCarta({ id: 'c1', valor: '7', palo: 'CORAZONES', notacion: '7C' }),
      createCarta({ id: 'c2', valor: '7', palo: 'DIAMANTES', notacion: '7D' }),
      createCarta({ id: 'c3', valor: '7', palo: 'TREBOLES', notacion: '7T' }),
    ],
    ...overrides,
  }
}

export function createEstadoJuego(overrides: Partial<EstadoJuego> = {}): EstadoJuego {
  return {
    partidaId: 'partida-1',
    estado: 'EN_CURSO',
    numeroRonda: 1,
    descripcionRonda: '2 Piernas',
    estadoTurno: 'ESPERANDO_ROBAR',
    jugadorActualId: 'jugador-1',
    jugadorActualNombre: 'Jugador 1',
    cartasEnMazo: 40,
    cartaSuperiorDescarte: createCarta({ id: 'descarte-1', valor: 'K', palo: 'PICAS', notacion: 'KP', puntos: 10 }),
    jugadores: [
      createJugador({ id: 'jugador-1', nombre: 'Jugador 1' }),
      createJugador({ id: 'jugador-2', nombre: 'Jugador 2' }),
    ],
    formacionesEnMesa: [],
    fechaCreacion: '2026-01-01T00:00:00Z',
    fechaInicio: '2026-01-01T00:01:00Z',
    ganadorId: null,
    ...overrides,
  }
}

export function createDefaultCartas(): Carta[] {
  return [
    createCarta({ id: 'h1', valor: 'A', palo: 'CORAZONES', notacion: 'AC', puntos: 15 }),
    createCarta({ id: 'h2', valor: '3', palo: 'CORAZONES', notacion: '3C', puntos: 3 }),
    createCarta({ id: 'h3', valor: '7', palo: 'DIAMANTES', notacion: '7D', puntos: 7 }),
    createCarta({ id: 'h4', valor: '7', palo: 'PICAS', notacion: '7P', puntos: 7 }),
    createCarta({ id: 'h5', valor: '7', palo: 'TREBOLES', notacion: '7T', puntos: 7 }),
    createCarta({ id: 'h6', valor: 'Q', palo: 'DIAMANTES', notacion: 'QD', puntos: 10 }),
    createCarta({ id: 'h7', valor: 'JOKER', palo: null, notacion: 'JK', puntos: 50 }),
  ]
}