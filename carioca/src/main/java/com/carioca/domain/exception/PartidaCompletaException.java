package com.carioca.domain.exception;

/**
 * Excepción lanzada cuando se intenta unir a una partida que ya tiene el máximo de jugadores.
 */
public class PartidaCompletaException extends RuntimeException {

    public PartidaCompletaException(String mensaje) {
        super(mensaje);
    }
}
