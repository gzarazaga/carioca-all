package com.carioca.domain.model.partida;

/**
 * Estados del turno de un jugador.
 */
public enum EstadoTurno {
    /**
     * El jugador debe robar una carta (del mazo o descarte).
     */
    ESPERANDO_ROBAR,

    /**
     * El jugador debe descartar una carta para finalizar su turno.
     * Antes de descartar puede bajar formaciones o pegar cartas.
     */
    ESPERANDO_DESCARTAR
}
