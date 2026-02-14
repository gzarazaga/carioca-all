package com.carioca.domain.exception;

/**
 * Excepción lanzada cuando un jugador intenta actuar fuera de su turno.
 */
public class TurnoInvalidoException extends RuntimeException {

    public TurnoInvalidoException(String mensaje) {
        super(mensaje);
    }
}
