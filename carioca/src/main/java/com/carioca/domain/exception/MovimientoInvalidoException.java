package com.carioca.domain.exception;

/**
 * Excepción lanzada cuando se intenta realizar un movimiento inválido.
 */
public class MovimientoInvalidoException extends RuntimeException {

    public MovimientoInvalidoException(String mensaje) {
        super(mensaje);
    }
}
