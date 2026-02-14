package com.carioca.domain.usecase.juego.robarcarta;

/**
 * Caso de uso para robar una carta del mazo o descarte.
 */
public interface RobarCartaUseCase {

    /**
     * Ejecuta la acción de robar una carta.
     *
     * @param command Datos del comando
     * @return Información de la carta robada
     */
    CartaRobada ejecutar(RobarCartaCommand command);
}
