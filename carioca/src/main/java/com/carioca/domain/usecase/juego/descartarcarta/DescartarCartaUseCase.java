package com.carioca.domain.usecase.juego.descartarcarta;

/**
 * Caso de uso para descartar una carta.
 */
public interface DescartarCartaUseCase {

    /**
     * Descarta una carta y termina el turno del jugador.
     *
     * @param command Datos del comando
     */
    void ejecutar(DescartarCartaCommand command);
}
