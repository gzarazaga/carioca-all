export interface Carta {
  id: string
  valor: string
  palo: string | null
  notacion: string
  puntos: number
}

export interface Jugador {
  id: string
  nombre: string
  cartasEnMano: number
  puntosTotales: number
  haBajado: boolean
  conectado: boolean
  cartas: Carta[] | null
}

export interface Formacion {
  id: string
  tipo: 'PIERNA' | 'ESCALERA'
  propietarioId: string
  cartas: Carta[]
}

export interface EstadoJuego {
  partidaId: string
  estado: 'ESPERANDO_JUGADORES' | 'EN_CURSO' | 'FINALIZADA'
  numeroRonda: number
  descripcionRonda: string
  estadoTurno: 'ESPERANDO_ROBAR' | 'ESPERANDO_DESCARTAR' | null
  jugadorActualId: string | null
  jugadorActualNombre: string | null
  cartasEnMazo: number
  cartaSuperiorDescarte: Carta | null
  jugadores: Jugador[]
  formacionesEnMesa: Formacion[]
  fechaCreacion: string
  fechaInicio: string | null
  ganadorId: string | null
}

export interface PartidaResponse {
  partidaId: string
  jugadorId: string
  nombreJugador: string
  mensaje: string
}

export interface MovimientoResponse {
  tipo: string
  exito: boolean
  mensaje: string
  carta?: Carta
  formacion?: { id: string; tipo: string }
}
