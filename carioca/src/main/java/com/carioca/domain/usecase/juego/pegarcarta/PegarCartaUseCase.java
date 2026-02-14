package com.carioca.domain.usecase.juego.pegarcarta;

/**
 * Caso de uso para pegar una carta a una formación existente.
 */
public interface PegarCartaUseCase {

    /**
     * Pega una carta a una formación existente (propia o ajena).
     *
     * @param command Datos del comando
     */
    void ejecutar(PegarCartaCommand command);
}
