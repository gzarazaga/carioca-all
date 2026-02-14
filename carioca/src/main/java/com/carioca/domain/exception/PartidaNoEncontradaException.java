package com.carioca.domain.exception;

/**
 * Excepción lanzada cuando no se encuentra una partida.
 */
public class PartidaNoEncontradaException extends RuntimeException {

    public PartidaNoEncontradaException(String partidaId) {
        super("Partida no encontrada: " + partidaId);
    }
}
