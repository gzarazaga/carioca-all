package com.carioca.domain.exception;

/**
 * Excepción lanzada cuando no se encuentra un jugador.
 */
public class JugadorNoEncontradoException extends RuntimeException {

    public JugadorNoEncontradoException(String jugadorId) {
        super("Jugador no encontrado: " + jugadorId);
    }
}
