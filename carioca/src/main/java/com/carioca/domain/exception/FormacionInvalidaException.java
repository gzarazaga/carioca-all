package com.carioca.domain.exception;

/**
 * Excepción lanzada cuando una formación de cartas no es válida.
 */
public class FormacionInvalidaException extends RuntimeException {

    public FormacionInvalidaException(String mensaje) {
        super(mensaje);
    }
}
